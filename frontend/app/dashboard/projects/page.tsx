'use client'

import { useState, useEffect } from 'react'
import {
  FolderOpen, Plus, Search, Filter, Trash2, Edit3, Copy, Download,
  Clock, Music, BookOpen, Film, Newspaper, Share2, Megaphone, Wand2,
  MoreHorizontal, Grid3X3, List, Loader2
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api from '@/components/providers/AuthProvider'
import { exportAsPDF, exportAsDOCX, exportAsTXT } from '@/lib/export'

interface Project {
  _id: string
  title: string
  type: string
  excerpt: string
  content: string
  updatedAt: string
  createdAt: string
}

const typeConfig: Record<string, { icon: any; color: string; label: string }> = {
  song: { icon: Music, color: 'text-brand-400', label: 'Song Lyrics' },
  lyrics: { icon: Wand2, color: 'text-purple-400', label: 'Lyrics' },
  story: { icon: BookOpen, color: 'text-emerald-400', label: 'Story' },
  script: { icon: Film, color: 'text-amber-400', label: 'Script' },
  blog: { icon: Newspaper, color: 'text-cyan-400', label: 'Blog Post' },
  social: { icon: Share2, color: 'text-pink-400', label: 'Social Post' },
  ad: { icon: Megaphone, color: 'text-rose-400', label: 'Ad Copy' },
}

const badgeClasses: Record<string, string> = {
  song: 'badge-blue', lyrics: 'badge-purple', story: 'badge-green',
  script: 'badge-amber', blog: 'badge-blue', social: 'badge-purple', ad: 'badge-green',
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects?sort=-updatedAt')
      setProjects(res.data.projects || [])
    } catch {
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return
    try {
      await api.delete(`/projects/${id}`)
      setProjects(prev => prev.filter(p => p._id !== id))
      toast.success('Project deleted')
    } catch {
      toast.error('Failed to delete')
    }
    setOpenMenu(null)
  }

  const handleDuplicate = async (project: Project) => {
    try {
      const res = await api.post('/projects', { ...project, title: `${project.title} (Copy)`, _id: undefined })
      setProjects(prev => [res.data.project, ...prev])
      toast.success('Project duplicated')
    } catch {
      toast.error('Failed to duplicate')
    }
    setOpenMenu(null)
  }

  const handleRename = async (id: string) => {
    if (!renameValue.trim()) return
    try {
      await api.put(`/projects/${id}`, { title: renameValue })
      setProjects(prev => prev.map(p => p._id === id ? { ...p, title: renameValue } : p))
      toast.success('Renamed')
    } catch {
      toast.error('Failed to rename')
    }
    setRenamingId(null)
  }

  const handleExport = async (project: Project, format: 'pdf' | 'docx' | 'txt') => {
    const content = project.content || project.excerpt || ''
    const textContent = typeof content === 'string' && content.startsWith('{')
      ? JSON.stringify(JSON.parse(content), null, 2)
      : content
    try {
      if (format === 'pdf') await exportAsPDF(project.title, textContent)
      else if (format === 'docx') await exportAsDOCX(project.title, textContent)
      else exportAsTXT(project.title, textContent)
      toast.success(`Exported as ${format.toUpperCase()}`)
    } catch {
      toast.error('Export failed')
    }
    setOpenMenu(null)
  }

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || (p.excerpt?.toLowerCase().includes(search.toLowerCase()))
    const matchType = filterType === 'all' || p.type === filterType
    return matchSearch && matchType
  })

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Projects</h1>
          <p className="text-sm text-slate-500">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/dashboard/create" className="btn-primary self-start md:self-auto">
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="input-field pl-9 text-sm py-2.5"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="select-field text-sm py-2.5 pr-8"
          >
            <option value="all">All Types</option>
            {Object.entries(typeConfig).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-dark-800 rounded-xl p-1">
          <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white dark:bg-dark-700 shadow-sm' : ''}`}>
            <Grid3X3 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          </button>
          <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white dark:bg-dark-700 shadow-sm' : ''}`}>
            <List className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">
            {search || filterType !== 'all' ? 'No projects match your filters' : 'No projects yet'}
          </h3>
          <p className="text-slate-500 text-sm mb-5">
            {search || filterType !== 'all' ? 'Try adjusting your search or filters' : 'Create your first AI project to get started'}
          </p>
          {!search && filterType === 'all' && (
            <Link href="/dashboard/create" className="btn-primary">
              <Plus className="w-4 h-4" /> Create First Project
            </Link>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const cfg = typeConfig[project.type] || typeConfig.blog
            const Icon = cfg.icon
            return (
              <div key={project._id} className="card group overflow-hidden hover:border-brand-500/30 hover:shadow-md transition-all duration-300">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Icon className={`w-5 h-5 ${cfg.color} flex-shrink-0`} />
                    <div className="flex items-center gap-1.5">
                      <span className={`badge ${badgeClasses[project.type] || 'badge-blue'}`}>{cfg.label}</span>
                      <div className="relative">
                        <button onClick={() => setOpenMenu(openMenu === project._id ? null : project._id)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-700 transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openMenu === project._id && (
                          <div className="absolute right-0 top-8 w-44 bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-glass overflow-hidden z-20">
                            <button onClick={() => { setRenamingId(project._id); setRenameValue(project.title); setOpenMenu(null) }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-700 transition-all">
                              <Edit3 className="w-3.5 h-3.5" /> Rename
                            </button>
                            <button onClick={() => handleDuplicate(project)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-700 transition-all">
                              <Copy className="w-3.5 h-3.5" /> Duplicate
                            </button>
                            <div className="h-px bg-slate-200 dark:bg-slate-700" />
                            <div className="px-3 py-1.5">
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Export</p>
                              {(['pdf', 'docx', 'txt'] as const).map(f => (
                                <button key={f} onClick={() => handleExport(project, f)} className="w-full flex items-center gap-2 px-1 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                  <Download className="w-3 h-3" /> {f.toUpperCase()}
                                </button>
                              ))}
                            </div>
                            <div className="h-px bg-slate-200 dark:bg-slate-700" />
                            <button onClick={() => handleDelete(project._id)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {renamingId === project._id ? (
                    <div className="flex gap-2 mb-2">
                      <input
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleRename(project._id); if (e.key === 'Escape') setRenamingId(null) }}
                        className="input-field text-sm py-1.5 flex-1"
                        autoFocus
                      />
                      <button onClick={() => handleRename(project._id)} className="btn-primary text-xs py-1.5 px-3">Save</button>
                    </div>
                  ) : (
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1.5 line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {project.title}
                    </h3>
                  )}

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{project.excerpt}</p>
                </div>
                <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {timeAgo(project.updatedAt)}
                  </div>
                  <Link href={`/dashboard/projects/${project._id}`} className="text-xs text-brand-500 hover:text-brand-400 font-medium">
                    Open →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((project) => {
            const cfg = typeConfig[project.type] || typeConfig.blog
            const Icon = cfg.icon
            return (
              <div key={project._id} className="card flex items-center gap-4 px-5 py-4 hover:border-brand-500/30 transition-all group">
                <Icon className={`w-5 h-5 ${cfg.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white truncate">{project.title}</span>
                    <span className={`badge ${badgeClasses[project.type] || 'badge-blue'} text-[10px]`}>{cfg.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{project.excerpt}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-400">{timeAgo(project.updatedAt)}</span>
                  <button onClick={() => handleDelete(project._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
