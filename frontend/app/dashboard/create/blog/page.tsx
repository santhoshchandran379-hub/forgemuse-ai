'use client'

import { useState } from 'react'
import { Newspaper, Sparkles, Loader2, Copy, Save, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/components/providers/AuthProvider'

const categories = ['Technology', 'Business', 'Health & Wellness', 'Travel', 'Food', 'Finance', 'Personal Development', 'Marketing', 'Science', 'Lifestyle', 'Education', 'Entertainment']
const tones = ['Professional', 'Conversational', 'Authoritative', 'Humorous', 'Inspiring', 'Educational', 'Storytelling']
const lengths = ['Short (500-800 words)', 'Medium (1000-1500 words)', 'Long-form (2000+ words)']

export default function BlogWriterPage() {
  const [form, setForm] = useState({ topic: '', category: 'Technology', tone: 'Professional', length: 'Medium (1000-1500 words)', keywords: '', targetAudience: '' })
  const [output, setOutput] = useState<{ title: string; introduction: string; sections: Array<{ heading: string; content: string }>; conclusion: string; seoMeta?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [projectTitle, setProjectTitle] = useState('')

  const handleGenerate = async () => {
    if (!form.topic.trim()) return toast.error('Please enter a blog topic')
    setLoading(true)
    setOutput(null)
    try {
      const res = await api.post('/ai/blog', form)
      setOutput(res.data.result)
      setProjectTitle(res.data.result.title || 'Blog Post')
      toast.success('Blog post generated!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Generation failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!output) return
    try {
      await api.post('/projects', { title: projectTitle, type: 'blog', content: JSON.stringify(output), excerpt: output.introduction?.substring(0, 100) })
      setSaved(true)
      toast.success('Blog saved!')
    } catch { toast.error('Failed to save') }
  }

  const fullText = output ? `# ${output.title}\n\n${output.introduction}\n\n${output.sections?.map(s => `## ${s.heading}\n\n${s.content}`).join('\n\n')}\n\n## Conclusion\n\n${output.conclusion}` : ''

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
          <Newspaper className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Blog Writer</h1>
          <p className="text-sm text-slate-500">Create engaging, SEO-optimized blog posts</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 card p-5 space-y-4 h-fit">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Blog Topic <span className="text-red-400">*</span></label>
            <textarea value={form.topic} onChange={(e) => setForm({...form, topic: e.target.value})} placeholder="E.g., How AI is transforming the music industry..." className="textarea-field h-24" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="select-field text-sm">
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tone</label>
              <select value={form.tone} onChange={(e) => setForm({...form, tone: e.target.value})} className="select-field text-sm">
                {tones.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Article Length</label>
            <select value={form.length} onChange={(e) => setForm({...form, length: e.target.value})} className="select-field text-sm">
              {lengths.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">SEO Keywords</label>
            <input value={form.keywords} onChange={(e) => setForm({...form, keywords: e.target.value})} placeholder="E.g., AI music, machine learning, creativity" className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Target Audience</label>
            <input value={form.targetAudience} onChange={(e) => setForm({...form, targetAudience: e.target.value})} placeholder="E.g., music producers, tech enthusiasts" className="input-field text-sm" />
          </div>
          <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Writing blog post...</> : <><Sparkles className="w-4 h-4" /> Generate Blog Post</>}
          </button>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {loading && <div className="card p-12 flex flex-col items-center gap-4"><Newspaper className="w-10 h-10 text-cyan-400 animate-pulse-slow" /><p className="font-semibold text-slate-500">Writing your blog post...</p></div>}
          {output && !loading && (
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="text-xl font-black text-slate-900 dark:text-white bg-transparent outline-none flex-1 mr-4" />
                <div className="flex gap-2">
                  <button onClick={() => { navigator.clipboard.writeText(fullText); toast.success('Copied!') }} className="btn-ghost text-xs py-1.5 px-3"><Copy className="w-3.5 h-3.5" /> Copy</button>
                  <button onClick={handleSave} disabled={saved} className="btn-primary text-xs py-1.5 px-3 disabled:opacity-60"><Save className="w-3.5 h-3.5" /> {saved ? 'Saved' : 'Save'}</button>
                </div>
              </div>
              <div className="p-6 space-y-5 ai-content text-sm">
                <p className="text-base text-slate-700 dark:text-slate-300 leading-loose border-l-4 border-cyan-500 pl-4 italic">{output.introduction}</p>
                {output.sections?.map((s, i) => (
                  <div key={i}>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{s.heading}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{s.content}</p>
                  </div>
                ))}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Conclusion</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{output.conclusion}</p>
                </div>
                {output.seoMeta && <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-800/60 border border-dashed border-slate-300 dark:border-slate-600 text-xs text-slate-500"><strong>SEO Meta:</strong> {output.seoMeta}</div>}
              </div>
            </div>
          )}
          {!output && !loading && <div className="card p-12 flex flex-col items-center gap-4 border-dashed"><Newspaper className="w-10 h-10 text-slate-400" /><div className="text-center"><p className="font-semibold text-slate-500">Your blog post will appear here</p><p className="text-sm text-slate-500 mt-1">Enter your topic to begin</p></div></div>}
        </div>
      </div>
    </div>
  )
}
