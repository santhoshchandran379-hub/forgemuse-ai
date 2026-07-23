'use client'

import { Bell, Search, Menu } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/projects': 'My Projects',
  '/dashboard/chat': 'AI Chat',
  '/dashboard/settings': 'Settings',
  '/dashboard/create': 'New Project',
  '/dashboard/create/song': 'Song Creator',
  '/dashboard/create/lyrics': 'Lyrics Improver',
  '/dashboard/create/story': 'Story Generator',
  '/dashboard/create/script': 'Script Writer',
  '/dashboard/create/blog': 'Blog Writer',
  '/dashboard/create/social': 'Social Media Post',
  '/dashboard/create/ad': 'Ad Copy Writer',
}

export default function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth()
  const pathname = usePathname()

  const title = Object.entries(pageTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => pathname.startsWith(path))?.[1] || 'Dashboard'

  return (
    <header className="flex-shrink-0 h-14 bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 px-4 md:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-800 transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h1 className="text-lg font-bold text-slate-900 dark:text-white hidden md:block">{title}</h1>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-dark-800 border border-transparent dark:border-slate-700/50 rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:bg-white dark:focus:bg-dark-700 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-800 transition-all">
          <Bell className="w-4 h-4" />
          <span className="notification-dot" />
        </button>

        {/* User avatar */}
        {user && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  )
}
