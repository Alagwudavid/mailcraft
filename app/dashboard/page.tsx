"use client"

import { useAuth } from "@/components/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  MoreHorizontal,
  Sparkles,
  Monitor,
  Layers,
  Folder,
  FileText,
  Eye,
  GitFork,
  RefreshCw,
} from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

interface Template {
  id: string
  title: string
  content: any
  is_public: boolean
  views_count: number
  forks_count: number
  created_at: string
  updated_at: string
  project_id?: string
}

export default function Dashboard() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams?.get("tab") || "projects"

  const [projects, setProjects] = useState<Project[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && profile) {
      fetchData()
    }
  }, [user, profile])

  const fetchData = async () => {
    try {
      setDataLoading(true)
      // Fetch projects
      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user?.id)
        .order("updated_at", { ascending: false })

      // Fetch templates
      const { data: templatesData } = await supabase
        .from("templates")
        .select("*")
        .eq("user_id", user?.id)
        .order("updated_at", { ascending: false })

      setProjects(projectsData || [])
      setTemplates(templatesData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setDataLoading(false)
    }
  }

  const createNewProject = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user?.id,
          title: "Untitled Project",
          description: "A new email project",
        })
        .select()
        .single()

      if (error) throw error

      setProjects((prev) => [data, ...prev])
    } catch (error) {
      console.error("Error creating project:", error)
    }
  }

  const createNewTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from("templates")
        .insert({
          user_id: user?.id,
          title: "Untitled Template",
          content: { blocks: [] },
        })
        .select()
        .single()

      if (error) throw error

      setTemplates((prev) => [data, ...prev])
      router.push(`/editor/${data.id}`)
    } catch (error) {
      console.error("Error creating template:", error)
    }
  }

  const filteredProjects = projects.filter((project) => project.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredTemplates = templates.filter((template) =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Show loading screen while auth is loading or profile is being set up
  if (authLoading || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show profile setup screen if no profile exists
  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground mb-4">Setting up your profile...</p>
            <Button onClick={refreshProfile} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Start creating</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile.display_name || profile.public_username}! Build beautiful email templates and
            organize them in projects.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-border hover:border-primary/50"
            onClick={createNewProject}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-2">New blank project</h3>
              <p className="text-sm text-muted-foreground">Start from scratch</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-200/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Generate with AI</h3>
              <Badge variant="secondary" className="mb-2">
                Beta
              </Badge>
              <p className="text-sm text-muted-foreground">AI-powered creation</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border-cyan-200/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Monitor className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Start from screenshot</h3>
              <p className="text-sm text-muted-foreground">Upload and recreate</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200/20"
            onClick={createNewTemplate}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Layers className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-medium text-foreground mb-2">New template</h3>
              <p className="text-sm text-muted-foreground">Quick start</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects/Templates Section */}
        <div>
          <Tabs value={activeTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  Projects
                  <Badge variant="secondary" className="ml-1">
                    {projects.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Templates
                  <Badge variant="secondary" className="ml-1">
                    {templates.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>

            <TabsContent value="projects" className="space-y-4">
              {dataLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="h-32 bg-muted rounded mb-4"></div>
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-lg transition-all group cursor-pointer">
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center">
                          <Folder className="h-8 w-8 text-primary/60" />
                        </div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{project.description || "No description"}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                          {project.is_public && (
                            <Badge variant="outline" className="text-xs">
                              Public
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first project to get started</p>
                  <Button onClick={createNewProject}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              {dataLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="h-32 bg-muted rounded mb-4"></div>
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <Link key={template.id} href={`/editor/${template.id}`}>
                      <Card className="hover:shadow-lg transition-all group cursor-pointer">
                        <CardContent className="p-4">
                          <div className="aspect-video bg-gradient-to-br from-secondary/10 to-primary/10 rounded-lg mb-4 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-secondary/60" />
                          </div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {template.title}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {template.views_count}
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="h-3 w-3" />
                              {template.forks_count}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Updated {new Date(template.updated_at).toLocaleDateString()}</span>
                            {template.is_public && (
                              <Badge variant="outline" className="text-xs">
                                Public
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No templates yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first template to get started</p>
                  <Button onClick={createNewTemplate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
