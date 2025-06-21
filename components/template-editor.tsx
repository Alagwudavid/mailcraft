"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, Eye, Download, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { BlockEditor } from "@/components/block-editor"
import { EmailPreview } from "@/components/email-preview"

interface Template {
  id: string
  title: string
  content: any
  user_id: string
}

interface TemplateEditorProps {
  template: Template
  onSave: (title: string, content: any) => Promise<void>
}

export function TemplateEditor({ template, onSave }: TemplateEditorProps) {
  const [title, setTitle] = useState(template.title)
  const [content, setContent] = useState(template.content || { blocks: [] })
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onSave(title, content)
    setSaving(false)
  }

  const exportHTML = () => {
    const html = generateHTML(content)
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateHTML = (content: any) => {
    const blocks = content.blocks || []
    const blockHTML = blocks
      .map((block: any) => {
        switch (block.type) {
          case "text":
            return `<div style="padding: 16px; font-family: Arial, sans-serif;">${block.content}</div>`
          case "image":
            return `<div style="padding: 16px; text-align: center;"><img src="${block.src}" alt="${block.alt}" style="max-width: 100%; height: auto;" /></div>`
          case "button":
            return `<div style="padding: 16px; text-align: center;"><a href="${block.href}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">${block.text}</a></div>`
          case "divider":
            return `<div style="padding: 16px;"><hr style="border: none; border-top: 1px solid #e5e7eb;" /></div>`
          default:
            return ""
        }
      })
      .join("")

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white;">
    ${blockHTML}
  </div>
</body>
</html>`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-none bg-transparent text-lg font-semibold focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Template title"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? "Hide Preview" : "Preview"}
            </Button>
            <Button variant="outline" onClick={exportHTML}>
              <Download className="mr-2 h-4 w-4" />
              Export HTML
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Editor */}
        <div className={`${showPreview ? "w-1/2" : "w-full"} border-r`}>
          <BlockEditor content={content} onChange={setContent} />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-1/2 bg-muted/30">
            <EmailPreview content={content} />
          </div>
        )}
      </div>
    </div>
  )
}
