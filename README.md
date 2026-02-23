# Study Control System

A production-ready Web App optimized for Vercel deployment, built with Next.js 14, Tailwind CSS, Supabase, and Recharts.

## Folder Structure

\`\`\`text
study-control-system/
├── src/
│   ├── app/
│   │   ├── (app)/               # Protected routes
│   │   │   ├── analytics/       # Weekly Analytics 
│   │   │   ├── backlog/         # Backlog Tracker 
│   │   │   ├── daily-log/       # Daily Logs 
│   │   │   ├── dashboard/       # Dashboard with summary
│   │   │   ├── routine/         # Smart Routine logic
│   │   │   └── layout.tsx       # App Layout with Sidebar
│   │   ├── auth/                # Auth handlers (signout)
│   │   ├── login/               # Authentication page
│   │   ├── globals.css          # Global Tailwind styles
│   │   └── layout.tsx           # Global Root Layout
│   ├── components/              # Reusable components
│   │   └── Sidebar.tsx          # Main App Sidebar
│   └── lib/
│       ├── constants.ts         # Hardcoded Subjects & Timetable
│       └── supabase/            # Supabase Server/Client configs
├── supabase/                    
│   └── migrations/              # Supabase DB schema & RLS policies
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── package.json
└── README.md
\`\`\`

## Environment Variables

To run locally and deploy to Vercel, you will need the following environment variables (defined in your Supabase project):

Create a `.env.local` file in the root directory:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

You can find these values in your Supabase Dashboard under **Project Settings > API**.

## Supabase Setup (Finished)

Your Supabase schema and RLS policies have been successfully pushed to the project:
`https://supabase.com/dashboard/project/veneqwdjesenmoszsvow`

It contains the `daily_logs` and `backlog_tracker` tables securely behind Row Level Security (RLS) policies.

## Vercel Deployment

Deploying to Vercel is highly optimized for this stack.

1. **Commit and Push to GitHub**:
   \`\`\`bash
   git add .
   git commit -m "Initial commit of Study Control System"
   git branch -M main
   # Link to your github repo and push
   git remote add origin https://github.com/yourusername/study-control-system.git
   git push -u origin main
   \`\`\`

2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com/) and click **Add New Project**.
   - Import the GitHub repository you just created.

3. **Configure Environment Variables in Vercel**:
   - During the import process, expand the **Environment Variables** section.
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

4. **Deploy**:
   - Click **Deploy**. Vercel will automatically detect Next.js and run the build command (`npm run build`).

Once deployed, any commits pushed to the `main` branch will automatically trigger a production build on Vercel!
