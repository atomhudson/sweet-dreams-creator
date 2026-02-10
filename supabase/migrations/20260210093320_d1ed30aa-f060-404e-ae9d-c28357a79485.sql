
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('farmer', 'contractor', 'admin');

-- User roles table (separate from profiles per security best practices)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  phone_number TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  pin_code TEXT NOT NULL DEFAULT '',
  aadhaar_number TEXT NOT NULL DEFAULT '',
  role app_role NOT NULL DEFAULT 'farmer',
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Lands table
CREATE TABLE public.lands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  area TEXT NOT NULL,
  location TEXT NOT NULL,
  pin_code TEXT NOT NULL DEFAULT '',
  land_quality TEXT NOT NULL DEFAULT 'good',
  crop_feasibility TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  is_lended BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lands" ON public.lands
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lands" ON public.lands
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lands" ON public.lands
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lands" ON public.lands
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Contractors can view available lands" ON public.lands
  FOR SELECT USING (public.has_role(auth.uid(), 'contractor') AND is_lended = false);

CREATE POLICY "Admins can view all lands" ON public.lands
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Contracts table
CREATE TYPE public.contract_status AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'active', 'completed', 'terminated');

CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES auth.users(id) NOT NULL,
  contractor_id UUID REFERENCES auth.users(id) NOT NULL,
  land_id UUID REFERENCES public.lands(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  crop_type TEXT NOT NULL DEFAULT '',
  quantity TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  status contract_status NOT NULL DEFAULT 'draft',
  admin_notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can view own contracts" ON public.contracts
  FOR SELECT USING (auth.uid() = farmer_id);

CREATE POLICY "Contractors can view own contracts" ON public.contracts
  FOR SELECT USING (auth.uid() = contractor_id);

CREATE POLICY "Farmers can insert contracts" ON public.contracts
  FOR INSERT WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Contractors can insert contracts" ON public.contracts
  FOR INSERT WITH CHECK (auth.uid() = contractor_id);

CREATE POLICY "Farmers can update own contracts" ON public.contracts
  FOR UPDATE USING (auth.uid() = farmer_id);

CREATE POLICY "Contractors can update own contracts" ON public.contracts
  FOR UPDATE USING (auth.uid() = contractor_id);

CREATE POLICY "Admins can view all contracts" ON public.contracts
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all contracts" ON public.contracts
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  type TEXT NOT NULL DEFAULT 'info',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Trigger function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'farmer')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'farmer')
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lands_updated_at
  BEFORE UPDATE ON public.lands
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
