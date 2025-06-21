"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { TemplateEditor } from "@/components/template-editor"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Template {
  id: string
  title: string
  content: any
  user_id: string
}

export default function EditorPage() {
  const { id } = useParams()
  const { user, loading } = useAuth()
  const router = useRouter()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loadingTemplate, setLoadingTemplate] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && id) {
      fetchTemplate()
    }
  }, [user, id])

  const fetchTemplate = async () => {
    try {
      const { data, error } = await supabase.from("templates").select("*").eq("id", id).eq("user_id", user?.id).single()

      if (error) throw error
      setTemplate(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load template",
        variant: "destructive",
      })
      router.push("/dashboard")
    } finally {
      setLoadingTemplate(false)
    }
  }

  const saveTemplate = async (title: string, content: any) => {
    try {
      const { error } = await supabase
        .from("templates")
        .update({
          title,
          content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Template saved",
        description: "Your changes have been saved successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      })
    }
  }

  if (loading || loadingTemplate || !template) {
    return <div>Loading...</div>
  }

  return <TemplateEditor template={template} onSave={saveTemplate} />
}
