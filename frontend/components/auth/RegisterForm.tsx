'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Sparkles, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const passwordRules = [
  { label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'One number', test: (v: string) => /\d/.test(v) },
]

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) return toast.error('Please fill in all fields')
    if (password.length < 8) return toast.error('Password must be at least 8 characters')
    setLoading(true)
    try {
      await register(name, email, password)
      toast.success('Account created! Welcome to ForgeMuse AI 🎉')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-dark-900 to-dark-950 items-center justify-center p-12">
        <div className="glow-orb w-96 h-96 bg-purple-600 opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="glow-orb w-64 h-64 bg-brand-600 opacity-15 bottom-1/4 right-1/4" />

        <div className="relative z-10 text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-brand-600 flex items-center justify-center mx-auto mb-8 shadow-[0_8px_40px_rgba(168,85,247,0.5)]">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Start your creative{' '}
            <span className="bg-gradient-to-r from-purple-400 to-brand-400 bg-clip-text text-transparent">
              journey today
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Join thousands of creators. Generate songs, stories, scripts, and more — completely free.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { title: '10 free generations', sub: 'Every month, no credit card' },
              { title: 'All 6 modules', sub: 'Songs, stories, scripts & more' },
              { title: 'AI chat assistant', sub: 'Refine your work instantly' },
              { title: 'Export projects', sub: 'TXT, PDF and DOCX formats' },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-sm font-semibold text-white mb-0.5">{item.title}</div>
                <div className="text-xs text-slate-500">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">ForgeMuse AI</span>
          </div>

          <h1 className="text-3xl font-black text-white mb-2">Create your account</h1>
          <p className="text-slate-400 mb-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="input-field"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="input-field pr-12"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(password)
                    return (
                      <div key={rule.label} className={`flex items-center gap-2 text-xs transition-colors ${passed ? 'text-emerald-400' : 'text-slate-600'}`}>
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${passed ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
                          {passed && <Check className="w-2 h-2" />}
                        </div>
                        {rule.label}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
              ) : (
                <>Create Free Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-slate-500 hover:text-slate-400">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-slate-500 hover:text-slate-400">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
