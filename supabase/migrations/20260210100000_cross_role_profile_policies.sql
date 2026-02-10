
-- Allow contractors to view farmer profiles (for land browsing and contract display)
CREATE POLICY "Contractors can view farmer profiles" ON public.profiles
  FOR SELECT USING (
    public.has_role(auth.uid(), 'contractor') AND role = 'farmer'
  );

-- Allow farmers to view contractor profiles (for contract display)
CREATE POLICY "Farmers can view contractor profiles" ON public.profiles
  FOR SELECT USING (
    public.has_role(auth.uid(), 'farmer') AND role = 'contractor'
  );
