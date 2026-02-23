-- Supabase Schema for Study Tracker

-- daily_logs table
CREATE TABLE daily_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    subject TEXT NOT NULL,
    hours_studied NUMERIC NOT NULL CHECK (hours_studied >= 0),
    topic_covered TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- backlog_tracker table
CREATE TABLE backlog_tracker (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'In Progress', 'Completed')),
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
    target_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_daily_logs_modtime
BEFORE UPDATE ON daily_logs
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_backlog_tracker_modtime
BEFORE UPDATE ON backlog_tracker
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Row Level Security (RLS) policies
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE backlog_tracker ENABLE ROW LEVEL SECURITY;

-- daily_logs policies
CREATE POLICY "Users can view their own daily logs"
ON daily_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily logs"
ON daily_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily logs"
ON daily_logs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily logs"
ON daily_logs FOR DELETE
USING (auth.uid() = user_id);

-- backlog_tracker policies
CREATE POLICY "Users can view their own backlog items"
ON backlog_tracker FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own backlog items"
ON backlog_tracker FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own backlog items"
ON backlog_tracker FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own backlog items"
ON backlog_tracker FOR DELETE
USING (auth.uid() = user_id);
