'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Play, Star, Zap, Music, BookOpen, Film } from 'lucide-react'

const floatingTags = [
  { icon: Music, label: 'Song Lyrics', color: 'brand', delay: '0s' },
  { icon: BookOpen, label: 'Story Writer', color: 'purple', delay: '1.5s' },
  { icon: Film, label: 'Script Creator', color: 'brand', delay: '0.8s' },
  { icon: Zap, label: 'AI-Powered', color: 'amber', delay: '2s' },
]

const stats = [
  { value: '50K+', label: 'Projects Created' },
  { value: '98%', label: 'User Satisfaction' },
  { value: '6', label: 'Creative Modules' },
  { value: '∞', label: 'Possibilities' },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950 pt-16">
      {/* Background glow orbs */}
      <div className="glow-orb w-[600px] h-[600px] bg-brand-600 left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2" />
      <div className="glow-orb w-[400px] h-[400px] bg-purple-600 right-1/4 bottom-1/4 translate-x-1/2 translate-y-1/2" />
      <div className="glow-orb w-[300px] h-[300px] bg-brand-400 right-1/3 top-1/3 opacity-20" />

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(59,98,245,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(59,98,245,0.8) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by IBM Granite AI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.05] animate-fade-up">
          From{' '}
          <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Imagination
          </span>
          <br />
          to{' '}
          <span className="relative">
            <span className="bg-gradient-to-r from-amber-400 to-brand-400 bg-clip-text text-transparent">
              Creation
            </span>
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-brand-400 rounded-full opacity-60" />
          </span>
          .
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-400 mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
          ForgeMuse AI is your creative collaborator — generating songs, stories, scripts, and more with the power of advanced AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <Link href="/auth/register" className="btn-primary text-base py-3.5 px-8 shadow-brand-lg group">
            Start Creating Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#how-it-works" className="btn-secondary text-base py-3.5 px-8 bg-white/5 border-white/10 text-white hover:bg-white/10">
            <Play className="w-4 h-4 text-brand-400" />
            See How It Works
          </a>
        </div>

        {/* Stars social proof */}
        <div className="flex items-center justify-center gap-3 mb-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex -space-x-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 border-2 border-dark-950 flex items-center justify-center text-white text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-slate-400 text-sm">Loved by 10,000+ creators</span>
        </div>

        {/* App preview card */}
        <div className="relative max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-dark-900/80 backdrop-blur-sm">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-dark-800/80 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-3 text-xs text-slate-500 font-mono">forgemuseai.com/dashboard</span>
            </div>

            {/* Dashboard preview */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-dark-900">
              {/* Sidebar preview */}
              <div className="hidden md:block bg-dark-800/60 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600" />
                  <div className="h-3 w-20 bg-slate-700 rounded-full" />
                </div>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`flex items-center gap-2 p-2 rounded-lg mb-1 ${i === 0 ? 'bg-brand-500/15 border border-brand-500/20' : ''}`}>
                    <div className={`w-4 h-4 rounded ${i === 0 ? 'bg-brand-500' : 'bg-slate-700'}`} />
                    <div className={`h-2.5 rounded-full ${i === 0 ? 'w-16 bg-brand-400/60' : 'w-12 bg-slate-700'}`} />
                  </div>
                ))}
              </div>

              {/* Main content preview */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="h-4 w-32 bg-slate-700 rounded-full mb-2" />
                    <div className="h-2.5 w-48 bg-slate-800 rounded-full" />
                  </div>
                  <div className="h-8 w-28 rounded-lg bg-brand-500/80" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-dark-800/60 rounded-xl p-3 border border-white/5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500/40 to-purple-500/40 mb-2" />
                      <div className="h-5 w-12 bg-slate-600 rounded-full mb-1" />
                      <div className="h-2 w-16 bg-slate-800 rounded-full" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-dark-800/60 rounded-xl p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-brand-500/30" />
                        <div>
                          <div className="h-2.5 w-20 bg-slate-700 rounded-full mb-1" />
                          <div className="h-2 w-12 bg-slate-800 rounded-full" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 bg-slate-700 rounded-full" />
                        <div className="h-2 w-4/5 bg-slate-700 rounded-full" />
                        <div className="h-2 w-3/5 bg-slate-700 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating feature badges */}
          {floatingTags.map((tag, i) => (
            <div
              key={i}
              className="absolute hidden lg:flex items-center gap-2 px-3 py-2 bg-dark-800/90 border border-white/10 rounded-xl text-xs font-medium text-slate-300 shadow-glass animate-float"
              style={{
                animationDelay: tag.delay,
                ...(i === 0 ? { top: '10%', left: '-5%' } :
                  i === 1 ? { top: '25%', right: '-5%' } :
                  i === 2 ? { bottom: '20%', left: '-5%' } :
                  { bottom: '10%', right: '-5%' }),
              }}
            >
              <tag.icon className="w-3.5 h-3.5 text-brand-400" />
              {tag.label}
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-16 animate-fade-up" style={{ animationDelay: '0.5s' }}>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-950 to-transparent" />
    </section>
  )
}
