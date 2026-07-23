'use client'

import { useState } from 'react'
import { Megaphone, Sparkles, Loader2, Copy, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/components/providers/AuthProvider'

const adTypes = ['Google Ad', 'Facebook/Instagram Ad', 'Landing Page Headline', 'Product Description', 'Email Subject Line', 'Billboard/Banner', 'Video Script (30s)', 'Radio Spot']
const tones = ['Professional', 'Urgent', 'Friendly', 'Bold', 'Luxury', 'Humor', 'Empathetic', 'Authoritative']

export default function AdCopyPage() {
  const [form, setForm] = useState({ product: '', audience: '', uniqueValue: '', adType: 'Facebook/Instagram Ad', tone: 'Bold', callToAction: '', offer: '' })
  const [output, setOutput] = useState<{ variants: Array<{ headline: string; body: string; cta: string; notes?: string }> } | null>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleGenerate = async () => {
    if (!form.product.trim()) return toast.error('Please describe your product/service')
    setLoading(true); setOutput(null)
    try {
      const res = await api.post('/ai/ad', form)
      setOutput(res.data.result)
      toast.success('Ad copy generated!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Generation failed.')
    } finally { setLoading(false) }
  }

  const handleSave = async () => {
    if (!output) return
    try {
      await api.post('/projects', { title: `Ad Copy – ${form.product.substring(0, 30)}`, type: 'ad', content: JSON.stringify(output), excerpt: output.variants?.[0]?.headline })
      setSaved(true); toast.success('Ad copy saved!')
    } catch { toast.error('Failed to save') }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center"><Megaphone className="w-5 h-5 text-rose-400" /></div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Ad Copy Writer</h1>
          <p className="text-sm text-slate-500">Create compelling advertisement copy that converts</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 card p-5 space-y-4 h-fit">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Product / Service <span className="text-red-400">*</span></label>
            <textarea value={form.product} onChange={(e) => setForm({...form, product: e.target.value})} placeholder="E.g., ForgeMuse AI – an AI creative writing platform..." className="textarea-field h-24" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Ad Type</label>
              <select value={form.adType} onChange={(e) => setForm({...form, adType: e.target.value})} className="select-field text-sm">
                {adTypes.map(a => <option key={a}>{a}</option>)}
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Target Audience</label>
            <input value={form.audience} onChange={(e) => setForm({...form, audience: e.target.value})} placeholder="E.g., 18-35 year-old musicians, songwriters" className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Unique Value Proposition</label>
            <input value={form.uniqueValue} onChange={(e) => setForm({...form, uniqueValue: e.target.value})} placeholder="E.g., Generate complete songs in seconds" className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Offer / CTA</label>
            <input value={form.callToAction} onChange={(e) => setForm({...form, callToAction: e.target.value})} placeholder="E.g., Start free today, 50% off, Limited time" className="input-field text-sm" />
          </div>
          <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Writing ad copy...</> : <><Sparkles className="w-4 h-4" /> Generate Ad Copy</>}
          </button>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {loading && <div className="card p-12 flex flex-col items-center gap-4"><Megaphone className="w-10 h-10 text-rose-400 animate-pulse-slow" /><p className="font-semibold text-slate-500">Crafting your ad copy...</p></div>}
          {output && !loading && (
            <div className="space-y-4">
              <div className="flex justify-end"><button onClick={handleSave} disabled={saved} className="btn-primary text-sm disabled:opacity-60"><Save className="w-4 h-4" />{saved ? 'Saved' : 'Save All'}</button></div>
              {output.variants?.map((v, i) => (
                <div key={i} className="card p-5 border-rose-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge-purple badge">Variant {i + 1}</span>
                    <button onClick={() => { navigator.clipboard.writeText(`${v.headline}\n\n${v.body}\n\n${v.cta}`); toast.success('Copied!') }} className="btn-ghost text-xs py-1 px-2"><Copy className="w-3 h-3" /></button>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{v.headline}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{v.body}</p>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold">{v.cta}</div>
                  {v.notes && <p className="text-xs text-slate-500 mt-3 italic">{v.notes}</p>}
                </div>
              ))}
            </div>
          )}
          {!output && !loading && <div className="card p-12 flex flex-col items-center gap-4 border-dashed"><Megaphone className="w-10 h-10 text-slate-400" /><div className="text-center"><p className="font-semibold text-slate-500">Ad copy variants will appear here</p><p className="text-sm text-slate-500 mt-1">Fill in the details to create compelling ads</p></div></div>}
        </div>
      </div>
    </div>
  )
}
