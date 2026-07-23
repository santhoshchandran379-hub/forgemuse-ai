'use client'

import { useState } from 'react'
import { Share2, Sparkles, Loader2, Copy, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/components/providers/AuthProvider'

const platforms = ['Twitter/X', 'Instagram', 'LinkedIn', 'TikTok', 'Facebook', 'Threads', 'Pinterest']
const postTypes = ['Brand Announcement', 'Educational', 'Engagement Question', 'Product Showcase', 'Behind the Scenes', 'Motivational', 'Thread/Carousel', 'Viral Hook']
const tones = ['Professional', 'Casual & Fun', 'Inspirational', 'Witty', 'Conversational', 'Authoritative']

export default function SocialMediaPage() {
  const [form, setForm] = useState({ topic: '', platform: 'Twitter/X', postType: 'Brand Announcement', tone: 'Casual & Fun', callToAction: '', hashtags: true })
  const [output, setOutput] = useState<{ posts: Array<{ platform: string; content: string; hashtags?: string; notes?: string }> } | null>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleGenerate = async () => {
    if (!form.topic.trim()) return toast.error('Please enter your post topic')
    setLoading(true)
    setOutput(null)
    try {
      const res = await api.post('/ai/social', form)
      setOutput(res.data.result)
      toast.success('Social posts generated!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Generation failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!output) return
    try {
      await api.post('/projects', { title: `Social Post - ${form.topic.substring(0, 30)}`, type: 'social', content: JSON.stringify(output), excerpt: output.posts?.[0]?.content?.substring(0, 80) })
      setSaved(true)
      toast.success('Posts saved!')
    } catch { toast.error('Failed to save') }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center"><Share2 className="w-5 h-5 text-pink-400" /></div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Social Media Post</h1>
          <p className="text-sm text-slate-500">Generate engaging content for all platforms</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 card p-5 space-y-4 h-fit">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Post Topic / Idea <span className="text-red-400">*</span></label>
            <textarea value={form.topic} onChange={(e) => setForm({...form, topic: e.target.value})} placeholder="E.g., Launching our new AI song creator feature..." className="textarea-field h-24" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Platform</label>
              <select value={form.platform} onChange={(e) => setForm({...form, platform: e.target.value})} className="select-field text-sm">
                {platforms.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Post Type</label>
              <select value={form.postType} onChange={(e) => setForm({...form, postType: e.target.value})} className="select-field text-sm">
                {postTypes.map(p => <option key={p}>{p}</option>)}
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Call to Action</label>
            <input value={form.callToAction} onChange={(e) => setForm({...form, callToAction: e.target.value})} placeholder="E.g., Try it free today!" className="input-field text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="hashtags" checked={form.hashtags} onChange={(e) => setForm({...form, hashtags: e.target.checked})} className="w-4 h-4 rounded" />
            <label htmlFor="hashtags" className="text-sm text-slate-700 dark:text-slate-300">Include hashtags</label>
          </div>
          <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating posts...</> : <><Sparkles className="w-4 h-4" /> Generate Posts</>}
          </button>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {loading && <div className="card p-12 flex flex-col items-center gap-4"><Share2 className="w-10 h-10 text-pink-400 animate-pulse-slow" /><p className="font-semibold text-slate-500">Creating your social posts...</p></div>}
          {output && !loading && (
            <div className="space-y-4">
              {output.posts?.map((post, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge badge-purple">{post.platform}</span>
                    <button onClick={() => { navigator.clipboard.writeText(post.content + (post.hashtags ? '\n' + post.hashtags : '')); toast.success('Copied!') }} className="btn-ghost text-xs py-1 px-2"><Copy className="w-3 h-3" /></button>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-2 whitespace-pre-line">{post.content}</p>
                  {post.hashtags && <p className="text-xs text-brand-500">{post.hashtags}</p>}
                  {post.notes && <p className="text-xs text-slate-500 mt-2 italic">{post.notes}</p>}
                </div>
              ))}
              <button onClick={handleSave} disabled={saved} className="btn-primary py-2.5 disabled:opacity-60"><Save className="w-4 h-4" />{saved ? 'Saved' : 'Save All Posts'}</button>
            </div>
          )}
          {!output && !loading && <div className="card p-12 flex flex-col items-center gap-4 border-dashed"><Share2 className="w-10 h-10 text-slate-400" /><div className="text-center"><p className="font-semibold text-slate-500">Your posts will appear here</p><p className="text-sm text-slate-500 mt-1">Enter your topic to begin</p></div></div>}
        </div>
      </div>
    </div>
  )
}
