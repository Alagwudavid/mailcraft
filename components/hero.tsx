import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10" />
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            <span className="text-foreground">Introducing MailCraft v2.0</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl text-foreground">
            Design and manage your{" "}
            <span className="bg-clip-text text-[#8ddeed]">
              email templates
            </span>{" "}
            visually
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            Create stunning, responsive email templates with our intuitive drag-and-drop editor. No coding required.
            Perfect for marketers, developers, and businesses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary text-primary hover:bg-primary/10"
              >
                View Demo
              </Button>
            </Link>
          </div>

          <div className="mt-12 text-sm text-muted-foreground">
            No credit card required • Free forever plan available
          </div>
        </div>
      </div>
    </section>
  )
}
