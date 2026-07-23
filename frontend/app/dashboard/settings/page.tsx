'use client'

import { useState } from 'react'
import { User, Settings, Shield, Bell, Palette, Globe, CreditCard, Trash2, Save, Loader2, Camera, Sun, Moon, Monitor } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import toast from 'react-hot-toast'
import api from '@/components/providers/AuthProvider'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' })
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' })
  const [notifications, setNotifications] = useState({ email: true, product: true, weekly: false })
  const [language, setLanguage] = useState('English')

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      const res = await api.put('/auth/profile', { name: profile.name, email: profile.email })
      updateUser(res.data.user)
      toast.success('Profile updated!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update profile')
    } finally { setLoading(false) }
  }

  const handleChangePassword = async () => {
    if (!password.current || !password.new || !password.confirm) return toast.error('Please fill in all fields')
    if (password.new !== password.confirm) return toast.error('New passwords do not match')
    if (password.new.length < 8) return toast.error('Password must be at least 8 characters')
    setLoading(true)
    try {
      await api.put('/auth/password', { currentPassword: password.current, newPassword: password.new })
      setPassword({ current: '', new: '', confirm: '' })
      toast.success('Password changed!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to change password')
    } finally { setLoading(false) }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you absolutely sure? This action is irreversible and will delete all your projects.')) return
    try {
      await api.delete('/auth/account')
      logout()
      toast.success('Account deleted')
    } catch {
      toast.error('Failed to delete account')
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-up">
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tab navigation */}
        <div className="md:w-52 flex-shrink-0">
          <nav className="space-y-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`sidebar-item w-full ${activeTab === tab.id ? 'active' : ''}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="flex-1 space-y-5">
          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="card p-6 space-y-5">
              <h2 className="font-bold text-slate-900 dark:text-white">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-white border-2 border-white dark:border-dark-800">
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                  <span className={`badge text-xs ${user?.plan === 'pro' ? 'badge-purple' : 'badge-blue'}`}>
                    {user?.plan === 'pro' ? '✦ Pro Plan' : 'Free Plan'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="select-field">
                  {['English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Arabic', 'Hindi'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              <button onClick={handleSaveProfile} disabled={loading} className="btn-primary disabled:opacity-60">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="card p-6 space-y-6">
              <h2 className="font-bold text-slate-900 dark:text-white">Appearance</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', icon: Sun, label: 'Light' },
                    { value: 'dark', icon: Moon, label: 'Dark' },
                    { value: 'system', icon: Monitor, label: 'System' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTheme(opt.value as any)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        theme === opt.value
                          ? 'border-brand-500 bg-brand-500/5'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <opt.icon className={`w-5 h-5 ${theme === opt.value ? 'text-brand-500' : 'text-slate-400'}`} />
                      <span className={`text-sm font-medium ${theme === opt.value ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500'}`}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-bold text-slate-900 dark:text-white">Notification Preferences</h2>
              {[
                { key: 'email', label: 'Email notifications', desc: 'Receive important account updates via email' },
                { key: 'product', label: 'Product updates', desc: 'New features, improvements, and releases' },
                { key: 'weekly', label: 'Weekly digest', desc: 'A weekly summary of your creative activity' },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{n.label}</p>
                    <p className="text-xs text-slate-500">{n.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications[n.key as keyof typeof notifications] ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                      notifications[n.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="card p-6 space-y-4">
                <h2 className="font-bold text-slate-900 dark:text-white">Change Password</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Current Password</label>
                  <input type="password" value={password.current} onChange={(e) => setPassword({ ...password, current: e.target.value })} className="input-field" placeholder="Enter current password" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                  <input type="password" value={password.new} onChange={(e) => setPassword({ ...password, new: e.target.value })} className="input-field" placeholder="Enter new password" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
                  <input type="password" value={password.confirm} onChange={(e) => setPassword({ ...password, confirm: e.target.value })} className="input-field" placeholder="Confirm new password" />
                </div>
                <button onClick={handleChangePassword} disabled={loading} className="btn-primary disabled:opacity-60">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Change Password'}
                </button>
              </div>

              <div className="card p-6 border-red-500/20 bg-red-500/5">
                <h2 className="font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h2>
                <p className="text-sm text-slate-500 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button onClick={handleDeleteAccount} className="btn-danger text-sm">
                  <Trash2 className="w-4 h-4" /> Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Billing */}
          {activeTab === 'billing' && (
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">Billing & Plan</h2>
              <div className={`rounded-xl p-5 mb-5 ${user?.plan === 'pro' ? 'bg-gradient-to-br from-brand-500/10 to-purple-500/10 border border-brand-500/30' : 'bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{user?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}</h3>
                    <p className="text-sm text-slate-500">{user?.plan === 'pro' ? 'Unlimited AI generations' : `${user?.aiUsage.used || 0}/${user?.aiUsage.limit || 10} generations used`}</p>
                  </div>
                  <span className={`badge text-sm py-1.5 px-3 ${user?.plan === 'pro' ? 'badge-purple' : 'badge-blue'}`}>
                    {user?.plan === 'pro' ? '✦ Pro' : 'Free'}
                  </span>
                </div>
                {user?.plan === 'free' && (
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full" style={{ width: `${Math.min(((user?.aiUsage.used || 0) / (user?.aiUsage.limit || 10)) * 100, 100)}%` }} />
                  </div>
                )}
              </div>
              {user?.plan === 'free' && (
                <div className="text-center py-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Upgrade to Pro</h3>
                  <p className="text-slate-500 mb-4">Unlimited generations, PDF/DOCX export, and priority AI access</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mb-4">$19<span className="text-base font-normal text-slate-500">/month</span></p>
                  <button className="btn-primary text-base py-3 px-8">Upgrade to Pro</button>
                  <p className="text-xs text-slate-500 mt-3">7-day free trial · Cancel anytime</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
