#!/bin/bash

# Install the main dependencies
npm install next@15.1.3 react@19 react-dom@19

# Install UI dependencies
npm install @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-separator
npm install @radix-ui/react-dialog @radix-ui/react-tooltip @radix-ui/react-dropdown-menu
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar
npm install @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-hover-card
npm install @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover
npm install @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area
npm install @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-switch
npm install @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle
npm install @radix-ui/react-toggle-group

# Install other dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install next-themes date-fns @hello-pangea/dnd
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate
npm install lucide-react

# Install dev dependencies
npm install -D @types/node @types/react @types/react-dom
npm install -D autoprefixer postcss tailwindcss typescript
npm install -D eslint eslint-config-next
