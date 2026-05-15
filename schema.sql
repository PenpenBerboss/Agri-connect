-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'buyer', -- 'admin', 'farmer', 'buyer'
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' (default), 'active', 'suspended'
    avatar_url TEXT,
    phone TEXT,
    city TEXT,
    neighborhood TEXT,
    lat DECIMAL(9, 6),
    lng DECIMAL(9, 6),
    region TEXT,
    language TEXT DEFAULT 'fr',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Migration for existing tables
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS neighborhood TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lat DECIMAL(9, 6);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lng DECIMAL(9, 6);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'fr';

ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_name TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS unit TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS location JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS harvest_period TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS season TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'disponible';
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS favorites_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS contact_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 1) DEFAULT 0.0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS recommendation_tags TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS keywords TEXT[];

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update all profiles." ON profiles;
CREATE POLICY "Admins can update all profiles." ON profiles FOR UPDATE USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );

-- Function/Trigger for auto-profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'name', 
    new.email, 
    COALESCE(new.raw_user_meta_data ->> 'role', 'buyer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    product_type TEXT,
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    seller_name TEXT,
    unit TEXT,
    stock INTEGER DEFAULT 0,
    images TEXT[],
    location JSONB,
    harvest_period TEXT,
    season TEXT,
    availability_status TEXT DEFAULT 'disponible',
    views INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    contact_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 1) DEFAULT 0.0,
    reviews_count INTEGER DEFAULT 0,
    recommendation_tags TEXT[],
    keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Storage setup
-- Create buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for Storage
-- Allow anyone to view images
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id IN ('products', 'profiles'));

-- Products RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public can read products (marketplace)
DROP POLICY IF EXISTS "Public can view products" ON products;
CREATE POLICY "Public can view products" ON products FOR SELECT
USING (true);

-- Allow authenticated users to upload to products
DROP POLICY IF EXISTS "Auth Upload Products" ON storage.objects;
CREATE POLICY "Auth Upload Products" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Allow users to upload their own profile pictures (using user ID as folder name)
DROP POLICY IF EXISTS "Profiles Upload" ON storage.objects;
CREATE POLICY "Profiles Upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'profiles' AND auth.role() = 'authenticated');

-- Allow users to delete their own uploads
DROP POLICY IF EXISTS "Users Delete Own Images" ON storage.objects;
CREATE POLICY "Users Delete Own Images" ON storage.objects FOR DELETE 
USING (auth.uid() = owner);


-- Orders table (modified to remove payment details)
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'delivered', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
