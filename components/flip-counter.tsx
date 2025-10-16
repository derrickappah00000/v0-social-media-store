"use client"

import { useEffect, useState } from "react"

interface FlipCounterProps {
  value: number
  suffix?: string
}

export function FlipCounter({ value, suffix = "" }: FlipCounterProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isViral, setIsViral] = useState(false)
  const [previousValue, setPreviousValue] = useState(value)
  const [changingDigits, setChangingDigits] = useState<number[]>([])
  const [flipStates, setFlipStates] = useState<{ [key: number]: 'flipping' | 'idle' }>({})

  useEffect(() => {
    if (value !== displayValue) {
      const increment = value - previousValue
      
      // Check if this is a "viral" moment (large increment)
      if (increment > 5) {
        setIsViral(true)
        setTimeout(() => setIsViral(false), 2000) // Viral effect lasts 2 seconds
      }
      
      // Find which digits are changing
      const oldDigits = displayValue.toString().split("")
      const newDigits = value.toString().split("")
      const changing: number[] = []
      const flipStates: { [key: number]: 'flipping' | 'idle' } = {}
      
      // Compare digits from right to left
      for (let i = 0; i < Math.max(oldDigits.length, newDigits.length); i++) {
        const oldDigit = oldDigits[oldDigits.length - 1 - i] || "0"
        const newDigit = newDigits[newDigits.length - 1 - i] || "0"
        if (oldDigit !== newDigit) {
          changing.push(i)
          flipStates[i] = 'flipping'
        }
      }
      
      setChangingDigits(changing)
      setFlipStates(flipStates)
      setIsAnimating(true)
      
      // Start flip animation
      setTimeout(() => {
        setDisplayValue(value)
        setPreviousValue(value)
      }, 200) // Halfway through animation, update the value
      
      const timeout = setTimeout(() => {
        setIsAnimating(false)
        setChangingDigits([])
        setFlipStates({})
      }, 400)
      return () => clearTimeout(timeout)
    }
  }, [value, displayValue, previousValue])

  const digits = displayValue.toString().split("")

  return (
    <div className={`inline-flex items-center leading-none transition-all duration-500 ${
      isViral ? 'animate-glow scale-105' : 'scale-100'
    }`}>
      <div className="inline-flex">
        {digits.map((digit, index) => {
          const digitPosition = digits.length - 1 - index
          const isChanging = changingDigits.includes(digitPosition)
          const isFlipping = flipStates[digitPosition] === 'flipping'
          
          return (
            <div
              key={`${index}-${displayValue}`}
              className="relative inline-block overflow-hidden"
              style={{
                height: "1.75rem",
                width: "1rem",
                lineHeight: "1.75rem",
                perspective: "100px",
              }}
            >
              <div 
                className={`absolute inset-0 flex items-center justify-center transition-all duration-400 ease-out ${
                  isFlipping 
                    ? 'animate-flip scale-110' 
                    : isChanging 
                      ? 'animate-number-change scale-105' 
                      : isAnimating 
                        ? 'animate-pulse scale-102' 
                        : 'scale-100'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <span 
                  className={`font-bold text-2xl leading-none block transition-all duration-400 ${
                    isViral 
                      ? 'text-primary drop-shadow-lg animate-pulse' 
                      : isFlipping
                        ? 'text-primary drop-shadow-md'
                        : isChanging
                          ? 'text-primary drop-shadow-sm animate-bounce'
                          : isAnimating 
                            ? 'text-primary drop-shadow-sm' 
                            : 'text-foreground'
                  }`} 
                  style={{ 
                    lineHeight: "1.75rem",
                    transform: isFlipping ? 'rotateX(0deg)' : 'rotateX(0deg)',
                  }}
                >
                  {digit}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <span className={`ml-0.5 text-2xl font-bold leading-none block transition-all duration-300 ${
        isViral ? 'text-primary animate-pulse' : 'text-foreground'
      }`} style={{ lineHeight: "1.75rem" }}>
        {suffix}
      </span>
    </div>
  )
}
