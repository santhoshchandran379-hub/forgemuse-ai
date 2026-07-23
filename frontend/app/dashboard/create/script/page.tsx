'use client'

import { useState } from 'react'
import { Film, Sparkles, Loader2, Copy, Save, RefreshCw, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/components/providers/AuthProvider'

const scriptTypes = ['Feature Film', 'Short Film', 'TV Pilot', 'Web Series Episode', 'Documentary']
const genres = ['Action/Adventure', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Sci-Fi', 'Romance', 'Mystery', 'Animated', 'Period Piece']

interface ScriptOutput {
  title: string
  logline: string
  characters: Array<{ name: string; description: string }>
  synopsis: string
  scenes: Array<{
    number: number
    location: string
    time: string
    description: string
    dialogue: string
  }>
  copyrightWarning?: string
}

export default function ScriptWriterPage() {
  const [form, setForm] = useState({
    concept: '',
    genre: 'Drama',
    scriptType: 'Short Film',
    protagonist: '',
    antagonist: '',
    setting: '',
    theme: '',
    additionalNotes: '',
  })
  const [output, setOutput] = useState<ScriptOutput | null>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [projectTitle, setProjectTitle] = useState('')
  const [activeScene, setActiveScene] = useState(0)
  const [copyrightRefused, setCopyrightRefused] = useState(false)
  const [refusalMessage, setRefusalMessage] = useState('')

  const handleGenerate = async () => {
    if (!form.concept.trim()) return toast.error('Please describe your script concept')
    setLoading(true)
    setOutput(null)
    setCopyrightRefused(false)
    setSaved(false)
    try {
      const res = await api.post('/ai/script', form)
      if (res.data.copyrightRefused) {
        setCopyrightRefused(true)
        setRefusalMessage(res.data.message)
      } else {
        setOutput(res.data.result)
        setProjectTitle(res.data.result.title || 'Untitled Script')
        setActiveScene(0)
        toast.success('Script generated!')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Generation failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!output) return
    try {
      await api.post('/projects', {
        title: projectTitle,
        type: 'script',
        content: JSON.stringify(output),
        excerpt: output.logline,
      })
      setSaved(true)
      toast.success('Script saved!')
    } catch { toast.error('Failed to save') }
  }

  const formatScriptText = () => {
    if (!output) return ''
    return output.scenes.map(s =>
      `SCENE ${s.number}: ${s.location} - ${s.time}\n\n${s.description}\n\n${s.dialogue}`
    ).join('\n\n' + '─'.repeat(40) + '\n\n')
  }

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <Film className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Script Writer</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Generate original movie and short-film scripts</p>
        </div>
      </div>

      {/* Copyright notice */}
      <div className="mb-5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400">
          <strong>Original Content Only:</strong> ForgeMuse AI generates original scripts. Requests for copyrighted works (existing movies, shows) will be declined and replaced with original inspired content.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Script Concept <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.concept}
                onChange={(e) => update('concept', e.target.value)}
                placeholder="E.g., A jazz musician discovers his late father was a world-renowned thief, and must follow cryptic clues hidden in old compositions..."
                className="textarea-field h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Genre</label>
                <select value={form.genre} onChange={(e) => update('genre', e.target.value)} className="select-field text-sm">
                  {genres.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Script Type</label>
                <select value={form.scriptType} onChange={(e) => update('scriptType', e.target.value)} className="select-field text-sm">
                  {scriptTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Protagonist</label>
              <input value={form.protagonist} onChange={(e) => update('protagonist', e.target.value)} placeholder="Main character description..." className="input-field text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Antagonist / Conflict</label>
              <input value={form.antagonist} onChange={(e) => update('antagonist', e.target.value)} placeholder="Villain or central conflict..." className="input-field text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Setting</label>
              <input value={form.setting} onChange={(e) => update('setting', e.target.value)} placeholder="Time period and location..." className="input-field text-sm" />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Writing script...</> : <><Sparkles className="w-4 h-4" /> Generate Script</>}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-3 space-y-4">
          {copyrightRefused && (
            <div className="card p-6 border-amber-500/30 bg-amber-500/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">Content Policy Notice</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{refusalMessage}</p>
                  <button onClick={() => { setCopyrightRefused(false); setForm({ ...form, concept: '' }) }} className="mt-4 btn-primary text-sm py-2">
                    Create Original Script Instead
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="card p-12 flex flex-col items-center justify-center gap-4">
              <Film className="w-10 h-10 text-amber-400 animate-pulse-slow" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">Writing your script...</p>
            </div>
          )}

          {output && !loading && (
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
                <div className="flex items-center justify-between mb-1">
                  <input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="text-xl font-black text-slate-900 dark:text-white bg-transparent outline-none" />
                  <div className="flex gap-2">
                    <button onClick={() => { navigator.clipboard.writeText(formatScriptText()); toast.success('Copied!') }} className="btn-ghost text-xs py-1.5 px-3"><Copy className="w-3.5 h-3.5" /> Copy</button>
                    <button onClick={handleSave} disabled={saved} className="btn-primary text-xs py-1.5 px-3 disabled:opacity-60"><Save className="w-3.5 h-3.5" /> {saved ? 'Saved' : 'Save'}</button>
                  </div>
                </div>
                <p className="text-sm text-slate-500 italic">{output.logline}</p>
              </div>

              {/* Characters */}
              <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700 flex gap-2 flex-wrap">
                {output.characters?.map((c) => (
                  <span key={c.name} title={c.description} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium cursor-help">
                    {c.name}
                  </span>
                ))}
              </div>

              {/* Scene tabs */}
              <div className="px-5 pt-4">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-4">
                  {output.scenes?.map((_, i) => (
                    <button key={i} onClick={() => setActiveScene(i)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeScene === i ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-dark-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-dark-600'}`}>
                      Scene {i + 1}
                    </button>
                  ))}
                </div>

                {output.scenes?.[activeScene] && (
                  <div className="pb-5 font-mono text-sm">
                    <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">
                      SCENE {output.scenes[activeScene].number}: {output.scenes[activeScene].location} - {output.scenes[activeScene].time}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 italic mb-4 leading-relaxed text-xs">
                      {output.scenes[activeScene].description}
                    </p>
                    <div className="text-slate-700 dark:text-slate-300 leading-loose whitespace-pre-line">
                      {output.scenes[activeScene].dialogue}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!output && !loading && !copyrightRefused && (
            <div className="card p-12 flex flex-col items-center justify-center gap-4 border-dashed">
              <Film className="w-10 h-10 text-slate-400" />
              <div className="text-center">
                <p className="font-semibold text-slate-600 dark:text-slate-400">Your script will appear here</p>
                <p className="text-sm text-slate-500 mt-1">Describe your original concept to begin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
