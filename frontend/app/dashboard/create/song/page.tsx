'use client'

import { useState } from 'react'
import {
  Music, Sparkles, Loader2, Copy, Save, RefreshCw,
  ChevronDown, Volume2, Guitar
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/components/providers/AuthProvider'
import ReactMarkdown from 'react-markdown'

const genres = ['Pop', 'Rock', 'R&B', 'Hip-Hop', 'Country', 'Jazz', 'Blues', 'Indie', 'Electronic', 'Classical', 'Folk', 'Soul']
const moods = ['Happy', 'Sad', 'Angry', 'Romantic', 'Nostalgic', 'Hopeful', 'Dark', 'Energetic', 'Chill', 'Melancholic', 'Empowering']
const emotions = ['Love', 'Heartbreak', 'Joy', 'Grief', 'Longing', 'Freedom', 'Revenge', 'Redemption', 'Loneliness', 'Triumph', 'Hope']
const languages = ['English', 'Spanish', 'French', 'Portuguese', 'Italian', 'German', 'Arabic', 'Hindi', 'Korean', 'Japanese']
const structures = ['Verse-Chorus', 'Verse-Chorus-Bridge', 'AABA', 'Through-composed', 'Extended']

interface SongOutput {
  title: string
  verse1: string
  chorus: string
  verse2: string
  bridge?: string
  outro?: string
  chordProgression: string
  musicalKey: string
  tempo: string
  notes?: string
}

export default function SongCreatorPage() {
  const [form, setForm] = useState({
    theme: '',
    emotion: 'Love',
    genre: 'Pop',
    language: 'English',
    mood: 'Happy',
    structure: 'Verse-Chorus-Bridge',
    additionalNotes: '',
  })
  const [output, setOutput] = useState<SongOutput | null>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [projectTitle, setProjectTitle] = useState('')

  const handleGenerate = async () => {
    if (!form.theme.trim()) return toast.error('Please describe your song theme')
    setLoading(true)
    setOutput(null)
    setSaved(false)
    try {
      const res = await api.post('/ai/song', form)
      setOutput(res.data.result)
      setProjectTitle(res.data.result.title || 'Untitled Song')
      toast.success('Song generated successfully!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!output) return
    try {
      await api.post('/projects', {
        title: projectTitle,
        type: 'song',
        content: JSON.stringify(output),
        excerpt: output.verse1?.substring(0, 80),
      })
      setSaved(true)
      toast.success('Project saved!')
    } catch {
      toast.error('Failed to save project')
    }
  }

  const handleCopy = () => {
    if (!output) return
    const text = `${output.title}\n\nVERSE 1:\n${output.verse1}\n\nCHORUS:\n${output.chorus}\n\nVERSE 2:\n${output.verse2}${output.bridge ? `\n\nBRIDGE:\n${output.bridge}` : ''}${output.outro ? `\n\nOUTRO:\n${output.outro}` : ''}\n\nKey: ${output.musicalKey} | Tempo: ${output.tempo} | Chords: ${output.chordProgression}`
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
          <Music className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Song Creator</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Generate complete songs with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="space-y-5">
          <div className="card p-5 space-y-4">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Song Details</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Song Theme / Topic <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.theme}
                onChange={(e) => update('theme', e.target.value)}
                placeholder="E.g., A story about reuniting with a childhood love after 10 years apart..."
                className="textarea-field h-24"
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mood</label>
                <select value={form.mood} onChange={(e) => update('mood', e.target.value)} className="select-field text-sm">
                  {moods.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Emotion</label>
                <select value={form.emotion} onChange={(e) => update('emotion', e.target.value)} className="select-field text-sm">
                  {emotions.map((e) => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Language</label>
                <select value={form.language} onChange={(e) => update('language', e.target.value)} className="select-field text-sm">
                  {languages.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Song Structure</label>
              <select value={form.structure} onChange={(e) => update('structure', e.target.value)} className="select-field text-sm">
                {structures.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Additional Notes</label>
              <textarea
                value={form.additionalNotes}
                onChange={(e) => update('additionalNotes', e.target.value)}
                placeholder="Any specific requests, references, or style preferences..."
                className="textarea-field h-20 text-sm"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating your song...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate Song</>
              )}
            </button>
          </div>
        </div>

        {/* Output panel */}
        <div className="space-y-4">
          {loading && (
            <div className="card p-12 flex flex-col items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center">
                <Music className="w-7 h-7 text-brand-400 animate-pulse-slow" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-700 dark:text-slate-300">Composing your song...</p>
                <p className="text-sm text-slate-500 mt-1">IBM Granite AI is crafting your lyrics</p>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-full bg-brand-500 animate-pulse-slow"
                    style={{ height: `${8 + (i % 3) * 6}px`, animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {output && !loading && (
            <div className="card overflow-hidden">
              {/* Title bar */}
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-brand-500/5 to-purple-500/5">
                <div>
                  <input
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="text-xl font-black text-slate-900 dark:text-white bg-transparent border-none outline-none w-full"
                  />
                  <p className="text-xs text-slate-500 mt-0.5">Click title to rename</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleCopy} className="btn-ghost text-xs py-1.5 px-3">
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>
                  <button onClick={handleGenerate} className="btn-ghost text-xs py-1.5 px-3">
                    <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                  </button>
                  <button onClick={handleSave} disabled={saved} className="btn-primary text-xs py-1.5 px-3 disabled:opacity-60">
                    <Save className="w-3.5 h-3.5" /> {saved ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Musical info */}
              <div className="flex items-center gap-4 px-5 py-3 bg-slate-50 dark:bg-dark-800/40 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <Guitar className="w-3.5 h-3.5 text-brand-400" />
                  <span className="font-medium">Key:</span> {output.musicalKey}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-medium">Tempo:</span> {output.tempo}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-medium">Chords:</span> {output.chordProgression}
                </div>
              </div>

              {/* Lyrics */}
              <div className="p-5 space-y-5 font-mono text-sm">
                {[
                  { label: 'VERSE 1', content: output.verse1 },
                  { label: 'CHORUS', content: output.chorus },
                  { label: 'VERSE 2', content: output.verse2 },
                  output.bridge ? { label: 'BRIDGE', content: output.bridge } : null,
                  output.outro ? { label: 'OUTRO', content: output.outro } : null,
                ].filter(Boolean).map((section) => (
                  <div key={section!.label}>
                    <div className="text-[10px] font-bold text-brand-500 dark:text-brand-400 uppercase tracking-widest mb-2">
                      {section!.label}
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {section!.content}
                    </div>
                  </div>
                ))}
              </div>

              {output.notes && (
                <div className="mx-5 mb-5 p-4 rounded-xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-500 mb-1.5">AI NOTES</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{output.notes}</p>
                </div>
              )}
            </div>
          )}

          {!output && !loading && (
            <div className="card p-12 flex flex-col items-center justify-center gap-4 border-dashed">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-dark-800 flex items-center justify-center">
                <Music className="w-7 h-7 text-slate-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-600 dark:text-slate-400">Your song will appear here</p>
                <p className="text-sm text-slate-500 mt-1">Fill in the details and click Generate</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
