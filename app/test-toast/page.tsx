import { TestToast } from "@/components/test-toast"

export default function TestToastPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Toast Test Page</h1>
        <p className="text-muted-foreground mb-8">Click the buttons below to test the toast notifications:</p>
        <TestToast />
      </div>
    </div>
  )
}
