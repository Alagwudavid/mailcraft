"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash2, Copy } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

interface Template {
  id: string
  title: string
  content: any
  updated_at: string
  created_at: string
}

interface TemplateCardProps {
  template: Template
  onDelete: () => void
}

export function TemplateCard({ template, onDelete }: TemplateCardProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this template?")) return

    setLoading(true)
    try {
      const { error } = await supabase.from("templates").delete().eq("id", template.id)

      if (error) throw error

      toast({
        title: "Template deleted",
        description: "The template has been successfully deleted.",
      })
      onDelete()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDuplicate = async () => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { error } = await supabase.from("templates").insert({
        title: `${template.title} (Copy)`,
        content: template.content,
        user_id: user?.id,
      })

      if (error) throw error

      toast({
        title: "Template duplicated",
        description: "The template has been successfully duplicated.",
      })
      onDelete() // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to duplicate template",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-border bg-card hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg truncate text-card-foreground">{template.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border">
              <DropdownMenuItem
                onClick={handleDuplicate}
                disabled={loading}
                className="text-popover-foreground hover:bg-accent"
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={loading}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-32 bg-muted border border-border rounded-md mb-4 flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Email Preview</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Updated {formatDistanceToNow(new Date(template.updated_at), { addSuffix: true })}
        </p>
      </CardContent>

      <CardFooter>
        <Link href={`/editor/${template.id}`} className="w-full">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Edit className="mr-2 h-4 w-4" />
            Edit Template
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
