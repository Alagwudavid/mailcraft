import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-2xl bg-linear-to-r from-primary to-secondary p-8 md:p-16 text-white">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-white">
              Ready to transform your email marketing?
            </h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
              Join thousands of businesses already using MailCraft to create beautiful, converting email templates in
              minutes, not hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-8 bg-white text-primary hover:bg-white/90">
                  Start Building Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
