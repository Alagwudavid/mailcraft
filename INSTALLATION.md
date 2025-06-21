# Installation Guide

## Step 1: Install Dependencies Manually

The shadcn CLI had issues with some package names. Please install dependencies manually:

### Core Dependencies
\`\`\`bash
npm install next@15.1.3 react@19 react-dom@19
\`\`\`

### UI Components (Radix UI)
\`\`\`bash
npm install @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-separator
npm install @radix-ui/react-dialog @radix-ui/react-tooltip @radix-ui/react-dropdown-menu
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar
npm install @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-hover-card
npm install @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover
npm install @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area
npm install @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-switch
npm install @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle
npm install @radix-ui/react-toggle-group
\`\`\`

### Other Dependencies
\`\`\`bash
npm install @supabase/supabase-js @supabase/ssr
npm install next-themes date-fns @hello-pangea/dnd
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate
npm install lucide-react
\`\`\`

### Dev Dependencies
\`\`\`bash
npm install -D @types/node @types/react @types/react-dom
npm install -D autoprefixer postcss tailwindcss typescript
npm install -D eslint eslint-config-next
\`\`\`

## Step 2: Initialize shadcn/ui

After installing dependencies, initialize shadcn/ui:

\`\`\`bash
npx shadcn@latest init
\`\`\`

When prompted, choose:
- TypeScript: Yes
- Style: Default
- Base color: Slate
- CSS variables: Yes

## Step 3: Add Required Components

\`\`\`bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add dropdown-menu
npx shadcn@latest add dialog
npx shadcn@latest add toast
npx shadcn@latest add separator
npx shadcn@latest add sidebar
\`\`\`

## Step 4: Environment Variables

Create `.env.local`:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## Step 5: Run the Application

\`\`\`bash
npm run dev
\`\`\`

## Troubleshooting

If you encounter any package conflicts:

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install`
3. If issues persist, try `npm install --legacy-peer-deps`

## Alternative: Use the Provided package.json

Simply copy the `package.json` from this project and run:
\`\`\`bash
npm install
