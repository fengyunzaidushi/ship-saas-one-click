-- Create the character_profile table in the public schema
CREATE TABLE public.character_profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    customer_id TEXT,
    price_id TEXT,
    credits INTEGER DEFAULT 0,
    valid_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC')
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_character_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = (now() AT TIME ZONE 'UTC');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_character_profile_updated_at
BEFORE UPDATE ON public.character_profile
FOR EACH ROW
EXECUTE FUNCTION update_character_profile_updated_at();

-- Create a function to automatically add a profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_character_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.character_profile (
    id, 
    email, 
    name,
    credits,
    valid_date,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    0, -- 初始credits为0
    NULL, -- 初始valid_date为空
    (now() AT TIME ZONE 'UTC'),
    (now() AT TIME ZONE 'UTC')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the handle_new_character_user function on signup
CREATE TRIGGER on_auth_character_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_character_user();

-- Add RLS (Row Level Security) policies
ALTER TABLE public.character_profile ENABLE ROW LEVEL SECURITY;


-- 读取权限：用户只能读取自己的数据
CREATE POLICY read_own_character_profile ON public.character_profile
FOR SELECT
USING (auth.uid() = id);

-- 更新权限：用户只能更新自己的数据
CREATE POLICY update_own_character_profile ON public.character_profile
FOR UPDATE
USING (auth.uid() = id);

-- 插入权限：用户只能插入自己的数据
CREATE POLICY insert_own_character_profile ON public.character_profile
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 删除权限：用户只能删除自己的数据
CREATE POLICY delete_own_character_profile ON public.character_profile
FOR DELETE
USING (auth.uid() = id);

-- 为服务角色添加完整的CRUD权限
CREATE POLICY service_role_manage_all_character_profile ON public.character_profile
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
