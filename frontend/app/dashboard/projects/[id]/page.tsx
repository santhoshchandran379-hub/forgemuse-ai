'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import Link from 'next/link'
import { Download, Clock, Sparkles, ArrowLeft, FileText, FileDown, File } from 'lucide-react'
import { exportAsPDF, exportAsDOCX, exportAsTXT } from '@/lib/export'
import toast from 'react-hot-toast'
import api from '@/components/providers/AuthProvider'
import { useState } from 'react'

interface Project {
  _id: string
  title: string
  type: string
  content: string
  excerpt: string
  updatedAt: string
  createdAt: string
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) return
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${params.id}`)
        setProject(res.data.project)
      } catch {
        toast.error('Project not found')
        router.push('/dashboard/projects')
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [params.id, isAuthenticated, router])

  const handleExport = async (format: 'pdf' | 'docx' | 'txt') => {
    if (!project) return
    const content = project.content?.startsWith('{')
      ? JSON.stringify(JSON.parse(project.content), null, 2)
      : project.content || project.excerpt
    try {
      if (format === 'pdf') await exportAsPDF(project.title, content)
      else if (format === 'docx') await exportAsDOCX(project.title, content)
      else exportAsTXT(project.title, content)
      toast.success(`Exported as ${format.toUpperCase()}`)
    } catch {
      toast.error('Export failed')
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-4 w-48" />
          <div className="skeleton h-64 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!project) return null

  let displayContent = project.content || ''
  if (displayContent.startsWith('{')) {
    try { displayContent = JSON.stringify(JSON.parse(displayContent), null, 2) } catch {}
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-up">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/projects" className="btn-ghost py-2 px-3">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">{project.title}</h1>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
            <span className="capitalize">{project.type}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport('txt')} className="btn-ghost text-xs py-1.5 px-3">
            <FileText className="w-3.5 h-3.5" /> TXT
          </button>
          <button onClick={() => handleExport('pdf')} className="btn-ghost text-xs py-1.5 px-3">
            <FileDown className="w-3.5 h-3.5" /> PDF
          </button>
          <button onClick={() => handleExport('docx')} className="btn-primary text-xs py-1.5 px-3">
            <File className="w-3.5 h-3.5" /> DOCX
          </button>
        </div>
      </div>

      <div className="card p-6">
        <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto">
          {displayContent}
        </pre>
      </div>
    </div>
  )
}
