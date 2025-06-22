"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, FolderPlus, FileText, MoreHorizontal, Eye, Users, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Project {
  id: string
  title: string
  description: string
  is_public: boolean
  created_at: string
  updated_at: string
  template_count?: number
}

interface Template {
  id: string
  title: string
  content: any
  is_public: boolean
  project_id?: string
  views_count: number
  forks_count: number
  updated_at: string
  created_at: string
}

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loadingData, setLoadingData] = useState(true)
  const [activeTab, setActiveTab] = useState("projects")
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      // Fetch projects with template count
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select(`
          *,
          templates:templates(count)
        `)
        .eq("user_id", user?.id)
        .order("updated_at", { ascending: false })

      if (projectsError) throw projectsError

      // Fetch templates
      const { data: templatesData, error: templatesError } = await supabase
        .from("templates")
        .select("*")
        .eq("user_id", user?.id)
        .order("updated_at", { ascending: false })

      if (templatesError) throw templatesError

      setProjects(
        projectsData?.map((p) => ({
          ...p,
          template_count: p.templates?.[0]?.count || 0,
        })) || [],
      )
      setTemplates(templatesData || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  const createNewProject = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          title: "Untitled Project",
          description: "",
          user_id: user?.id,
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/project/${data.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      })
    }
  }

  const createNewTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from("templates")
        .insert({
          title: "Untitled Template",
          content: { blocks: [] },
          user_id: user?.id,
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/editor/${data.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      })
    }
  }

  const filteredProjects = projects.filter((project) => project.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredTemplates = templates.filter((template) =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading || !user) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Start creating</h1>
            <p className="text-muted-foreground mt-1">Build beautiful email templates and organize them in projects</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-border hover:border-primary/50 bg-card/50"
              onClick={createNewProject}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground">New blank project</h3>
                <p className="text-sm text-muted-foreground mt-1">Start from scratch</p>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-200/20">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-card-foreground">Generate with AI</h3>
                <Badge variant="secondary" className="mt-2">
                  Beta
                </Badge>
              </CardContent>
            </Card>

            <Card
              className="group cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border-cyan-200/20"
              onClick={createNewTemplate}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-card-foreground">New template</h3>
                <p className="text-sm text-muted-foreground mt-1">Quick start</p>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200/20">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
                  <FolderPlus className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-card-foreground">Browse templates</h3>
                <p className="text-sm text-muted-foreground mt-1">Community library</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Projects and Templates Section */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-fit grid-cols-2 bg-muted/50">
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <FolderPlus className="w-4 h-4" />
                  Projects
                  <Badge variant="secondary" className="ml-1">
                    {projects.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
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
              {loadingData ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : filteredProjects.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                      <CardContent className="p-0">
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-t-lg flex items-center justify-center">
                          <FolderPlus className="w-8 h-8 text-primary/60" />
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-card-foreground truncate">{project.title}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {project.description || "No description"}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {project.template_count} templates
                              </span>
                              {project.is_public && (
                                <Badge variant="outline" className="text-xs">
                                  <Eye className="w-3 h-3 mr-1" />
                                  Public
                                </Badge>
                              )}
                            </div>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FolderPlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first project to organize your templates</p>
                  <Button onClick={createNewProject}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              {loadingData ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : filteredTemplates.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
                    >
                      <CardContent className="p-0">
                        <div className="aspect-video bg-gradient-to-br from-secondary/10 to-primary/10 rounded-t-lg flex items-center justify-center">
                          <FileText className="w-8 h-8 text-secondary/60" />
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-card-foreground truncate">{template.title}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuItem>
                                  {template.is_public ? "Make Private" : "Make Public"}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {template.views_count}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {template.forks_count}
                              </span>
                              {template.is_public && (
                                <Badge variant="outline" className="text-xs">
                                  Public
                                </Badge>
                              )}
                            </div>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDistanceToNow(new Date(template.updated_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first email template to get started</p>
                  <Button onClick={createNewTemplate}>
                    <Plus className="mr-2 h-4 w-4" />
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
