#!/bin/bash

echo "🚀 Installing MailCraft dependencies..."

# Install the toast dependency
npm install @radix-ui/react-toast

# Install other missing dependencies if needed
npm install @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-separator
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @supabase/supabase-js @supabase/ssr
npm install next-themes date-fns @hello-pangea/dnd
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate
npm install lucide-react

echo "✅ All dependencies installed!"
echo ""
echo "📝 Next steps:"
echo "1. Add your Supabase keys to .env.local"
echo "2. Run: npm run dev"
echo "3. The toast system is ready to use!"
