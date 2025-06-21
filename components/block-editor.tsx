"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Type, ImageIcon, Square, Minus, GripVertical, Trash2 } from "lucide-react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

interface Block {
  id: string
  type: "text" | "image" | "button" | "divider"
  content?: string
  src?: string
  alt?: string
  href?: string
  text?: string
}

interface BlockEditorProps {
  content: { blocks: Block[] }
  onChange: (content: { blocks: Block[] }) => void
}

const blockTypes = [
  { type: "text", icon: Type, label: "Text" },
  { type: "image", icon: ImageIcon, label: "Image" },
  { type: "button", icon: Square, label: "Button" },
  { type: "divider", icon: Minus, label: "Divider" },
]

export function BlockEditor({ content, onChange }: BlockEditorProps) {
  const blocks = content.blocks || []

  const addBlock = (type: Block["type"]) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      ...(type === "text" && { content: "Enter your text here..." }),
      ...(type === "image" && { src: "/placeholder.svg?height=200&width=400", alt: "Image" }),
      ...(type === "button" && { text: "Click me", href: "#" }),
    }

    onChange({
      blocks: [...blocks, newBlock],
    })
  }

  const updateBlock = (id: string, updates: Partial<Block>) => {
    onChange({
      blocks: blocks.map((block) => (block.id === id ? { ...block, ...updates } : block)),
    })
  }

  const deleteBlock = (id: string) => {
    onChange({
      blocks: blocks.filter((block) => block.id !== id),
    })
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newBlocks = Array.from(blocks)
    const [reorderedItem] = newBlocks.splice(result.source.index, 1)
    newBlocks.splice(result.destination.index, 0, reorderedItem)

    onChange({ blocks: newBlocks })
  }

  const renderBlockEditor = (block: Block) => {
    switch (block.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={block.content || ""}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Enter your text..."
              rows={4}
            />
          </div>
        )

      case "image":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={block.src || ""}
                onChange={(e) => updateBlock(block.id, { src: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={block.alt || ""}
                onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                placeholder="Image description"
              />
            </div>
          </div>
        )

      case "button":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={block.text || ""}
                onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                placeholder="Click me"
              />
            </div>
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input
                value={block.href || ""}
                onChange={(e) => updateBlock(block.id, { href: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Block Toolbar */}
      <div className="border-b border-border p-4 bg-card">
        <div className="flex flex-wrap gap-2">
          {blockTypes.map(({ type, icon: Icon, label }) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => addBlock(type)}
              className="border-border hover:bg-primary/10 hover:border-primary/30 hover:text-primary"
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Blocks */}
      <div className="flex-1 overflow-auto p-4 bg-background">
        {blocks.length === 0 ? (
          <div className="text-center py-12">
            <Plus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">No blocks yet</h3>
            <p className="text-muted-foreground mb-4">Add your first block to start building your email template</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="blocks">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {blocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="relative border border-border bg-card"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div {...provided.dragHandleProps} className="mt-2 cursor-grab active:cursor-grabbing">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-medium capitalize text-card-foreground">{block.type} Block</h4>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteBlock(block.id)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                {renderBlockEditor(block)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  )
}
