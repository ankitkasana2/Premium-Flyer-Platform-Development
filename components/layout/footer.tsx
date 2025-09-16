import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-card-foreground">Flyers</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Premium digital flyer templates for nightclubs, lounges, and events.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/flyers" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Browse Flyers
              </Link>
              <Link
                href="/categories"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Categories
              </Link>
              <Link
                href="/pricing"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Pricing
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground">Support</h3>
            <div className="space-y-2">
              <Link href="/help" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Help Center
              </Link>
              <Link
                href="/contact"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Contact Us
              </Link>
              <Link href="/faq" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                FAQ
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground">Legal</h3>
            <div className="space-y-2">
              <Link
                href="/privacy"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/refund" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">© 2024 Flyers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
