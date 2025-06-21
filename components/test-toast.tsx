"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function TestToast() {
  const { toast } = useToast()

  const showSuccessToast = () => {
    toast({
      title: "Success! 🎉",
      description: "Toast system is working perfectly!",
    })
  }

  const showErrorToast = () => {
    toast({
      title: "Error",
      description: "This is how error toasts look.",
      variant: "destructive",
    })
  }

  return (
    <div className="flex gap-4 p-4">
      <Button onClick={showSuccessToast} className="bg-primary hover:bg-primary/90">
        Test Success Toast
      </Button>
      <Button onClick={showErrorToast} variant="destructive">
        Test Error Toast
      </Button>
    </div>
  )
}
