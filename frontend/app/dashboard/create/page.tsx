'use client'

import { useState } from 'react'
import {
  Music, Wand2, BookOpen, Film, Newspaper, Share2, Megaphone, ArrowRight
} from 'lucide-react'
import Link from 'next/link'

const projectTypes = [
  {
    id: 'song',
    icon: Music,
    title: 'Song Creator',
    description: 'Generate complete songs with verses, choruses, bridges, chord progressions, and musical keys.',
    tags: ['Lyrics', 'Chords', 'Structure'],
    color: 'from-brand-500 to-blue-600',
    bg: 'bg-brand-500/10',
    border: 'hover:border-brand-500/40',
    iconColor: 'text-brand-400',
  },
  {
    id: 'lyrics',
    icon: Wand2,
    title: 'Lyrics Improver',
    description: 'Analyze and enhance your existing lyrics for better emotional impact, flow, and imagery.',
    tags: ['Improve', 'Refine', 'Compare'],
    color: 'from-purple-500 to-pink-600',
    bg: 'bg-purple-500/10',
    border: 'hover:border-purple-500/40',
    iconColor: 'text-purple-400',
  },
  {
    id: 'story',
    icon: BookOpen,
    title: 'Story Generator',
    description: 'Create original stories with characters, detailed plots, chapters, and alternative endings.',
    tags: ['Characters', 'Plot', 'Chapters'],
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-500/10',
    border: 'hover:border-emerald-500/40',
    iconColor: 'text-emerald-400',
  },
  {
    id: 'script',
    icon: Film,
    title: 'Script Writer',
    description: 'Generate original movie or short-film scripts with scene breakdowns, characters, and dialogue.',
    tags: ['Scenes', 'Dialogue', 'Characters'],
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-500/10',
    border: 'hover:border-amber-500/40',
    iconColor: 'text-amber-400',
  },
  {
    id: 'blog',
    icon: Newspaper,
    title: 'Blog Writer',
    description: 'Create engaging, SEO-optimized blog posts with introductions, sections, and conclusions.',
    tags: ['SEO', 'Long-form', 'Sections'],
    color: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-500/10',
    border: 'hover:border-cyan-500/40',
    iconColor: 'text-cyan-400',
  },
  {
    id: 'social',
    icon: Share2,
    title: 'Social Media Post',
    description: 'Generate engaging social media content for Twitter, Instagram, LinkedIn, and TikTok.',
    tags: ['Twitter', 'Instagram', 'LinkedIn'],
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-500/10',
    border: 'hover:border-pink-500/40',
    iconColor: 'text-pink-400',
  },
  {
    id: 'ad',
    icon: Megaphone,
    title: 'Ad Copy Writer',
    description: 'Write compelling advertisement copy for products, services, and brands that converts.',
    tags: ['Headlines', 'CTA', 'Conversion'],
    color: 'from-rose-500 to-red-600',
    bg: 'bg-rose-500/10',
    border: 'hover:border-rose-500/40',
    iconColor: 'text-rose-400',
  },
]

export default function CreateProjectPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-up">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
          Choose Project Type
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Select the type of creative project you want to build with AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {projectTypes.map((type) => (
          <Link
            key={type.id}
            href={`/dashboard/create/${type.id}`}
            className={`group card p-6 ${type.border} hover:shadow-lg transition-all duration-300 cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${type.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <type.icon className={`w-6 h-6 ${type.iconColor}`} />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {type.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              {type.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {type.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-dark-700 text-xs text-slate-500 dark:text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
