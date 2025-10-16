"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Heart,
  Users,
  MessageSquare,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  Upload,
  Eye,
  Bookmark,
  CheckCircle2,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const products = {
  likes: [
    { id: "likes_1k", amount: 1000, price: 10, label: "1,000 Likes - GHS 10" },
    { id: "likes_5k", amount: 5000, price: 45, label: "5,000 Likes - GHS 45" },
    { id: "likes_10k", amount: 10000, price: 80, label: "10,000 Likes - GHS 80" },
  ],
  followers: [
    { id: "followers_500", amount: 500, price: 15, label: "500 Followers - GHS 15" },
    { id: "followers_1k", amount: 1000, price: 25, label: "1,000 Followers - GHS 25" },
    { id: "followers_5k", amount: 5000, price: 100, label: "5,000 Followers - GHS 100" },
  ],
  comments: [
    { id: "comments_50", amount: 50, price: 10, label: "50 Comments - GHS 10" },
    { id: "comments_100", amount: 100, price: 18, label: "100 Comments - GHS 18" },
  ],
  saves: [
    { id: "saves_500", amount: 500, price: 12, label: "500 Saves - GHS 12" },
    { id: "saves_1k", amount: 1000, price: 20, label: "1,000 Saves - GHS 20" },
    { id: "saves_5k", amount: 5000, price: 90, label: "5,000 Saves - GHS 90" },
  ],
  views: [
    { id: "views_1k", amount: 1000, price: 8, label: "1,000 Views - GHS 8" },
    { id: "views_5k", amount: 5000, price: 35, label: "5,000 Views - GHS 35" },
    { id: "views_10k", amount: 10000, price: 65, label: "10,000 Views - GHS 65" },
  ],
}

const socialMediaPlatforms = ["Instagram", "Facebook", "TikTok", "YouTube", "Twitter"]

const paymentMethods = ["Momo", "Bank Transfer", "Card Payment"]

