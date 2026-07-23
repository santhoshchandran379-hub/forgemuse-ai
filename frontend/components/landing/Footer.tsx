'use client'

import Link from 'next/link'
import { Sparkles, Twitter, Github, Linkedin, Mail } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
  ],
  Creative: [
    { label: 'Song Creator', href: '/auth/register' },
    { label: 'Story Generator', href: '/auth/register' },
    { label: 'Script Writer', href: '/auth/register' },
    { label: 'Lyrics Improver', href: '/auth/register' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: 'mailto:hello@forgemuseai.com' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
}

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@forgemuseai.com', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-white/5">
      {/* CTA Banner */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="glow-orb w-[300px] h-[300px] bg-brand-600 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Ready to start creating?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of creators using ForgeMuse AI to bring their ideas to life. Free to start, always.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="btn-primary text-base py-3.5 px-8">
              Start Creating for Free
            </Link>
            <Link href="/auth/login" className="btn-secondary bg-white/5 border-white/10 text-white hover:bg-white/10 text-base py-3.5 px-8">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">ForgeMuse AI</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              From Imagination to Creation. Your AI-powered creative studio.
            </p>
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-dark-800 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-dark-700 transition-all duration-200"
                >
                  <s.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} ForgeMuse AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow" />
            <span className="text-slate-600 text-sm">All systems operational</span>
          </div>
          <p className="text-slate-700 text-xs">
            Powered by IBM Granite AI
          </p>
        </div>
      </div>
    </footer>
  )
}
