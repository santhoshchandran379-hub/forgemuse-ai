'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import {
  LayoutDashboard, FolderOpen, Plus, Music, BookOpen, Film,
  Newspaper, Share2, Megaphone, Wand2, MessageSquare, Settings,
  LogOut, Sun, Moon, Sparkles, ChevronLeft, ChevronRight,
  User, Bell
} from 'lucide-react'

const mainNav = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FolderOpen, label: 'My Projects', href: '/dashboard/projects' },
  { icon: MessageSquare, label: 'AI Chat', href: '/dashboard/chat' },
]

const creativeNav = [
  { icon: Music, label: 'Song Creator', href: '/dashboard/create/song', color: 'text-brand-400' },
  { icon: Wand2, label: 'Lyrics Improver', href: '/dashboard/create/lyrics', color: 'text-purple-400' },
  { icon: BookOpen, label: 'Story Generator', href: '/dashboard/create/story', color: 'text-emerald-400' },
  { icon: Film, label: 'Script Writer', href: '/dashboard/create/script', color: 'text-amber-400' },
  { icon: Newspaper, label: 'Blog Writer', href: '/dashboard/create/blog', color: 'text-cyan-400' },
  { icon: Share2, label: 'Social Media', href: '/dashboard/create/social', color: 'text-pink-400' },
  { icon: Megaphone, label: 'Ad Copy', href: '/dashboard/create/ad', color: 'text-rose-400' },
]

const bottomNav = [
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  return (
    <aside
      className={`relative flex flex-col h-full bg-white dark:bg-dark-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-200 dark:border-slate-800 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-brand flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-sm leading-none">ForgeMuse AI</div>
            <div className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Creative Studio</div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shadow-sm transition-all z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Scrollable nav area */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6 scrollbar-hide">
        {/* Main nav */}
        <div>
          {!collapsed && <div className="px-2 mb-1 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Main</div>}
          <div className="space-y-0.5">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item ${isActive(item.href) ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        </div>

        {/* Create New */}
        {!collapsed && (
          <Link
            href="/dashboard/create"
            className="flex items-center justify-center gap-2 mx-2 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white text-sm font-semibold hover:from-brand-600 hover:to-purple-700 transition-all shadow-brand hover:shadow-brand-lg"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        )}
        {collapsed && (
          <Link
            href="/dashboard/create"
            className="flex items-center justify-center w-9 h-9 mx-auto rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white hover:from-brand-600 hover:to-purple-700 transition-all shadow-brand"
            title="New Project"
          >
            <Plus className="w-4 h-4" />
          </Link>
        )}

        {/* Creative modules */}
        <div>
          {!collapsed && <div className="px-2 mb-1 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Creative Modules</div>}
          <div className="space-y-0.5">
            {creativeNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item ${isActive(item.href) ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${item.color}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-2 py-3 border-t border-slate-200 dark:border-slate-800 space-y-0.5">
        {bottomNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-item ${isActive(item.href) ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`sidebar-item w-full ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 flex-shrink-0" /> : <Moon className="w-4 h-4 flex-shrink-0" />}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Logout */}
        <button
          onClick={() => { logout(); router.push('/') }}
          className={`sidebar-item w-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        {/* User avatar */}
        {!collapsed && user && (
          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-800 transition-all group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{user.name}</div>
                <div className="text-xs text-slate-500 truncate">{user.email}</div>
              </div>
              <span className={`badge text-[10px] px-1.5 py-0.5 ${user.plan === 'pro' ? 'badge-purple' : 'badge-blue'}`}>
                {user.plan === 'pro' ? 'Pro' : 'Free'}
              </span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}
