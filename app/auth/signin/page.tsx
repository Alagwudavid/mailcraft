"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, Lock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      toast({
        title: "Check your email",
        description: "We sent you a magic link to sign in.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1B69] via-[#1A0B3D] to-[#0F051F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(112,55,228,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(141,222,237,0.1),transparent_50%)]" />

      {/* Logo */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-semibold text-lg">MailCraft</span>
        </Link>
      </div>

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 right-6 flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to home</span>
      </Link>

      {/* Main Card */}
      <div className="w-full max-w-md relative">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Lock Icon with Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div
                className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"
                style={{ width: "80px", height: "80px" }}
              />
              <div className="absolute inset-2 bg-primary/10 rounded-full animate-pulse animation-delay-150" />
              <div className="relative w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/70">Enter your email to receive a magic link</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90 text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary/20 h-12 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? "Sending magic link..." : "Send Magic Link"}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <Link href="/auth/signup" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
