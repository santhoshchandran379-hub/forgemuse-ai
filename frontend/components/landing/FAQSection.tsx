'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What AI model powers ForgeMuse AI?',
    a: 'ForgeMuse AI is powered by IBM Granite, a state-of-the-art large language model from IBM\'s AI research division. The backend is designed to be model-agnostic, meaning it can be connected to other compatible LLMs as well.',
  },
  {
    q: 'Can I generate content based on existing copyrighted works?',
    a: 'ForgeMuse AI is designed to generate original, creative content. If you request content directly based on copyrighted material (like an existing movie or song), the AI will politely decline and offer to create an original piece inspired by the same genre or themes instead.',
  },
  {
    q: 'How many generations do I get on the free plan?',
    a: 'The free plan includes 10 AI generations per month. Each generation counts as one use of a creative module — whether that\'s a song, story, script, or a lyrics improvement session.',
  },
  {
    q: 'Can I export my projects?',
    a: 'Free users can export projects as TXT files. Pro users get access to PDF and DOCX exports with professional formatting, making it easy to share or publish your work.',
  },
  {
    q: 'Is my creative work private?',
    a: 'Yes. Your projects are private and stored securely. We do not use your creative content to train our AI models or share it with third parties. Your ideas belong entirely to you.',
  },
  {
    q: 'Can I improve lyrics I\'ve already written?',
    a: 'Absolutely! The Lyrics Improver module is specifically designed for this. Paste in your existing lyrics and the AI will analyze them, then provide an improved version with detailed explanations of every change made.',
  },
  {
    q: 'How does the AI Chat Assistant work?',
    a: 'The AI Chat Assistant maintains context within each project, allowing you to have a natural conversation about your creative work. You can ask for revisions, brainstorm ideas, request different styles, or get explanations — all in a familiar chat interface.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes, absolutely. You can cancel your Pro subscription at any time from your account settings. You\'ll retain Pro access until the end of your current billing period.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative py-24 bg-dark-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Questions?{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-brand-400 bg-clip-text text-transparent">
              We have answers.
            </span>
          </h2>
          <p className="text-slate-400 text-lg">Everything you need to know about ForgeMuse AI.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                open === i
                  ? 'border-brand-500/30 bg-brand-500/5'
                  : 'border-white/5 bg-dark-800/40 hover:border-white/10'
              }`}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className={`font-semibold text-base ${open === i ? 'text-white' : 'text-slate-300'}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 ml-4 text-slate-500 transition-transform duration-300 ${
                    open === i ? 'rotate-180 text-brand-400' : ''
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <div className="h-px bg-white/5 mb-4" />
                  <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
