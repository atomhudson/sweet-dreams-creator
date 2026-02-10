-- ============================================================
-- DIAGNOSTIC + FIX: Admin & Contractor access to contracts/lands
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- STEP 1: Check if user_roles table has entries
-- (If empty, the has_role() function always returns false → RLS blocks everything)
SELECT ur.user_id, ur.role, p.full_name
FROM public.user_roles ur
LEFT JOIN public.profiles p ON p.user_id = ur.user_id
ORDER BY ur.role, p.full_name;

-- STEP 2: Backfill user_roles from profiles for users missing entries
-- This handles users who were created before the trigger existed,
-- or cases where the trigger failed
INSERT INTO public.user_roles (user_id, role)
SELECT p.user_id, p.role
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = p.user_id AND ur.role = p.role
);

-- STEP 3: Verify RLS policies exist (just for diagnostics)
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN ('contracts', 'lands', 'profiles', 'user_roles')
ORDER BY tablename, policyname;

-- STEP 4: Recreate admin/contractor policies IF they are missing
-- (Using IF NOT EXISTS pattern with DO blocks)

-- Admin: view all contracts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contracts' AND policyname = 'Admins can view all contracts'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can view all contracts" ON public.contracts FOR SELECT USING (public.has_role(auth.uid(), ''admin''))';
  END IF;
END $$;

-- Admin: update all contracts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contracts' AND policyname = 'Admins can update all contracts'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can update all contracts" ON public.contracts FOR UPDATE USING (public.has_role(auth.uid(), ''admin''))';
  END IF;
END $$;

-- Admin: view all lands
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lands' AND policyname = 'Admins can view all lands'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can view all lands" ON public.lands FOR SELECT USING (public.has_role(auth.uid(), ''admin''))';
  END IF;
END $$;

-- Contractor: view available lands
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lands' AND policyname = 'Contractors can view available lands'
  ) THEN
    EXECUTE 'CREATE POLICY "Contractors can view available lands" ON public.lands FOR SELECT USING (public.has_role(auth.uid(), ''contractor'') AND is_lended = false)';
  END IF;
END $$;

-- Contractor: view own contracts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contracts' AND policyname = 'Contractors can view own contracts'
  ) THEN
    EXECUTE 'CREATE POLICY "Contractors can view own contracts" ON public.contracts FOR SELECT USING (auth.uid() = contractor_id)';
  END IF;
END $$;

-- Contractor: insert contracts (for sending proposals)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contracts' AND policyname = 'Contractors can insert contracts'
  ) THEN
    EXECUTE 'CREATE POLICY "Contractors can insert contracts" ON public.contracts FOR INSERT WITH CHECK (auth.uid() = contractor_id)';
  END IF;
END $$;

-- Contractor: update own contracts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contracts' AND policyname = 'Contractors can update own contracts'
  ) THEN
    EXECUTE 'CREATE POLICY "Contractors can update own contracts" ON public.contracts FOR UPDATE USING (auth.uid() = contractor_id)';
  END IF;
END $$;
