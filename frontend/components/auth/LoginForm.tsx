'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Sparkles, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Please fill in all fields')
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-dark-900 to-dark-950 items-center justify-center p-12">
        <div className="glow-orb w-96 h-96 bg-brand-600 opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="glow-orb w-64 h-64 bg-purple-600 opacity-15 top-1/4 left-1/4" />

        <div className="relative z-10 text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-brand-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Welcome back to{' '}
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              ForgeMuse AI
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Your creative journey continues here. Thousands of projects are waiting.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {['Song Creator', 'Story Generator', 'Script Writer', 'Lyrics Improver', 'AI Chat'].map((f) => (
              <span key={f} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">ForgeMuse AI</span>
          </div>

          <h1 className="text-3xl font-black text-white mb-2">Sign in</h1>
          <p className="text-slate-400 mb-8">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pr-12"
                  autoComplete="current-password"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="divider" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark-950 px-3 text-xs text-slate-600">
              or continue with
            </span>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            By signing in, you agree to our{' '}
            <a href="#" className="text-slate-500 hover:text-slate-400">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-slate-500 hover:text-slate-400">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
