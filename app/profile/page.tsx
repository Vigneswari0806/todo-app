'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [form, setForm] = useState({ name: '', currentPassword: '', newPassword: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('english')

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
    } else {
      setMessage('Profile updated successfully!')
      setForm({ name: '', currentPassword: '', newPassword: '' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-700 to-blue-900 min-h-screen flex flex-col fixed left-0 top-0 shadow-xl">
        <div className="p-6 border-b border-blue-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow">
              <span className="text-blue-700 font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-white">My Tasks</span>
          </div>
        </div>

        <nav className="p-4 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-blue-100 hover:bg-blue-600 transition text-sm font-medium mb-1">
            ← Back to Dashboard
          </Link>

          <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3 mt-6">Settings</p>

          {[
            { key: 'profile', label: '👤 My Profile' },
            { key: 'security', label: '🔒 Security' },
            { key: 'preferences', label: '⚙️ Preferences' },
            { key: 'account', label: '🗑️ Account' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full text-left px-4 py-2.5 rounded-xl mb-1 text-sm font-medium transition ${
                activeTab === tab.key
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-600">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow">
              <span className="text-white text-sm font-bold">
                {session?.user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{session?.user?.name}</p>
              <p className="text-xs text-blue-300 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full mt-2 text-sm text-red-300 hover:bg-blue-600 px-4 py-2 rounded-xl transition text-left"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-2xl mx-auto">

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">👤 My Profile</h1>
              <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-4xl text-white font-bold">
                      {session?.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{session?.user?.name}</h2>
                    <p className="text-gray-500">{session?.user?.email}</p>
                    <span className="inline-block mt-2 bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-medium">
                      ✅ Active Account
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-semibold text-gray-800 mt-1">{session?.user?.name}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-semibold text-gray-800 mt-1">{session?.user?.email}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Account Status</p>
                    <p className="font-semibold text-green-600 mt-1">Active</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-semibold text-gray-800 mt-1">2026</p>
                  </div>
                </div>
              </div>

              {/* Update Name */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Update Name</h3>
                {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">{message}</div>}
                {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                <form onSubmit={handleUpdate} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter new name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Current password (required)"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={form.currentPassword}
                    onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 text-sm"
                  >
                    {loading ? 'Updating...' : 'Update Name'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">🔒 Security</h1>
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Change Password</h3>
                {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">{message}</div>}
                {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                <form onSubmit={handleUpdate} className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={form.currentPassword}
                    onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={form.newPassword}
                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 text-sm"
                  >
                    {loading ? 'Updating...' : 'Change Password'}
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Security Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔐</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Password Protection</p>
                        <p className="text-xs text-gray-500">Your account is password protected</p>
                      </div>
                    </div>
                    <span className="text-green-600 text-sm font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📧</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Email Verified</p>
                        <p className="text-xs text-gray-500">{session?.user?.email}</p>
                      </div>
                    </div>
                    <span className="text-blue-600 text-sm font-medium">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">⚙️ Preferences</h1>
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔔</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Notifications</p>
                      <p className="text-xs text-gray-500">Receive task reminders</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌙</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Dark Mode</p>
                      <p className="text-xs text-gray-500">Switch to dark theme</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌐</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Language</p>
                      <p className="text-xs text-gray-500">Choose your language</p>
                    </div>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="english">English</option>
                    <option value="tamil">Tamil</option>
                    <option value="hindi">Hindi</option>
                    <option value="spanish">Spanish</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">🗑️ Account</h1>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">⚠️</span>
                  <div>
                    <h3 className="text-lg font-bold text-red-600">Danger Zone</h3>
                    <p className="text-sm text-gray-500">These actions cannot be undone</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-red-100 bg-red-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Sign out of all devices</p>
                      <p className="text-xs text-gray-500">Log out from all active sessions</p>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}