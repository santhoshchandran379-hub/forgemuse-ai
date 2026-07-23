'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'
import {
  Plus, Music, BookOpen, Film, Wand2, MessageSquare, FolderOpen,
  TrendingUp, Sparkles, ArrowRight, Clock, Zap, Target
} from 'lucide-react'
import api from '@/components/providers/AuthProvider'

interface Project {
  _id: string
  title: string
  type: string
  updatedAt: string
  excerpt?: string
}

const quickActions = [
  { icon: Music, label: 'Song Creator', href: '/dashboard/create/song', color: 'from-brand-500 to-blue-600', bg: 'bg-brand-500/10', iconColor: 'text-brand-400' },
  { icon: Wand2, label: 'Lyrics Improver', href: '/dashboard/create/lyrics', color: 'from-purple-500 to-pink-600', bg: 'bg-purple-500/10', iconColor: 'text-purple-400' },
  { icon: BookOpen, label: 'Story Generator', href: '/dashboard/create/story', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' },
  { icon: Film, label: 'Script Writer', href: '/dashboard/create/script', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-500/10', iconColor: 'text-amber-400' },
]

const typeLabels: Record<string, string> = {
  song: 'Song Lyrics',
  lyrics: 'Lyrics',
  story: 'Story',
  script: 'Movie Script',
  blog: 'Blog Post',
  social: 'Social Post',
  ad: 'Ad Copy',
}

const typeColors: Record<string, string> = {
  song: 'badge-blue',
  lyrics: 'badge-purple',
  story: 'badge-green',
  script: 'badge-amber',
  blog: 'badge-blue',
  social: 'badge-purple',
  ad: 'badge-green',
}

function timeAgo(date: string) {
  const d = new Date(date)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects?limit=6&sort=-updatedAt')
        setProjects(res.data.projects || [])
      } catch {
        // show empty state
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const usagePercent = user
    ? Math.round((user.aiUsage.used / user.aiUsage.limit) * 100)
    : 0

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto animate-fade-up">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
            Good {getGreeting()}, {user?.name?.split(' ')[0] || 'Creator'} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            What will you create today?
          </p>
        </div>
        <Link href="/dashboard/create" className="btn-primary self-start md:self-auto">
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: FolderOpen,
            label: 'Total Projects',
            value: projects.length || '0',
            sub: 'All time',
            color: 'text-brand-500',
            bg: 'bg-brand-500/10',
          },
          {
            icon: Zap,
            label: 'AI Generations',
            value: user?.aiUsage.used || 0,
            sub: `of ${user?.aiUsage.limit || 10} this month`,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
          },
          {
            icon: Target,
            label: 'Plan',
            value: user?.plan === 'pro' ? 'Pro' : 'Free',
            sub: user?.plan === 'pro' ? 'Unlimited generations' : 'Upgrade for more',
            color: user?.plan === 'pro' ? 'text-amber-500' : 'text-emerald-500',
            bg: user?.plan === 'pro' ? 'bg-amber-500/10' : 'bg-emerald-500/10',
          },
          {
            icon: TrendingUp,
            label: 'Usage',
            value: `${usagePercent}%`,
            sub: 'This billing cycle',
            color: 'text-cyan-500',
            bg: 'bg-cyan-500/10',
          },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mb-0.5">{stat.value}</div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{stat.label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* AI usage progress */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">AI Usage This Month</span>
          </div>
          <span className="text-xs text-slate-500">
            {user?.aiUsage.used || 0} / {user?.aiUsage.limit || 10} generations
          </span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              usagePercent > 80 ? 'bg-red-500' : usagePercent > 60 ? 'bg-amber-500' : 'bg-gradient-to-r from-brand-500 to-purple-500'
            }`}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
        {user?.plan === 'free' && usagePercent > 70 && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-amber-600 dark:text-amber-400">You're running low on generations</p>
            <Link href="/dashboard/settings?tab=billing" className="text-xs text-brand-500 hover:text-brand-400 font-medium">
              Upgrade to Pro →
            </Link>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Create</h2>
          <Link href="/dashboard/create" className="text-sm text-brand-500 hover:text-brand-400 font-medium flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="card-hover group p-5 flex flex-col gap-3 items-start"
            >
              <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className={`w-5 h-5 ${action.iconColor}`} />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Projects</h2>
          <Link href="/dashboard/projects" className="text-sm text-brand-500 hover:text-brand-400 font-medium flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-5 space-y-3">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-8 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-dark-800 flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No projects yet</h3>
            <p className="text-slate-500 text-sm mb-5">Start by creating your first AI-powered creative project</p>
            <Link href="/dashboard/create" className="btn-primary">
              <Plus className="w-4 h-4" />
              Create First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={`/dashboard/projects/${project._id}`}
                className="card-hover p-5 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={typeColors[project.type] || 'badge-blue'}>{typeLabels[project.type] || project.type}</span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {timeAgo(project.updatedAt)}
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1 line-clamp-1">
                  {project.title}
                </h3>
                {project.excerpt && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{project.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}
