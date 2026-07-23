'use client'

import { Check, X, Zap, Crown } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for exploring ForgeMuse AI and trying all creative modules.',
    icon: Zap,
    highlight: false,
    cta: 'Get Started Free',
    href: '/auth/register',
    features: [
      { text: '10 AI generations per month', included: true },
      { text: 'All 6 creative modules', included: true },
      { text: 'AI chat assistant', included: true },
      { text: '5 saved projects', included: true },
      { text: 'TXT export', included: true },
      { text: 'PDF & DOCX export', included: false },
      { text: 'Unlimited projects', included: false },
      { text: 'Priority AI generation', included: false },
      { text: 'Advanced refinement rounds', included: false },
      { text: 'API access', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'For serious creators who need unlimited AI power and premium exports.',
    icon: Crown,
    highlight: true,
    cta: 'Start Pro Trial',
    href: '/auth/register?plan=pro',
    badge: 'Most Popular',
    features: [
      { text: 'Unlimited AI generations', included: true },
      { text: 'All 6 creative modules', included: true },
      { text: 'AI chat assistant', included: true },
      { text: 'Unlimited saved projects', included: true },
      { text: 'TXT export', included: true },
      { text: 'PDF & DOCX export', included: true },
      { text: 'Unlimited projects', included: true },
      { text: 'Priority AI generation', included: true },
      { text: 'Advanced refinement rounds', included: true },
      { text: 'API access (coming soon)', included: true },
    ],
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 bg-dark-950 overflow-hidden">
      <div className="glow-orb w-[500px] h-[500px] bg-brand-700 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
            SIMPLE PRICING
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Start free,{' '}
            <span className="bg-gradient-to-r from-amber-400 to-brand-400 bg-clip-text text-transparent">
              scale as you grow
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            No hidden fees. No complicated tiers. Just powerful AI creativity at a fair price.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                plan.highlight
                  ? 'pricing-card-pro border-brand-500/40 shadow-brand-lg'
                  : 'bg-dark-900/60 border-white/5'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-500 to-purple-600 text-white text-xs font-bold shadow-brand">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  plan.highlight ? 'bg-gradient-to-br from-brand-500 to-purple-600 shadow-brand' : 'bg-dark-700'
                }`}>
                  <plan.icon className={`w-5 h-5 ${plan.highlight ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-500">{plan.description.substring(0, 30)}...</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1.5">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-slate-500 pb-1.5 text-sm">/{plan.period}</span>
                </div>
              </div>

              <Link
                href={plan.href}
                className={`w-full flex items-center justify-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 mb-7 ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-brand-500 to-purple-600 text-white hover:from-brand-600 hover:to-purple-700 shadow-brand hover:shadow-brand-lg'
                    : 'bg-dark-700 hover:bg-dark-600 text-white border border-white/10'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                      feature.included
                        ? plan.highlight ? 'bg-brand-500/20 text-brand-400' : 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 text-slate-600'
                    }`}>
                      {feature.included
                        ? <Check className="w-2.5 h-2.5" />
                        : <X className="w-2.5 h-2.5" />
                      }
                    </div>
                    <span className={`text-sm ${feature.included ? 'text-slate-300' : 'text-slate-600'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-600 text-sm mt-8">
          All plans include a 7-day free trial on Pro. Cancel anytime. No questions asked.
        </p>
      </div>
    </section>
  )
}
