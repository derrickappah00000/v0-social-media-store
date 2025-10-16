import { ShoppingCart, CreditCard, Zap } from "lucide-react"

const steps = [
  {
    icon: ShoppingCart,
    title: "Select Package",
    description: "Choose your social media platform, service type, and package size from our affordable options.",
  },
  {
    icon: CreditCard,
    title: "Complete Order",
    description: "Fill out your details, make payment via Momo, bank transfer, or card, and upload proof.",
  },
  {
    icon: Zap,
    title: "Get Results",
    description: "Receive your engagement boost within minutes! We'll confirm via WhatsApp.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-muted/50">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Boost your social media presence in three simple steps. Fast, secure, and trusted by thousands.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="h-8 w-8" />
                </div>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground text-balance">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
