# Setup Instructions

This guide will walk you through setting up the Gabriel Myeye Portfolio from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Local Development](#local-development)
4. [Deployment](#deployment)
5. [Content Management](#content-management)

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git
- A Supabase account (free tier works fine)

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Enter a name (e.g., "gabriel-myeye-portfolio")
4. Choose a region close to your target audience
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

### 2. Get Your API Credentials

1. In your Supabase dashboard, go to Project Settings > API
2. Copy the "Project URL" - this is your `VITE_SUPABASE_URL`
3. Copy the "anon public" API key - this is your `VITE_SUPABASE_ANON_KEY`

### 3. Set Up the Database

1. In your Supabase dashboard, go to the SQL Editor
2. Create a "New query"
3. Copy and paste the entire SQL schema from the README.md file
4. Click "Run" to create all tables

### 4. Set Up Storage

1. Go to Storage in your Supabase dashboard
2. Click "New bucket"
3. Name it `portfolio-media`
4. Check "Public bucket"
5. Click "Create bucket"
6. Create these folders inside the bucket:
   - `projects/`
   - `certificates/`
   - `gallery/`
   - `posts/`
   - `profile/`

### 5. Set Up Authentication

1. Go to Authentication > Providers
2. Make sure "Email" is enabled
3. Go to Authentication > Users
4. Click "Add user"
5. Enter your admin email and password
6. Click "Create user"
7. Confirm the email address (you can do this from the Users page)

## Local Development

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd app

# Install dependencies
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Supabase credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

The admin panel is at `http://localhost:5173/admin`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click "Deploy"

### Deploy to Netlify

1. Push your code to GitHub (same as above)
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click "Add new site" > "Import an existing project"
4. Connect to GitHub and select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add Environment Variables in Site Settings
7. Click "Deploy site"

## Content Management

### Adding Content via Admin Panel

1. Navigate to `/admin` on your deployed site
2. Sign in with your admin credentials
3. Use the sidebar to navigate between different content types:
   - **Projects**: Add case studies with images, descriptions, and outcomes
   - **Certificates**: Add certifications with issuer info and credential URLs
   - **Blog Posts**: Write articles in Markdown format
   - **Gallery**: Upload photos for different categories
   - **Experience**: Add work history entries
   - **Education**: Add academic background
   - **Skills**: Add skills with categories and proficiency levels
   - **Messages**: View contact form submissions
   - **Settings**: Update profile information

### Adding Content via Supabase Directly

You can also add content directly through the Supabase dashboard:

1. Go to Table Editor
2. Select the table you want to edit
3. Click "Insert row"
4. Fill in the fields
5. Click "Save"

### Media Uploads

For media uploads to work:

1. Make sure your `portfolio-media` bucket is public
2. Upload files through the admin panel or directly to Supabase Storage
3. Reference the file URLs in your content

## Troubleshooting

### Build Errors

If you encounter build errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist
npm run build
```

### Supabase Connection Issues

1. Verify your environment variables are correct
2. Check that your Supabase project is active
3. Ensure RLS policies are set up correctly

### Authentication Issues

1. Make sure the user is created in Supabase Auth
2. Verify the email is confirmed
3. Check browser console for error messages

## Content Checklist

Before launching your portfolio, make sure you have:

### Profile
- [ ] Name and headline
- [ ] Professional bio
- [ ] Location
- [ ] Contact email
- [ ] Social media links
- [ ] Profile photo

### Projects (at least 3-5)
- [ ] Project title and slug
- [ ] Summary and full description
- [ ] Problem statement
- [ ] Approach/methodology
- [ ] Tools and technologies used
- [ ] Results/outcomes
- [ ] Project images
- [ ] Live demo link (if available)
- [ ] GitHub link (if available)

### Certificates (at least 5)
- [ ] Certificate title
- [ ] Issuer name
- [ ] Issue date
- [ ] Credential URL
- [ ] Certificate image (optional)

### Skills (at least 15)
- [ ] Organized by category
- [ ] Proficiency levels (optional)

### Experience
- [ ] Current and past positions
- [ ] Company names and locations
- [ ] Dates of employment
- [ ] Job descriptions
- [ ] Key achievements

### Education
- [ ] Degrees and certifications
- [ ] Institution names
- [ ] Dates attended
- [ ] Relevant details

## Next Steps

1. Customize the design to match your personal brand
2. Add your own content
3. Set up a custom domain
4. Configure analytics (optional)
5. Share your portfolio!

## Support

If you encounter any issues:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review the [React documentation](https://react.dev)
3. Check the [Tailwind CSS documentation](https://tailwindcss.com/docs)

## Updates

To update your portfolio:

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Vercel/Netlify will automatically deploy

---

**Happy building! 🚀**
