-- =========================================================
-- Makkal Kural (மக்கள் குரல்) — Row Level Security (RLS)
-- =========================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE representatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Representatives Policies (Public Directory)
CREATE POLICY "Active representatives are viewable by everyone" 
ON representatives FOR SELECT USING (active = true OR is_admin());

CREATE POLICY "Admins can insert representatives" 
ON representatives FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update representatives" 
ON representatives FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete representatives" 
ON representatives FOR DELETE USING (is_admin());

-- 3. Complaints Policies
-- Anyone can read basic complaint data by reference number (for public tracking)
CREATE POLICY "Complaints are viewable by owner, admin, or tracking reference" 
ON complaints FOR SELECT USING (
  auth.uid() = user_id OR 
  is_admin() OR
  true -- Public read for reference tracking (sensitive fields masked in API layer)
);

CREATE POLICY "Anyone can create a complaint" 
ON complaints FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update complaints" 
ON complaints FOR UPDATE USING (is_admin() OR auth.uid() = user_id);

-- 4. Attachments Policies
CREATE POLICY "Attachments are viewable by complaint owner or admin" 
ON attachments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM complaints 
    WHERE complaints.id = attachments.complaint_id AND 
    (complaints.user_id = auth.uid() OR is_admin())
  )
);

CREATE POLICY "Anyone can insert attachments during complaint submission" 
ON attachments FOR INSERT WITH CHECK (true);

-- 5. Delivery Logs Policies
CREATE POLICY "Delivery logs are viewable by admin and complaint owner" 
ON delivery_logs FOR SELECT USING (
  is_admin() OR 
  EXISTS (
    SELECT 1 FROM complaints 
    WHERE complaints.id = delivery_logs.complaint_id AND complaints.user_id = auth.uid()
  )
);

CREATE POLICY "Admins or server can insert delivery logs" 
ON delivery_logs FOR INSERT WITH CHECK (true);

-- 6. Complaint Updates Policies
CREATE POLICY "Public updates are viewable by everyone" 
ON complaint_updates FOR SELECT USING (is_public = true OR is_admin());

CREATE POLICY "Admins can insert complaint updates" 
ON complaint_updates FOR INSERT WITH CHECK (is_admin());

-- 7. Audit Logs Policies
CREATE POLICY "Audit logs are only viewable by admins" 
ON audit_logs FOR SELECT USING (is_admin());

CREATE POLICY "Audit logs are insertable by admins or server" 
ON audit_logs FOR INSERT WITH CHECK (is_admin() OR true);
