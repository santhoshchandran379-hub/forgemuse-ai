'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, Sparkles, Plus, Trash2, Edit3, Loader2, Bot, User } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/components/providers/AuthProvider'
import { useAuth } from '@/components/providers/AuthProvider'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

const SUGGESTED_PROMPTS = [
  "Help me brainstorm song lyrics about missing home",
  "Give me 5 unique story plot twists",
  "How can I improve the flow of my chorus?",
  "Write a hook for a hip-hop verse about ambition",
  "Suggest character backstories for a thriller",
  "How do I make my writing more cinematic?",
]

export default function AIChatPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [projectContext, setProjectContext] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConv = conversations.find(c => c.id === activeConvId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv?.messages])

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
    }
    setConversations(prev => [newConv, ...prev])
    setActiveConvId(newConv.id)
  }

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input
    if (!text.trim()) return

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() }

    if (!activeConvId) {
      const newConv: Conversation = {
        id: Date.now().toString(),
        title: text.substring(0, 40) + (text.length > 40 ? '...' : ''),
        messages: [userMessage],
        createdAt: new Date(),
      }
      setConversations(prev => [newConv, ...prev])
      setActiveConvId(newConv.id)
      setInput('')
      setLoading(true)
      try {
        const res = await api.post('/ai/chat', {
          message: text,
          context: projectContext,
          history: [],
        })
        const aiMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: res.data.reply, timestamp: new Date() }
        setConversations(prev => prev.map(c => c.id === newConv.id ? { ...c, messages: [...c.messages, aiMessage] } : c))
      } catch {
        toast.error('Failed to get response')
      } finally {
        setLoading(false)
      }
      return
    }

    setConversations(prev => prev.map(c => c.id === activeConvId ? {
      ...c,
      messages: [...c.messages, userMessage],
      title: c.messages.length === 0 ? text.substring(0, 40) : c.title,
    } : c))
    setInput('')
    setLoading(true)

    try {
      const convHistory = activeConv?.messages.map(m => ({ role: m.role, content: m.content })) || []
      const res = await api.post('/ai/chat', {
        message: text,
        context: projectContext,
        history: convHistory,
      })
      const aiMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: res.data.reply, timestamp: new Date() }
      setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, messages: [...c.messages, aiMessage] } : c))
    } catch {
      toast.error('Failed to get response')
    } finally {
      setLoading(false)
    }
  }

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id))
    if (activeConvId === id) setActiveConvId(null)
  }

  return (
    <div className="h-[calc(100vh-56px)] flex overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white dark:bg-dark-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <button onClick={createNewConversation} className="btn-primary w-full text-sm py-2.5">
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 && (
            <p className="text-xs text-slate-500 text-center mt-6 px-4">Start a new conversation with your AI creative assistant</p>
          )}
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-1 ${
                activeConvId === conv.id
                  ? 'bg-brand-500/10 border border-brand-500/20'
                  : 'hover:bg-slate-100 dark:hover:bg-dark-800'
              }`}
            >
              <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${activeConvId === conv.id ? 'text-brand-500' : 'text-slate-400'}`} />
              <span className="text-xs text-slate-700 dark:text-slate-300 truncate flex-1">{conv.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id) }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Context box */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Project Context</p>
          <textarea
            value={projectContext}
            onChange={(e) => setProjectContext(e.target.value)}
            placeholder="Paste lyrics, story, or context here for AI to reference..."
            className="w-full text-xs bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-700 dark:text-slate-300 resize-none h-16 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="flex-shrink-0 h-14 bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-5 gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">ForgeMuse AI Assistant</div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
              <span className="text-xs text-slate-500">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
          {!activeConv || activeConv.messages.length === 0 ? (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-brand">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">How can I help you create today?</h2>
                <p className="text-slate-500 text-sm">I'm your AI creative collaborator. Ask me anything about writing, music, storytelling, or ideas.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-left p-4 rounded-2xl bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500/40 hover:bg-brand-500/5 transition-all group"
                  >
                    <p className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {activeConv.messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-brand-500 to-purple-600'
                      : 'bg-gradient-to-br from-slate-700 to-slate-800'
                  }`}>
                    {msg.role === 'user'
                      ? <User className="w-4 h-4 text-white" />
                      : <Sparkles className="w-4 h-4 text-brand-400" />
                    }
                  </div>
                  <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-[10px] mt-1 opacity-60">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-brand-400 animate-pulse-slow" />
                  </div>
                  <div className="chat-bubble-ai flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" />
                    <span className="text-xs text-slate-500">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 p-4 bg-white dark:bg-dark-900 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl mx-auto flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder="Message ForgeMuse AI... (Shift+Enter for new line)"
                className="w-full px-4 py-3 pr-12 bg-slate-100 dark:bg-dark-800 border border-transparent dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:bg-white dark:focus:bg-dark-700 resize-none max-h-32 transition-all"
                rows={1}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-11 h-11 flex-shrink-0 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all self-end"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-center text-[11px] text-slate-400 mt-2">
            ForgeMuse AI can make mistakes. Review important outputs carefully.
          </p>
        </div>
      </div>
    </div>
  )
}
