'use client'

import {
  Music, BookOpen, Film, Newspaper, Share2, Megaphone,
  Sparkles, Wand2, BarChart3, Download, MessageSquare, RefreshCw,
  ChevronRight
} from 'lucide-react'

const features = [
  {
    icon: Music,
    title: 'Song Creator',
    description: 'Generate complete songs with verses, choruses, bridges, chord progressions, and musical key suggestions tailored to your mood and genre.',
    badge: 'Popular',
    badgeColor: 'badge-blue',
    gradient: 'from-brand-500 to-blue-600',
  },
  {
    icon: Wand2,
    title: 'Lyrics Improver',
    description: 'Analyze and enhance existing lyrics for better emotional impact, flow, rhyming, imagery, and readability with side-by-side comparisons.',
    badge: 'Core Feature',
    badgeColor: 'badge-purple',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: BookOpen,
    title: 'Story Generator',
    description: 'Craft compelling stories with rich characters, detailed plots, multiple chapters, satisfying endings, and alternative story branches.',
    badge: '',
    badgeColor: '',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Film,
    title: 'Script Writer',
    description: 'Generate original movie and short-film scripts with scene breakdowns, character profiles, dialogue, and story structure — no copyrighted content.',
    badge: '',
    badgeColor: '',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: MessageSquare,
    title: 'AI Chat Assistant',
    description: 'Conversational AI that helps you brainstorm, refine ideas, answer creative questions, and continue editing within each project context.',
    badge: 'Smart',
    badgeColor: 'badge-green',
    gradient: 'from-cyan-500 to-brand-600',
  },
  {
    icon: Download,
    title: 'Export Anywhere',
    description: 'Export your creative work as PDF, DOCX, or TXT files. Take your creations anywhere and share them in the format you prefer.',
    badge: '',
    badgeColor: '',
    gradient: 'from-rose-500 to-red-600',
  },
]

const highlights = [
  { icon: Sparkles, text: 'IBM Granite AI engine' },
  { icon: RefreshCw, text: 'Multiple refinement rounds' },
  { icon: BarChart3, text: 'Usage analytics dashboard' },
  { icon: Share2, text: 'Project management suite' },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 bg-dark-950 overflow-hidden">
      <div className="glow-orb w-[500px] h-[500px] bg-purple-700 right-0 top-1/2 -translate-y-1/2 translate-x-1/2 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3 h-3" />
            POWERFUL FEATURES
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-purple-400 to-brand-400 bg-clip-text text-transparent">
              create brilliantly
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg">
            Six powerful creative modules, all powered by advanced AI and designed to amplify your creative voice.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-dark-900/60 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 feature-card cursor-pointer"
            >
              {/* Gradient accent top */}
              <div className={`absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r ${feature.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                {feature.badge && (
                  <span className={feature.badgeColor}>{feature.badge}</span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>

              <div className="mt-4 flex items-center gap-1 text-xs text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Explore feature</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Highlights bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 py-6 border-t border-b border-white/5">
          {highlights.map((h) => (
            <div key={h.text} className="flex items-center gap-2.5 text-slate-400">
              <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center">
                <h.icon className="w-3.5 h-3.5 text-brand-400" />
              </div>
              <span className="text-sm font-medium">{h.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
