# Gabriel Myeye Portfolio

A modern, high-performance portfolio website for Gabriel Myeye - Health Information Scientist, Data Analyst, and AI Enthusiast.

## Features

### Frontend (Public Site)
- **Hero Section**: Animated marquee with name and positioning statement
- **About Section**: Professional background with value proposition
- **Projects**: Case study cards with detailed project views
- **Skills**: Categorized skill display with proficiency indicators
- **Certificates**: Gallery with modal preview and issuer filters
- **Experience & Education**: Timeline view of career history
- **Contact**: Form with social links and location info

### Admin Dashboard (CMS)
- Secure authentication with Supabase Auth
- CRUD operations for all content types:
  - Projects
  - Certificates
  - Blog Posts
  - Gallery
  - Experience
  - Education
  - Skills
  - Contact Messages
- Profile settings management

## Tech Stack

- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animation**: GSAP + ScrollTrigger
- **Smooth Scroll**: Lenis
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Routing**: React Router DOM

## Project Structure

```
src/
├── admin/              # Admin dashboard components
│   ├── AdminLogin.tsx
│   ├── AdminDashboard.tsx
│   └── sections/       # Admin management sections
├── components/         # Shared components
│   ├── Navigation.tsx
│   └── Footer.tsx
├── context/            # React context
│   └── AuthContext.tsx
├── hooks/              # Custom hooks
│   ├── useData.ts
│   ├── useScrollAnimation.ts
│   └── use-toast.ts
├── lib/                # Utilities
│   └── supabase.ts
├── sections/           # Public page sections
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── Skills.tsx
│   ├── Certificates.tsx
│   ├── Experience.tsx
│   └── Contact.tsx
├── types/              # TypeScript types
│   ├── index.ts
│   └── database.ts
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env
```

4. Add your Supabase credentials to `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Supabase Setup

### Database Schema

Run the following SQL in your Supabase SQL editor to create the required tables:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  headline TEXT,
  bio TEXT,
  location TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  linkedin TEXT,
  github TEXT,
  twitter TEXT,
  cv_url TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  problem TEXT,
  approach TEXT,
  tools TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  outcomes TEXT,
  featured BOOLEAN DEFAULT false,
  start_date DATE,
  end_date DATE,
  project_url TEXT,
  github_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project media table
CREATE TABLE project_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificates table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_url TEXT,
  media_url TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery table
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_url TEXT NOT NULL,
  caption TEXT,
  category TEXT DEFAULT 'other' CHECK (category IN ('profile', 'event', 'speaking', 'project', 'other')),
  "order" INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience table
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  description TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education table
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school TEXT NOT NULL,
  program TEXT NOT NULL,
  degree TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  details TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('data_bi', 'databases', 'ai_ml', 'digital_health', 'research', 'programming', 'tools', 'soft_skills')),
  level INTEGER CHECK (level >= 0 AND level <= 100),
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (status = 'published');
CREATE POLICY "Public read access" ON project_media FOR SELECT USING (true);
CREATE POLICY "Public read access" ON certificates FOR SELECT USING (status = 'published');
CREATE POLICY "Public read access" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public read access" ON gallery FOR SELECT USING (status = 'published');
CREATE POLICY "Public read access" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read access" ON education FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);

-- Create policies for authenticated users (admin)
CREATE POLICY "Admin full access" ON profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON project_media FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON certificates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
```

### Storage Setup

1. Create a storage bucket named `portfolio-media`
2. Set the bucket to public
3. Create the following folder structure:
   - `projects/` - Project images
   - `certificates/` - Certificate images/PDFs
   - `gallery/` - Gallery images
   - `posts/` - Blog post featured images
   - `profile/` - Profile images

### Authentication Setup

1. Enable Email authentication in Supabase Auth settings
2. Create an admin user:
   - Go to Authentication > Users
   - Click "Add user"
   - Enter email and password
   - Confirm the email

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add environment variables in Netlify dashboard
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Deploy

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  electric: {
    DEFAULT: "#2A6BFF",
    light: "#5B8FFF",
    dark: "#1a4fcc",
  },
  charcoal: {
    DEFAULT: "#0A0A0A",
    light: "#141414",
    lighter: "#1a1a1a",
  },
}
```

### Content

Update the sample data in each section component with your own information, or connect to Supabase to manage content dynamically.

## License

MIT License - feel free to use this template for your own portfolio!

## Credits

- Design inspired by [Kael Donovan](https://kael-donovan.vercel.app/)
- Icons by [Lucide](https://lucide.dev/)
- UI Components by [shadcn/ui](https://ui.shadcn.com/)
