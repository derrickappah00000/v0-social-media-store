"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, Menu, X, ArrowRight } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <span className="text-lg font-bold text-primary-foreground">T</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Tech Master
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block">Social Media Growth</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="#order-form" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-y-[-2px]"
          >
            Order Now
          </Link>
          <Link 
            href="#how-it-works" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-y-[-2px]"
          >
            How It Works
          </Link>
          <Link 
            href="#contact" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-y-[-2px]"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-[#25D366] to-[#20BA5A] hover:from-[#20BA5A] hover:to-[#1DA851] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <Link
              href="https://wa.me/233551234567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4 group-hover:animate-pulse" />
              <span>Chat with Us</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container px-4 py-4 space-y-4">
            <Link 
              href="#order-form" 
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Order Now
            </Link>
            <Link 
              href="#how-it-works" 
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="#contact" 
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Button
              asChild
              size="sm"
              className="w-full bg-gradient-to-r from-[#25D366] to-[#20BA5A] hover:from-[#20BA5A] hover:to-[#1DA851] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link
                href="https://wa.me/233551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageCircle className="h-4 w-4 group-hover:animate-pulse" />
                <span>Chat with Us</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
