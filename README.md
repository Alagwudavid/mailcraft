# MailCraft - Email Template Builder

A modern, full-stack email template builder built with Next.js, Supabase, and TailwindCSS.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account and project

### Environment Setup

1. Create a `.env.local` file in the root directory
2. Add your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

### Finding Your Supabase Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project API keys** → `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### Database Setup

1. In your Supabase project, go to SQL Editor
2. Run the SQL script from `scripts/create-tables.sql` to create the required tables

### Installation

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Magic Links)
- **Styling**: TailwindCSS + shadcn/ui
- **Language**: TypeScript
- **Drag & Drop**: @hello-pangea/dnd

## 📁 Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── scripts/               # Database scripts
└── public/               # Static assets
\`\`\`

## 🎨 Features

- **Landing Page**: Modern hero section with dark/light mode
- **Authentication**: Passwordless magic link login
- **Dashboard**: Template management with search and filtering
- **Editor**: Drag-and-drop block-based email template editor
- **Preview**: Real-time email preview
- **Export**: HTML export for email campaigns

## 🚀 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## 📝 License

This project is licensed under the MIT License.
