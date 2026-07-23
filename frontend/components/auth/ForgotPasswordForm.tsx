'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Loader2, Mail, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email address')
    setLoading(true)
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email })
      setSent(true)
      toast.success('Reset link sent!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">ForgeMuse AI</span>
        </Link>

        <div className="card p-8 bg-dark-900 border-white/10">
          {!sent ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-5">
                <Mail className="w-6 h-6 text-brand-400" />
              </div>

              <h1 className="text-2xl font-black text-white mb-2">Forgot your password?</h1>
              <p className="text-slate-400 text-sm mb-6">
                No worries! Enter your email and we'll send you a secure reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
              <p className="text-slate-400 text-sm mb-6">
                We've sent a password reset link to <strong className="text-slate-300">{email}</strong>. Check your inbox and click the link to reset your password.
              </p>
              <p className="text-xs text-slate-600">
                Didn't receive it?{' '}
                <button onClick={() => setSent(false)} className="text-brand-400 hover:text-brand-300">
                  Try again
                </button>
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-6">
          <Link href="/auth/login" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
