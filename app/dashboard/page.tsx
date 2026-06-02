'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Todo = {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: string
  dueDate?: string
  category?: string
}

const categoryConfig: Record<string, { bg: string; icon: string }> = {
  work:      { bg: 'bg-blue-500',   icon: '💼' },
  personal:  { bg: 'bg-purple-500', icon: '🧘' },
  shopping:  { bg: 'bg-pink-500',   icon: '🛍️' },
  health:    { bg: 'bg-green-500',  icon: '💪' },
  finance:   { bg: 'bg-yellow-500', icon: '💰' },
  education: { bg: 'bg-orange-500', icon: '📚' },
  other:     { bg: 'bg-gray-500',   icon: '📌' },
}

const cardGradients = [
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-green-400 to-green-600',
  'from-yellow-400 to-orange-500',
  'from-red-400 to-red-600',
  'from-indigo-400 to-indigo-600',
  'from-teal-400 to-teal-600',
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', category: 'work' })
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', category: 'work' })
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') fetchTodos()
  }, [status])

 const fetchTodos = async () => {
    const res = await fetch('/api/todos')
    const data = await res.json()
    setTodos(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const newTodo = await res.json()
    setTodos([newTodo, ...todos])
    setForm({ title: '', description: '', priority: 'medium', dueDate: '', category: 'work' })
    setShowForm(false)
  }

  const toggleComplete = async (todo: Todo) => {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    })
    const updated = await res.json()
    setTodos(todos.map((t) => (t.id === todo.id ? updated : t)))
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setEditForm({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
      category: todo.category || 'work',
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTodo) return
    const res = await fetch(`/api/todos/${editingTodo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    const updated = await res.json()
    setTodos(todos.map((t) => (t.id === editingTodo.id ? updated : t)))
    setEditingTodo(null)
  }

  const deleteTodo = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    setTodos(todos.filter((t) => t.id !== id))
  }

  const categories = ['all', 'work', 'personal', 'shopping', 'health', 'finance', 'education', 'other']

  const filteredTodos = todos.filter((t) => {
    const statusMatch = filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed
    const categoryMatch = categoryFilter === 'all' ? true : t.category === categoryFilter
    const searchMatch = searchQuery === '' ? true : t.title.toLowerCase().includes(searchQuery.toLowerCase())
    return statusMatch && categoryMatch && searchMatch
  })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-800 h-screen flex flex-col fixed left-0 top-0 shadow-xl overflow-y-auto">
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-2xl">☑️</span>
            <span className="text-xl font-bold text-white">My Tasks</span>
          </div>
        </div>

        <div className="p-3">
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg text-sm transition"
          >
            <span className="text-red-400 text-lg">+</span> Add Task
          </button>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <nav className="p-3 flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">Views</p>
          {[
            { key: 'all', label: '📥 Inbox' },
            { key: 'active', label: '📅 Today' },
            { key: 'completed', label: '✅ Completed' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-0.5 text-sm transition ${
                filter === f.key ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 mt-5">Categories</p>
          {categories.map((cat) => {
            const config = categoryConfig[cat]
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg mb-0.5 text-sm transition flex items-center gap-2 ${
                  categoryFilter === cat ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${cat === 'all' ? 'bg-gray-400' : config?.bg}`}></span>
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-gray-700">
          <Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition">
            <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{session?.user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{session?.user?.name}</p>
              <p className="text-xs text-gray-400 truncate">Settings</p>
            </div>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full mt-1 text-sm text-red-400 hover:bg-gray-700 px-3 py-2 rounded-lg transition text-left"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-60 p-8 h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              👋 Welcome, {session?.user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-500 text-white px-5 py-2.5 rounded-xl hover:bg-red-600 transition font-medium flex items-center gap-2 shadow"
          >
            <span>+</span> Add Task
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-400">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{todos.length}</p>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-400">Active</p>
            <p className="text-3xl font-bold text-red-500 mt-1">{todos.filter(t => !t.completed).length}</p>
            <p className="text-xs text-gray-400 mt-1">To do</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-400">Completed</p>
            <p className="text-3xl font-bold text-green-500 mt-1">{todos.filter(t => t.completed).length}</p>
            <p className="text-xs text-gray-400 mt-1">Done 🎉</p>
          </div>
        </div>

        {/* Todo List */}
        {filteredTodos.length === 0 ? (
          <div className="text-center py-20 text-gray-300">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-xl font-medium text-gray-400">No tasks here!</p>
            <p className="text-sm mt-2 text-gray-300">Click "+ Add Task" to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTodos.map((todo, index) => {
              const config = categoryConfig[todo.category || 'other']
              const gradient = cardGradients[index % cardGradients.length]
              return (
                <div
                  key={todo.id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition ${todo.completed ? 'opacity-60' : ''}`}
                >
                  <button
                    onClick={() => toggleComplete(todo)}
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition ${
                      todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-red-400'
                    }`}
                  >
                    {todo.completed && <span className="text-white text-xs flex items-center justify-center">✓</span>}
                  </button>

                  <div className={`w-1 h-10 rounded-full bg-gradient-to-b ${gradient} flex-shrink-0`}></div>

                  <div className="flex-1 min-w-0">
                    <p style={{ color: todo.completed ? '#9ca3af' : '#1a1a1a', fontWeight: '600', fontSize: '14px', textDecoration: todo.completed ? 'line-through' : 'none' }}>
                      {todo.title}
                    </p>
                    {todo.description && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{todo.description}</p>
                    )}
                    <div className="flex gap-2 mt-1">
                      {todo.category && (
                        <span className="text-xs text-gray-400">{config?.icon} {todo.category}</span>
                      )}
                      {todo.dueDate && (
                        <span className="text-xs text-gray-400">📅 {new Date(todo.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                    todo.priority === 'high' ? 'bg-red-50 text-red-500' :
                    todo.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                    {todo.priority}
                  </span>

                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => handleEdit(todo)} className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">✏️</button>
                    <button onClick={() => deleteTodo(todo.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">🗑️</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Add Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">➕ New Task</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <input type="text" placeholder="Task title *" required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <input type="text" placeholder="Description (optional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-3 gap-2">
                <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <input type="date" className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.filter(c => c !== 'all').map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-semibold hover:bg-red-600 transition text-sm">Add Task</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">✏️ Edit Task</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input type="text" placeholder="Task title *" required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
              <input type="text" placeholder="Description (optional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
              <div className="grid grid-cols-3 gap-2">
                <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <input type="date" className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={editForm.dueDate} onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })} />
                <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                  {categories.filter(c => c !== 'all').map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-semibold hover:bg-red-600 transition text-sm">Save Changes</button>
                <button type="button" onClick={() => setEditingTodo(null)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}