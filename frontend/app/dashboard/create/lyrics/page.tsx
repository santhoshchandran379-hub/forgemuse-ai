'use client'

import { useState } from 'react'
import { Wand2, Sparkles, Loader2, Copy, Save, RefreshCw, ArrowRight, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/components/providers/AuthProvider'

interface LyricsImprovement {
  originalLyrics: string
  improvedLyrics: string
  improvements: {
    emotionalImpact: string
    flow: string
    wordChoice: string
    rhyming: string
    imagery: string
    readability: string
  }
  overallNotes: string
  round: number
}

const focusAreas = ['Emotional Impact', 'Flow & Rhythm', 'Word Choice', 'Rhyming', 'Imagery', 'Readability', 'All Areas']

export default function LyricsImproverPage() {
  const [inputLyrics, setInputLyrics] = useState('')
  const [focusArea, setFocusArea] = useState('All Areas')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [improvements, setImprovements] = useState<LyricsImprovement[]>([])
  const [loading, setLoading] = useState(false)
  const [activeRound, setActiveRound] = useState(0)
  const [saved, setSaved] = useState(false)
  const [projectTitle, setProjectTitle] = useState('Lyrics Improvement')
  const [showChat, setShowChat] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user'|'ai', content: string}>>([])

  const handleImprove = async () => {
    const lyricsToImprove = improvements.length > 0
      ? improvements[activeRound].improvedLyrics
      : inputLyrics
    if (!lyricsToImprove.trim()) return toast.error('Please enter lyrics to improve')

    setLoading(true)
    try {
      const res = await api.post('/ai/improve-lyrics', {
        lyrics: lyricsToImprove,
        focusArea,
        additionalNotes,
        round: improvements.length + 1,
      })
      const newImprovement = { ...res.data.result, round: improvements.length + 1 }
      setImprovements((prev) => [...prev, newImprovement])
      setActiveRound(improvements.length)
      toast.success(`Round ${improvements.length + 1} improvements ready!`)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Improvement failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (improvements.length === 0) return
    try {
      await api.post('/projects', {
        title: projectTitle,
        type: 'lyrics',
        content: JSON.stringify({ original: inputLyrics, improvements }),
        excerpt: inputLyrics.substring(0, 80),
      })
      setSaved(true)
      toast.success('Project saved!')
    } catch {
      toast.error('Failed to save project')
    }
  }

  const handleChat = async () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput
    setChatInput('')
    setChatMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    try {
      const res = await api.post('/ai/chat', {
        message: userMsg,
        context: improvements.length > 0 ? improvements[activeRound].improvedLyrics : inputLyrics,
        projectType: 'lyrics',
      })
      setChatMessages((prev) => [...prev, { role: 'ai', content: res.data.reply }])
    } catch {
      setChatMessages((prev) => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }])
    }
  }

  const current = improvements[activeRound]

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Lyrics Improver</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Enhance your lyrics with AI analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowChat(!showChat)} className={`btn-ghost text-sm ${showChat ? 'bg-purple-500/10 text-purple-400' : ''}`}>
            <MessageSquare className="w-4 h-4" /> AI Chat
          </button>
          {improvements.length > 0 && (
            <button onClick={handleSave} disabled={saved} className="btn-primary text-sm disabled:opacity-60">
              <Save className="w-4 h-4" /> {saved ? 'Saved' : 'Save Project'}
            </button>
          )}
        </div>
      </div>

      <div className={`grid grid-cols-1 ${showChat ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
        {/* Input panel */}
        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">
              {improvements.length === 0 ? 'Your Original Lyrics' : 'Continue Refining'}
            </h2>

            {improvements.length === 0 ? (
              <textarea
                value={inputLyrics}
                onChange={(e) => setInputLyrics(e.target.value)}
                placeholder="Paste your lyrics here...\n\nExample:\nI walk alone on empty streets\nThe echoes of your footsteps beat..."
                className="textarea-field h-48 font-mono text-sm"
              />
            ) : (
              <div className="bg-slate-50 dark:bg-dark-800/50 rounded-xl p-4 text-sm font-mono text-slate-600 dark:text-slate-400 max-h-36 overflow-y-auto whitespace-pre-line leading-relaxed">
                {current?.improvedLyrics || inputLyrics}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Focus Area</label>
              <select
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="select-field text-sm"
              >
                {focusAreas.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Style Notes</label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any style preferences or specific requests..."
                className="textarea-field h-16 text-sm"
              />
            </div>

            <button
              onClick={handleImprove}
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing lyrics...</>
              ) : improvements.length === 0 ? (
                <><Sparkles className="w-4 h-4" /> Improve Lyrics</>
              ) : (
                <><RefreshCw className="w-4 h-4" /> Round {improvements.length + 1} Refinement</>
              )}
            </button>

            {/* Round selectors */}
            {improvements.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {improvements.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveRound(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeRound === i
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-100 dark:bg-dark-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-dark-600'
                    }`}
                  >
                    Round {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Output panel */}
        <div className="space-y-4">
          {loading && (
            <div className="card p-10 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-purple-400 animate-pulse-slow" />
              </div>
              <p className="font-semibold text-slate-600 dark:text-slate-400 text-center">
                Analyzing and improving your lyrics...
              </p>
            </div>
          )}

          {current && !loading && (
            <div className="space-y-4">
              {/* Side by side comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div className="card p-4">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Original</div>
                  <div className="text-xs font-mono text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto">
                    {current.originalLyrics}
                  </div>
                </div>
                <div className="card p-4 border-purple-500/30 bg-purple-500/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Improved</div>
                    <button onClick={() => { navigator.clipboard.writeText(current.improvedLyrics); toast.success('Copied!') }}>
                      <Copy className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                  <div className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto">
                    {current.improvedLyrics}
                  </div>
                </div>
              </div>

              {/* Improvement breakdown */}
              <div className="card p-5">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Improvement Analysis</h3>
                <div className="space-y-3">
                 {Object.entries(current?.improvements ?? {}).map(([key, value]) => {
                    const labels: Record<string, string> = {
                      emotionalImpact: '❤️ Emotional Impact',
                      flow: '🎵 Flow & Rhythm',
                      wordChoice: '✍️ Word Choice',
                      rhyming: '🔤 Rhyming',
                      imagery: '🌅 Imagery',
                      readability: '📖 Readability',
                    }
                    return (
                      <div key={key}>
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                          {labels[key] || key}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{value as string}</p>
                      </div>
                    )
                  })}
                </div>

              {current?.overallNotes && (
  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200 dark:border-slate-700">
    <p className="text-xs font-semibold text-slate-500 mb-1">
      Overall Notes
    </p>
    <p className="text-xs text-slate-600 dark:text-slate-400">
      {current.overallNotes}
    </p>
  </div>
)}
              </div>
            </div>
          )}

          {improvements.length === 0 && !loading && (
            <div className="card p-12 flex flex-col items-center justify-center gap-4 border-dashed">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-dark-800 flex items-center justify-center">
                <Wand2 className="w-7 h-7 text-slate-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-600 dark:text-slate-400">Improved lyrics will appear here</p>
                <p className="text-sm text-slate-500 mt-1">Paste your lyrics and click Improve</p>
              </div>
            </div>
          )}
        </div>

        {/* Chat panel */}
        {showChat && (
          <div className="card flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" /> AI Chat Assistant
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <p className="text-xs text-slate-500 text-center mt-8">Ask the AI anything about your lyrics...</p>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className={msg.role === 'user' ? 'chat-bubble-user text-xs max-w-[85%]' : 'chat-bubble-ai text-xs max-w-[85%]'}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Ask about your lyrics..."
                className="input-field text-sm py-2 flex-1"
              />
              <button onClick={handleChat} className="btn-primary py-2 px-3">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
