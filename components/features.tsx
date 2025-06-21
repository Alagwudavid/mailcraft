import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Zap, Code, Users, Shield, Smartphone } from "lucide-react"

const features = [
  {
    icon: Palette,
    title: "Drag & Drop Editor",
    description: "Intuitive visual editor with pre-built blocks and components for rapid template creation.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance with instant previews and real-time collaboration features.",
  },
  {
    icon: Code,
    title: "Export Ready",
    description: "Export clean HTML code that works across all major email clients and platforms.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share templates with your team and collaborate in real-time on email campaigns.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with automatic backups and version control.",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "All templates are automatically optimized for mobile devices and tablets.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need to create amazing emails
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to make email template creation simple and efficient.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border border-border bg-card hover:shadow-lg transition-all duration-200 hover:border-primary/20"
            >
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20 border border-secondary/30">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