export function OrderForm() {
  const [currentStep, setCurrentStep] = useState(1)

  const [socialMedia, setSocialMedia] = useState<string>("")
  const [serviceType, setServiceType] = useState<string>("")
  const [selectedPackage, setSelectedPackage] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [socialLink, setSocialLink] = useState("")
  const [screenshot, setScreenshot] = useState<File | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const getPackages = () => {
    if (serviceType === "likes") return products.likes
    if (serviceType === "followers") return products.followers
    if (serviceType === "comments") return products.comments
    if (serviceType === "saves") return products.saves
    if (serviceType === "views") return products.views
    return []
  }

  const getSelectedPrice = () => {
    const packages = getPackages()
    const pkg = packages.find((p) => p.id === selectedPackage)
    return pkg?.price || 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const supabase = createClient()

      // Upload screenshot to Supabase Storage
      let screenshotUrl = null
      if (screenshot) {
        const fileExt = screenshot.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `payment-screenshots/${fileName}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("orders")
          .upload(filePath, screenshot)

        if (uploadError) {
          throw new Error(`Failed to upload screenshot: ${uploadError.message}`)
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("orders").getPublicUrl(filePath)

        screenshotUrl = publicUrl
      }

      // Get package details
      const packages = getPackages()
      const pkg = packages.find((p) => p.id === selectedPackage)

      // Insert order into database
      const { data: orderData, error: insertError } = await supabase
        .from("orders")
        .insert({
          platform: socialMedia,
          service_type: serviceType.charAt(0).toUpperCase() + serviceType.slice(1),
          package_name: pkg?.label || "",
          package_price: pkg?.price || 0,
          social_media_link: socialLink,
          full_name: name,
          phone: phone,
          email: email,
          payment_method: paymentMethod,
          screenshot_url: screenshotUrl,
          status: "pending",
        })
        .select()

      if (insertError) {
        throw new Error(`Failed to save order: ${insertError.message}`)
      }

      console.log("[v0] Order saved successfully:", orderData)

      // Show success message
      setOrderSuccess(true)

      // Optional: Still send to WhatsApp
      const orderDetails = `
*New Order - Tech Master*

Platform: ${socialMedia}
Service: ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
Package: ${pkg?.label}
Price: GHS ${pkg?.price}

Payment Method: ${paymentMethod}

Customer Details:
Name: ${name}
Phone: ${phone}
Email: ${email}
Social Media Link: ${socialLink}

Order ID: ${orderData?.[0]?.id}
      `.trim()

      const whatsappNumber = "233551234567"
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderDetails)}`
      window.open(whatsappUrl, "_blank")
    } catch (error) {
      console.error("[v0] Order submission error:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to submit order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStep1Valid = socialMedia !== ""
  const isStep2Valid = serviceType !== "" && selectedPackage !== "" && socialLink !== ""
  const isStep3Valid = name !== "" && phone !== "" && email !== ""
  const isStep4Valid = paymentMethod !== ""
  const isStep5Valid = screenshot !== null

  const canProceedToStep2 = isStep1Valid
  const canProceedToStep3 = isStep2Valid
  const canProceedToStep4 = isStep3Valid
  const canProceedToStep5 = isStep4Valid
  const canSubmit = isStep5Valid

  if (orderSuccess) {
    return (
      <section id="order" className="py-20 md:py-32 bg-muted/30">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl">
            <div className="bg-card p-8 md:p-12 rounded-lg border shadow-sm text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">Order Placed Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your order! We've received your payment and will start processing your request shortly.
                You'll receive a confirmation message on WhatsApp.
              </p>
              <Button
                size="lg"
                onClick={() => {
                  setOrderSuccess(false)
                  setCurrentStep(1)
                  setSocialMedia("")
                  setServiceType("")
                  setSelectedPackage("")
                  setPaymentMethod("")
                  setName("")
                  setPhone("")
                  setEmail("")
                  setSocialLink("")
                  setScreenshot(null)
                }}
              >
                Place Another Order
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="order" className="py-20 md:py-32 bg-muted/30">
      <div className="container px-4">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl mb-4">
            Choose Your Package
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Fill out the form below to place your order. We'll contact you on WhatsApp to confirm.
          </p>
        </div>

        <div className="mx-auto max-w-lg sm:max-w-2xl">
          <div className="mb-6 flex items-center justify-center gap-1 px-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 text-xs sm:text-sm font-semibold transition-colors ${
                    currentStep === step
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep > step
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted-foreground/30 bg-muted text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`h-0.5 w-6 sm:w-12 transition-colors ${
                      currentStep > step ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-4 sm:p-6 md:p-8 rounded-lg border shadow-sm">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold mb-2">Select Social Media Platform</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose the platform where you want to boost engagement
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social-media">Social Media Platform *</Label>
                  <Select
                    value={socialMedia}
                    onValueChange={(value) => {
                      setSocialMedia(value)
                      setServiceType("")
                      setSelectedPackage("")
                    }}
                  >
                    <SelectTrigger id="social-media" className="h-12">
                      <SelectValue placeholder="Select social media platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {socialMediaPlatforms.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-6">
                  <Button
                    type="button"
                    size="lg"
                    className="w-full"
                    onClick={() => setCurrentStep(2)}
                    disabled={!canProceedToStep2}
                  >
                    Next
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold mb-2">Choose Service & Package</h3>
                  <p className="text-sm text-muted-foreground">Select the type of engagement and package size</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service-type">Service Type *</Label>
                  <Select
                    value={serviceType}
                    onValueChange={(value) => {
                      setServiceType(value)
                      setSelectedPackage("")
                    }}
                  >
                    <SelectTrigger id="service-type" className="h-12">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="likes">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          Likes
                        </div>
                      </SelectItem>
                      <SelectItem value="followers">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Followers
                        </div>
                      </SelectItem>
                      <SelectItem value="comments">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Comments
                        </div>
                      </SelectItem>
                      <SelectItem value="saves">
                        <div className="flex items-center gap-2">
                          <Bookmark className="h-4 w-4" />
                          Saves
                        </div>
                      </SelectItem>
                      <SelectItem value="views">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Views
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package">Package *</Label>
                  <Select value={selectedPackage} onValueChange={setSelectedPackage} disabled={!serviceType}>
                    <SelectTrigger id="package" className="h-12">
                      <SelectValue placeholder={serviceType ? "Select package" : "Select service type first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getPackages().map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social-link">
                    {socialMedia ? `${socialMedia} Post/Profile Link` : "Social Media Post/Profile Link"} *
                  </Label>
                  <Input
                    id="social-link"
                    type="url"
                    placeholder={socialMedia ? `https://${socialMedia.toLowerCase()}.com/...` : "https://..."}
                    value={socialLink}
                    onChange={(e) => setSocialLink(e.target.value)}
                    required
                  />
                </div>

                {selectedPackage && (
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total Price:</span>
                      <span className="text-2xl font-bold text-primary">GHS {getSelectedPrice()}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-row gap-3 mt-6">
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    className="flex-1"
                    onClick={() => setCurrentStep(3)}
                    disabled={!canProceedToStep3}
                  >
                    Next
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
                  <p className="text-sm text-muted-foreground">Provide your details so we can reach you</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-row gap-3 mt-6">
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setCurrentStep(2)}
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    className="flex-1"
                    onClick={() => setCurrentStep(4)}
                    disabled={!canProceedToStep4}
                  >
                    Next
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold mb-2">Make Payment</h3>
                  <p className="text-sm text-muted-foreground">Choose your payment method and complete the payment</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment">Payment Method *</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="payment" className="h-12">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod && (
                  <div className="bg-muted p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2">Payment Instructions:</h4>
                    {paymentMethod === "Momo" && (
                      <div className="text-sm space-y-1">
                        <p>1. Dial *170#</p>
                        <p>2. Select "Send Money"</p>
                        <p>3. Enter: 0551234567</p>
                        <p>4. Enter amount: GHS {getSelectedPrice()}</p>
                        <p>5. Take a screenshot of the confirmation</p>
                      </div>
                    )}
                    {paymentMethod === "Bank Transfer" && (
                      <div className="text-sm space-y-1">
                        <p>Bank: GCB Bank</p>
                        <p>Account Name: Tech Master</p>
                        <p>Account Number: 1234567890</p>
                        <p>Amount: GHS {getSelectedPrice()}</p>
                        <p>Take a screenshot of the transfer confirmation</p>
                      </div>
                    )}
                    {paymentMethod === "Card Payment" && (
                      <div className="text-sm space-y-1">
                        <p>You will receive payment link via WhatsApp</p>
                        <p>Amount: GHS {getSelectedPrice()}</p>
                        <p>Take a screenshot after successful payment</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedPackage && (
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total Price:</span>
                      <span className="text-2xl font-bold text-primary">GHS {getSelectedPrice()}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-row gap-3 mt-6">
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setCurrentStep(3)}
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    className="flex-1"
                    onClick={() => setCurrentStep(5)}
                    disabled={!canProceedToStep5}
                  >
                    Next
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold mb-2">Upload Payment Screenshot</h3>
                  <p className="text-sm text-muted-foreground">Upload a screenshot of your payment confirmation</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screenshot">Payment Screenshot *</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setScreenshot(file)
                        }
                      }}
                    />
                    <label htmlFor="screenshot" className="cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      {screenshot ? (
                        <div>
                          <p className="font-semibold text-primary">{screenshot.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">{(screenshot.size / 1024).toFixed(2)} KB</p>
                          <Button type="button" variant="outline" size="sm" className="mt-3 bg-transparent">
                            Change Screenshot
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold">Click to upload screenshot</p>
                          <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {submitError && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-sm">
                    {submitError}
                  </div>
                )}

                {selectedPackage && (
                  <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 rounded-2xl border border-primary/20 shadow-lg">
                    {/* Background decoration */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/10 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    
                    <div className="relative z-10">
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-primary">Package Selected</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Total Amount</p>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <span className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            GHS {getSelectedPrice()}
                          </span>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                            <span className="text-xs font-bold text-primary">₵</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>Instant Delivery</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>100% Secure</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-row gap-3 mt-6">
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setCurrentStep(4)}
                    disabled={isSubmitting}
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button type="submit" size="lg" className="flex-1" disabled={!canSubmit || isSubmitting}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isSubmitting ? "Submitting..." : "Place Order"}
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground text-center mt-4">
                  By placing an order, you agree to our terms of service. We'll contact you on WhatsApp to confirm your
                  order.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
