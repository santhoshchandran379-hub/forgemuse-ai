'use client'

import Navbar from './Navbar'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import HowItWorksSection from './HowItWorksSection'
import PricingSection from './PricingSection'
import FAQSection from './FAQSection'
import Footer from './Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </main>
  )
}
