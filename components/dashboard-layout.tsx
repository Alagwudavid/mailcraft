"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Mail,
  Settings,
  LogOut,
  User,
  Bell,
  Search,
  Folder,
  FileText,
  Users,
  Palette,
  BookOpen,
  Gift,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Projects", href: "/dashboard", icon: Folder },
  { name: "Templates", href: "/dashboard?tab=templates", icon: FileText },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Brand", href: "/dashboard/brand", icon: Palette, badge: "Beta" },
  { name: "Learn", href: "/dashboard/learn", icon: BookOpen },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, profile, signOut } = useAuth()
  const pathname = usePathname()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-[#2a2a2a] border-r border-white/10">
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-white/10">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-lg">MailCraft</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            Free
          </Badge>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-white/10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-3 hover:bg-white/5">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-white text-sm">
                    {profile?.public_username ? getInitials(profile.public_username) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium truncate">
                    {profile?.display_name || profile?.public_username || "Loading..."}
                  </div>
                  <div className="text-xs text-white/60 truncate">
                    {profile?.public_username || "Generating username..."}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href.includes("?tab=") && pathname === "/dashboard")

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Upgrade Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Recommend Wizard</span>
            </div>
            <p className="text-xs text-white/70 mb-3">and get 1 month Pro for free</p>
            <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
              <span>568/400 components used</span>
              <span className="text-secondary">142%</span>
            </div>
            <Progress value={142} className="h-1 mb-3" />
            <Button size="sm" className="w-full bg-white text-black hover:bg-white/90">
              Refer
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="border-b border-white/10 bg-[#1a1a1a]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">Start creating</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search"
                  className="pl-10 w-80 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>

              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
