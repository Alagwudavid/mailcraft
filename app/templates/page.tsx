"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Eye, GitFork, Heart, ArrowLeft, Monitor, Tablet, Smartphone } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface PublicTemplate {
  id: string
  title: string
  content: any
  views_count: number
  forks_count: number
  created_at: string
  updated_at: string
  users: {
    public_username: string
  }
}

export default function PublicTemplatesPage() {
  const [templates, setTemplates] = useState<PublicTemplate[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [deviceFilter, setDeviceFilter] = useState("all")
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchPublicTemplates()
  }, [])

  const fetchPublicTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("templates")
        .select(`
          id,
          title,
          content,
          views_count,
          forks_count,
          created_at,
          updated_at,
          users!inner(public_username)
        `)
        .eq("is_public", true)
        .order("views_count", { ascending: false })

      if (error) throw error
      setTemplates(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.users.public_username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const deviceFilters = [
    { id: "all", label: "All Devices", icon: null },
    { id: "desktop", label: "Desktop", icon: Monitor },
    { id: "tablet", label: "Tablet", icon: Tablet },
    { id: "mobile", label: "Mobile", icon: Smartphone },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-6">
                <h1 className="text-xl font-semibold">MailCraft Templates</h1>
                <nav className="flex items-center gap-6">
                  <Link href="/templates" className="text-sm font-medium text-foreground">
                    Community Templates
                  </Link>
                  <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                    My Templates
                  </Link>
                </nav>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Public to organization
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Find the best template for your project</h1>
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search templates, creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base bg-background/80 backdrop-blur-sm border-border/50"
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <span className="text-muted-foreground">Can't find the template you're looking for?</span>
            <Button variant="outline" className="bg-background/80 backdrop-blur-sm">
              Generate it with AI
              <Badge variant="secondary" className="ml-2">
                Beta
              </Badge>
            </Button>
          </div>
        </div>
      </section>

      {/* Filters and Templates */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">All Templates</h2>
          <div className="flex items-center gap-2">
            {deviceFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={deviceFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setDeviceFilter(filter.id)}
                className="flex items-center gap-2"
              >
                {filter.icon && <filter.icon className="h-4 w-4" />}
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredTemplates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Template Preview */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden">
                    <div className="absolute inset-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50 p-4">
                      <div className="space-y-2">
                        <div className="h-3 bg-primary/20 rounded w-3/4"></div>
                        <div className="h-2 bg-muted rounded w-full"></div>
                        <div className="h-2 bg-muted rounded w-2/3"></div>
                        <div className="h-8 bg-secondary/20 rounded mt-4"></div>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="h-8 w-8">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-card-foreground mb-2 truncate">{template.title}</h3>

                    {/* Creator Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {template.users.public_username.slice(-3).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{template.users.public_username}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {template.views_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          {template.forks_count}
                        </span>
                      </div>
                      <span>{formatDistanceToNow(new Date(template.updated_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or browse all templates</p>
            <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
          </div>
        )}
      </div>
    </div>
  )
}
