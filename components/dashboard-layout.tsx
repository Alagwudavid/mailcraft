"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Mail,
  FolderOpen,
  FileText,
  Users,
  Palette,
  GraduationCap,
  LogOut,
  User,
  Menu,
  X,
  Bell,
  HelpCircle,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react" // Import signOut from next-auth/react

const navigation = [
  { name: "Projects", href: "/dashboard", icon: FolderOpen },
  { name: "Templates", href: "/dashboard", icon: FileText },
  { name: "Community", href: "/templates", icon: Users },
  { name: "Brand", href: "/dashboard/brand", icon: Palette, badge: "Beta" },
  { name: "Learn", href: "/dashboard/learn", icon: GraduationCap },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, refreshProfile } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-card/50 backdrop-blur-xl border-r border-border/50 transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">MailCraft</span>
              <Badge variant="outline" className="text-xs w-fit">
                Free
              </Badge>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-border/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-3 py-2 h-auto hover:bg-primary/5">
                <Avatar className="mr-3 h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {loading
                      ? "..."
                      : profile?.public_username
                        ? profile.public_username.slice(-2).toUpperCase()
                        : user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium truncate max-w-[140px]">
                    {loading ? "Loading..." : profile?.display_name || profile?.public_username || "No profile"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[140px]">{user?.email}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-56 bg-popover/95 backdrop-blur-sm border-border/50">
              <DropdownMenuItem className="text-popover-foreground hover:bg-accent/50">
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-popover-foreground hover:bg-accent/50">
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={refreshProfile} className="text-popover-foreground hover:bg-accent/50">
                <User className="mr-2 h-4 w-4" />
                Refresh Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="text-destructive hover:bg-destructive/10">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-primary/5 hover:text-primary transition-colors group"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-4 w-4 group-hover:text-primary" />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-border/50 p-4 space-y-4">
          {/* Upgrade Prompt */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-1">Recommend MailCraft</h4>
            <p className="text-xs text-muted-foreground mb-3">and get 1 month Pro for free</p>
            <Button size="sm" variant="outline" className="w-full text-xs">
              Refer Friends
            </Button>
          </div>

          {/* Usage Stats */}
          <div className="text-xs text-muted-foreground">
            <div className="flex justify-between items-center">
              <span>Templates used</span>
              <span>5/10</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mt-1">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: "50%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border/50 bg-card/30 backdrop-blur-sm px-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 bg-background/50">{children}</main>
      </div>
    </div>
  )
}
