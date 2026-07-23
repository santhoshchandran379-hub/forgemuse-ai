'use client'

import { useState } from 'react'
import { BookOpen, Sparkles, Loader2, Copy, Save, RefreshCw, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/components/providers/AuthProvider'

const genres = ['Fantasy', 'Science Fiction', 'Romance', 'Thriller', 'Mystery', 'Horror', 'Adventure', 'Literary Fiction', 'Historical Fiction', 'Fairy Tale', 'Dystopian', 'Comedy']
const tones = ['Hopeful', 'Dark', 'Humorous', 'Suspenseful', 'Romantic', 'Melancholic', 'Empowering', 'Mysterious', 'Whimsical', 'Dramatic']
const lengths = ['Short Story (1-2 chapters)', 'Medium Story (3-5 chapters)', 'Novel Excerpt (5-8 chapters)']

interface StoryOutput {
  title: string
  synopsis: string
  characters: Array<{ name: string; role: string; description: string }>
  chapters: Array<{ title: string; content: string }>
  ending: string
  alternativeEnding?: string
}

export default function StoryGeneratorPage() {
  const [form, setForm] = useState({
    prompt: '',
    genre: 'Fantasy',
    tone: 'Hopeful',
    length: 'Short Story (1-2 chapters)',
    protagonist: '',
    setting: '',
    additionalNotes: '',
  })
  const [output, setOutput] = useState<StoryOutput | null>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [projectTitle, setProjectTitle] = useState('')
  const [activeChapter, setActiveChapter] = useState(0)
  const [showAltEnding, setShowAltEnding] = useState(false)

  const handleGenerate = async () => {
    if (!form.prompt.trim()) return toast.error('Please describe your story idea')
    setLoading(true)
    setOutput(null)
    setSaved(false)
    try {
      const res = await api.post('/ai/story', form)
      setOutput(res.data.result)
      setProjectTitle(res.data.result.title || 'Untitled Story')
      setActiveChapter(0)
      toast.success('Story generated!')
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
        type: 'story',
        content: JSON.stringify(output),
        excerpt: output.synopsis?.substring(0, 100),
      })
      setSaved(true)
      toast.success('Story saved!')
    } catch {
      toast.error('Failed to save')
    }
  }

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Story Generator</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create original stories with rich characters and plot</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Story Idea / Prompt <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.prompt}
                onChange={(e) => update('prompt', e.target.value)}
                placeholder="E.g., A young wizard discovers she can travel through books, but each time she does, she takes something real from the story world..."
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tone</label>
                <select value={form.tone} onChange={(e) => update('tone', e.target.value)} className="select-field text-sm">
                  {tones.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Story Length</label>
              <select value={form.length} onChange={(e) => update('length', e.target.value)} className="select-field text-sm">
                {lengths.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Main Character</label>
              <input
                value={form.protagonist}
                onChange={(e) => update('protagonist', e.target.value)}
                placeholder="E.g., 25-year-old librarian named Elena..."
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Setting</label>
              <input
                value={form.setting}
                onChange={(e) => update('setting', e.target.value)}
                placeholder="E.g., Victorian London, distant future, magical forest..."
                className="input-field text-sm"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Crafting your story...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate Story</>
              )}
            </button>
          </div>
        </div>

        {/* Output panel */}
        <div className="lg:col-span-3 space-y-4">
          {loading && (
            <div className="card p-12 flex flex-col items-center justify-center gap-4">
              <BookOpen className="w-10 h-10 text-emerald-400 animate-pulse-slow" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">Writing your story...</p>
            </div>
          )}

          {output && !loading && (
            <div className="card overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
                <div className="flex items-center justify-between mb-1">
                  <input
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="text-xl font-black text-slate-900 dark:text-white bg-transparent outline-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => { navigator.clipboard.writeText(output.chapters.map(c => `${c.title}\n\n${c.content}`).join('\n\n---\n\n')); toast.success('Copied!') }} className="btn-ghost text-xs py-1.5 px-3">
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                    <button onClick={handleGenerate} className="btn-ghost text-xs py-1.5 px-3">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={handleSave} disabled={saved} className="btn-primary text-xs py-1.5 px-3 disabled:opacity-60">
                      <Save className="w-3.5 h-3.5" /> {saved ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">{output.synopsis}</p>
              </div>

              {/* Characters */}
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Characters</h3>
                <div className="flex flex-wrap gap-2">
                  {output.characters?.map((char) => (
                    <div key={char.name} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-700 border border-slate-200 dark:border-slate-700 group cursor-pointer" title={char.description}>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{char.name}</div>
                      <div className="text-[10px] text-slate-500">{char.role}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chapter tabs */}
              <div className="px-5 pt-4">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-4">
                  {output.chapters?.map((ch, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveChapter(i)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeChapter === i
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-dark-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-dark-600'
                      }`}
                    >
                      Ch {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setActiveChapter(output.chapters?.length || 0)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                     activeChapter === (output.chapters?.length || 0)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 dark:bg-dark-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-dark-600'
                    }`}
                  >
                    Ending
                  </button>
                </div>

                {/* Chapter content */}
                <div className="pb-5">
                  {activeChapter < (output.chapters?.length || 0) ? (
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-3">
                        {output.chapters?.[activeChapter]?.title}
                      </h3>
                      <div className="text-sm text-slate-700 dark:text-slate-300 leading-loose ai-content whitespace-pre-line">
                       {output.chapters?.[activeChapter]?.content}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-3">Ending</h3>
                      <div className="text-sm text-slate-700 dark:text-slate-300 leading-loose whitespace-pre-line mb-4">
                        {output.ending}
                      </div>
                      {output.alternativeEnding && (
                        <div>
                          <button
                            onClick={() => setShowAltEnding(!showAltEnding)}
                            className="flex items-center gap-2 text-sm text-brand-500 hover:text-brand-400 font-medium mb-2"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform ${showAltEnding ? 'rotate-180' : ''}`} />
                            Alternative Ending
                          </button>
                          {showAltEnding && (
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-800/60 border border-dashed border-slate-300 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-400 leading-loose whitespace-pre-line">
                              {output.alternativeEnding}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!output && !loading && (
            <div className="card p-12 flex flex-col items-center justify-center gap-4 border-dashed">
              <BookOpen className="w-10 h-10 text-slate-400" />
              <div className="text-center">
                <p className="font-semibold text-slate-600 dark:text-slate-400">Your story will appear here</p>
                <p className="text-sm text-slate-500 mt-1">Describe your story idea to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
