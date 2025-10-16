"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Users, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FlipCounter } from "./flip-counter"

function useRealisticCounter(initialValue: number, growthRate: 'slow' | 'medium' | 'fast' = 'medium') {
  const [count, setCount] = useState(initialValue)

  useEffect(() => {
    const getGrowthPattern = () => {
      switch (growthRate) {
        case 'slow':
          return {
            minInterval: 8000, // 8-15 seconds
            maxInterval: 15000,
            minIncrement: 1,
            maxIncrement: 3,
            burstChance: 0.1 // 10% chance of burst
          }
        case 'fast':
          return {
            minInterval: 2000, // 2-6 seconds
            maxInterval: 6000,
            minIncrement: 2,
            maxIncrement: 8,
            burstChance: 0.3 // 30% chance of burst
          }
        default: // medium
          return {
            minInterval: 4000, // 4-10 seconds
            maxInterval: 10000,
            minIncrement: 1,
            maxIncrement: 5,
            burstChance: 0.2 // 20% chance of burst
          }
      }
    }

    const scheduleNextIncrement = () => {
      const pattern = getGrowthPattern()
      
      // Calculate realistic interval (longer intervals = more realistic)
      const interval = Math.random() * (pattern.maxInterval - pattern.minInterval) + pattern.minInterval
      
      // Determine increment amount
      let increment = Math.floor(Math.random() * (pattern.maxIncrement - pattern.minIncrement + 1)) + pattern.minIncrement
      
      // Occasionally have a "viral" moment with larger increments
      if (Math.random() < pattern.burstChance) {
        increment = Math.floor(increment * (2 + Math.random() * 3)) // 2-5x normal increment
      }

      setTimeout(() => {
        setCount((prev) => prev + increment)
        scheduleNextIncrement()
      }, interval)
    }

    // Start the counter after a short delay
    const initialDelay = Math.random() * 3000 + 1000 // 1-4 seconds
    setTimeout(scheduleNextIncrement, initialDelay)
  }, [growthRate])

  return count
}

export function Hero() {
  const likesCount = useRealisticCounter(50, 'fast') // Likes grow faster (more engagement)
  const followersCount = useRealisticCounter(25, 'medium') // Followers grow at medium rate

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/3 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
      <div className="container px-4 sm:px-6 py-12 sm:py-16 md:py-24 lg:py-32 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm animate-fade-in-up animate-float">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary animate-pulse" />
            <span className="text-muted-foreground">Trusted by 10,000+ creators in Ghana</span>
          </div>

          <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-balance leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            Grow Your Social Media <span className="text-primary animate-pulse">Fast</span>
          </h1>

          <p className="mb-8 sm:mb-10 text-base sm:text-lg md:text-xl text-muted-foreground text-balance leading-relaxed px-4 sm:px-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            Buy real engagement and followers to boost your social media presence. Instant delivery, affordable prices,
            and 100% secure.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <Button size="lg" asChild className="w-full sm:w-auto hover:scale-105 transition-transform duration-300">
              <Link href="#order-form">
                View Packages
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent hover:scale-105 transition-transform duration-300">
              <Link href="https://wa.me/233551234567" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                Contact Us
              </Link>
            </Button>
          </div>

          <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8">
            <div className="flex flex-col items-center gap-1 sm:gap-2 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 hover:scale-110 group">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:animate-pulse" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">
                <FlipCounter value={likesCount} suffix="K+" />
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Likes Delivered</p>
            </div>
            <div className="flex flex-col items-center gap-1 sm:gap-2 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 hover:scale-110 group">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:animate-pulse" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">
                <FlipCounter value={followersCount} suffix="K+" />
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Followers Gained</p>
            </div>
            <div className="flex flex-col items-center gap-1 sm:gap-2 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 hover:scale-110 group">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:animate-pulse" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold animate-pulse">98%</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
