"use client"

interface Block {
  id: string
  type: "text" | "image" | "button" | "divider"
  content?: string
  src?: string
  alt?: string
  href?: string
  text?: string
}

interface EmailPreviewProps {
  content: { blocks: Block[] }
}

export function EmailPreview({ content }: EmailPreviewProps) {
  const blocks = content.blocks || []

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case "text":
        return (
          <div key={block.id} className="p-4 font-sans" dangerouslySetInnerHTML={{ __html: block.content || "" }} />
        )

      case "image":
        return (
          <div key={block.id} className="p-4 text-center">
            <img
              src={block.src || "/placeholder.svg?height=200&width=400"}
              alt={block.alt || "Image"}
              className="max-w-full h-auto mx-auto"
            />
          </div>
        )

      case "button":
        return (
          <div key={block.id} className="p-4 text-center">
            <a
              href={block.href || "#"}
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md text-decoration-none font-medium hover:opacity-90 transition-opacity"
            >
              {block.text || "Click me"}
            </a>
          </div>
        )

      case "divider":
        return (
          <div key={block.id} className="p-4">
            <hr className="border-0 border-t border-border" />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div className="mx-auto max-w-md">
          <div className="bg-card border border-border rounded-lg shadow-xs overflow-hidden">
            {blocks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>Your email preview will appear here</p>
              </div>
            ) : (
              blocks.map(renderBlock)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
