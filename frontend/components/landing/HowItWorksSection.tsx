'use client'

import { UserPlus, FolderPlus, Wand2, Download } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create your account',
    description: 'Sign up for free in seconds. No credit card required. Get instant access to all creative modules.',
    color: 'brand',
  },
  {
    number: '02',
    icon: FolderPlus,
    title: 'Choose your project type',
    description: 'Select from songs, stories, scripts, blogs, social posts, or advertisement copy. Each has its own specialized AI module.',
    color: 'purple',
  },
  {
    number: '03',
    icon: Wand2,
    title: 'Generate with AI',
    description: 'Describe your creative vision, set the mood and style, then let the AI generate professional-quality content in seconds.',
    color: 'amber',
  },
  {
    number: '04',
    icon: Download,
    title: 'Refine and export',
    description: 'Use the AI chat to refine, improve, and polish your work. Export as PDF, DOCX, or TXT when you\'re happy with the result.',
    color: 'emerald',
  },
]

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  brand: {
    bg: 'bg-brand-500/10',
    text: 'text-brand-400',
    border: 'border-brand-500/30',
    glow: 'shadow-brand',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    glow: 'shadow-[0_4px_24px_rgba(168,85,247,0.4)]',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_4px_24px_rgba(245,158,11,0.3)]',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_4px_24px_rgba(16,185,129,0.3)]',
  },
}

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 bg-dark-900 overflow-hidden">
      <div className="glow-orb w-[400px] h-[400px] bg-brand-600 left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-4">
            HOW IT WORKS
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Create in{' '}
            <span className="bg-gradient-to-r from-brand-400 to-emerald-400 bg-clip-text text-transparent">
              4 simple steps
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-slate-400 text-lg">
            From sign-up to export in minutes. No creative writing experience required.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-20 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-brand-500 via-purple-500 via-amber-500 to-emerald-500 opacity-20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const colors = colorMap[step.color]
              return (
                <div key={step.number} className="relative flex flex-col items-center text-center group">
                  {/* Number badge */}
                  <div className={`relative w-16 h-16 rounded-2xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-5 transition-all duration-300 group-hover:${colors.glow}`}>
                    <step.icon className={`w-7 h-7 ${colors.text}`} />
                    <div className={`absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-dark-900 border ${colors.border} flex items-center justify-center`}>
                      <span className={`text-xs font-black ${colors.text}`}>{i + 1}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Demo GIF-style animated preview */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="relative bg-dark-950/60 border border-white/5 rounded-2xl overflow-hidden p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input side */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Your Input</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-16">Theme:</span>
                    <div className="h-7 flex-1 bg-dark-800/80 rounded-lg border border-white/5 flex items-center px-3">
                      <span className="text-xs text-slate-300">Lost love, redemption</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-16">Genre:</span>
                    <div className="h-7 flex-1 bg-dark-800/80 rounded-lg border border-white/5 flex items-center px-3">
                      <span className="text-xs text-slate-300">Indie Pop / R&B</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-16">Mood:</span>
                    <div className="h-7 flex-1 bg-dark-800/80 rounded-lg border border-white/5 flex items-center px-3">
                      <span className="text-xs text-slate-300">Bittersweet, hopeful</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-9 bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">✨ Generate with AI</span>
                </div>
              </div>

              {/* Output side */}
              <div className="bg-dark-800/40 rounded-xl border border-white/5 p-4">
                <div className="text-xs font-semibold text-brand-400 mb-3">✦ AI Output</div>
                <div className="space-y-2 text-xs text-slate-300 font-mono leading-relaxed">
                  <p className="text-slate-500 font-sans font-semibold">VERSE 1</p>
                  <p>The coffee cools beside your chair,</p>
                  <p>A ghost of warmth still lingering there—</p>
                  <p>I've learned to speak to empty rooms,</p>
                  <p>To chase away the midnight gloom.</p>
                  <div className="my-2 h-px bg-white/5" />
                  <p className="text-slate-500 font-sans font-semibold">CHORUS</p>
                  <p>But I'm finding my way back to light,</p>
                  <p>Through the beautiful mess of goodbyes...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
