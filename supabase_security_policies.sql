-- Enable Row Level Security on all core tables
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing ENABLE ROW LEVEL SECURITY;

-- 1. student_profiles
-- Users can only read, update, and insert their own profiles.
CREATE POLICY "Users can view own profile" 
ON student_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON student_profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON student_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 2. reviews
-- Anyone can read reviews.
CREATE POLICY "Anyone can view reviews" 
ON reviews FOR SELECT 
USING (true);

-- Authenticated users can insert their own reviews.
CREATE POLICY "Users can insert own reviews" 
ON reviews FOR INSERT 
WITH CHECK (auth.uid() = "userId");

-- Users can update their own reviews.
CREATE POLICY "Users can update own reviews" 
ON reviews FOR UPDATE 
USING (auth.uid() = "userId");

-- Users can delete their own reviews.
CREATE POLICY "Users can delete own reviews" 
ON reviews FOR DELETE 
USING (auth.uid() = "userId");

-- 3. messages
-- Users can insert messages if they are the sender.
CREATE POLICY "Users can insert own messages" 
ON messages FOR INSERT 
WITH CHECK (auth.uid() = "senderId");

-- Users can view their own messages.
CREATE POLICY "Users can view own messages" 
ON messages FOR SELECT 
USING (auth.uid() = "senderId");

-- 4. housing
-- Anyone can read housing records.
CREATE POLICY "Anyone can view housing" 
ON housing FOR SELECT 
USING (true);

-- Note: No policies for INSERT, UPDATE, or DELETE on housing for regular users.
-- Only database administrators (or users with the service_role key) can modify housing data,
-- making it secure from tampering.
