import Link from "next/link"
import { MessageCircle, Mail, Instagram, Music } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background border-t border-border/40">
      {/* Floating animation circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        <div className="grid gap-8 sm:gap-12 grid-cols-1 md:grid-cols-3">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg hover:scale-110 transition-transform duration-300">
                <span className="text-lg font-bold text-primary-foreground">T</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Tech Master
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Grow your social media presence with real engagement and authentic followers.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#order-form" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Order Now
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Get In Touch</h3>
            <div className="space-y-3">
              <Link
                href="https://wa.me/233551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20 transition-all duration-300 group border border-green-500/20 hover:scale-105"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                  <MessageCircle className="h-4 w-4 text-green-600 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">WhatsApp</p>
                  <p className="text-sm font-medium">+233 55 123 4567</p>
                </div>
              </Link>

              <Link
                href="mailto:support@techmaster.com"
                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-300 group border border-blue-500/20 hover:scale-105"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                  <Mail className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">support@techmaster.com</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Tech Master. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://instagram.com/techmaster"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="https://tiktok.com/@techmaster"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125"
              >
                <Music className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
