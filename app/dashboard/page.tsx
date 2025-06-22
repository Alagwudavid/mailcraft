"use client"

import { useAuth } from "@/components/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, Sparkles, Monitor, Layers, Folder, FileText, Eye, GitFork } from "lucide-react"
import { useSearchParams } from "next/navigation"
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
  const { user, profile } = useAuth()
  const searchParams = useSearchParams()
  const activeTab = searchParams?.get("tab") || "projects"

  const [projects, setProjects] = useState<Project[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
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
      setLoading(false)
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
    } catch (error) {
      console.error("Error creating template:", error)
    }
  }

  const filteredProjects = projects.filter((project) => project.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredTemplates = templates.filter((template) =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-white/60">Setting up your profile...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-white/10 hover:border-white/20 transition-all cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium text-white mb-2">New blank project</h3>
              <p className="text-sm text-white/60">Start from scratch</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#2D1B69] to-[#1A0B3D] border-primary/20 hover:border-primary/40 transition-all cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-white mb-2">Generate with Autodesigner</h3>
              <Badge variant="secondary" className="mb-2">
                Beta
              </Badge>
              <p className="text-sm text-white/60">AI-powered creation</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#0F4C75] to-[#0B3A5C] border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Monitor className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-medium text-white mb-2">Start from screenshot</h3>
              <p className="text-sm text-white/60">Upload and recreate</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#8B4513] to-[#654321] border-orange-500/20 hover:border-orange-500/40 transition-all cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                <Layers className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="font-medium text-white mb-2">Start from template</h3>
              <p className="text-sm text-white/60">Browse our library</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects/Templates Section */}
        <div>
          <Tabs value={activeTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="projects" className="data-[state=active]:bg-white/10">
                  <Folder className="h-4 w-4 mr-2" />
                  Projects
                  <Badge variant="secondary" className="ml-2">
                    {projects.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="templates" className="data-[state=active]:bg-white/10">
                  <FileText className="h-4 w-4 mr-2" />
                  Templates
                  <Badge variant="secondary" className="ml-2">
                    {templates.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <select className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
                  <option value="newest">Sort by: Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            <TabsContent value="projects" className="space-y-4">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="animate-pulse">
                          <div className="h-32 bg-white/10 rounded mb-4"></div>
                          <div className="h-4 bg-white/10 rounded mb-2"></div>
                          <div className="h-3 bg-white/10 rounded w-2/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="bg-white/5 border-white/10 hover:border-white/20 transition-all group cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                          <Folder className="h-8 w-8 text-white/40" />
                        </div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-white group-hover:text-primary transition-colors">
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
                        <p className="text-sm text-white/60 mb-3">{project.description || "No description"}</p>
                        <div className="flex items-center justify-between text-xs text-white/40">
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
                  <Folder className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
                  <p className="text-white/60 mb-4">Create your first project to get started</p>
                  <Button onClick={createNewProject} className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="animate-pulse">
                          <div className="h-32 bg-white/10 rounded mb-4"></div>
                          <div className="h-4 bg-white/10 rounded mb-2"></div>
                          <div className="h-3 bg-white/10 rounded w-2/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <Link key={template.id} href={`/editor/${template.id}`}>
                      <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all group cursor-pointer">
                        <CardContent className="p-4">
                          <div className="aspect-video bg-gradient-to-br from-secondary/20 to-primary/20 rounded-lg mb-4 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-white/40" />
                          </div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-white group-hover:text-primary transition-colors">
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
                          <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {template.views_count}
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="h-3 w-3" />
                              {template.forks_count}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-white/40">
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
                  <FileText className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No templates yet</h3>
                  <p className="text-white/60 mb-4">Create your first template to get started</p>
                  <Button onClick={createNewTemplate} className="bg-primary hover:bg-primary/90">
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
