#!/bin/bash

# Core dependencies
npm install next@15.1.3 react@19 react-dom@19

# Essential Radix UI components (only the ones that exist)
npm install @radix-ui/react-slot
npm install @radix-ui/react-label
npm install @radix-ui/react-separator
npm install @radix-ui/react-dialog
npm install @radix-ui/react-tooltip
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-toast

# Other dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install next-themes date-fns @hello-pangea/dnd
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate
npm install lucide-react

# Dev dependencies
npm install -D @types/node @types/react @types/react-dom
npm install -D autoprefixer postcss tailwindcss typescript
npm install -D eslint eslint-config-next

echo "✅ All dependencies installed successfully!"
echo "Now run: npm run dev"
