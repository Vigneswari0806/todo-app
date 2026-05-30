'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Todo = {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: string
  dueDate?: string
  category?: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', category: '' })
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') fetchTodos()
  }, [status])

  const fetchTodos = async () => {
    const res = await fetch('/api/todos')
    const data = await res.json()
    setTodos(data)
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
    setForm({ title: '', description: '', priority: 'medium', dueDate: '', category: '' })
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
      category: todo.category || '',
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

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const priorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-100 text-red-600'
    if (priority === 'medium') return 'bg-yellow-100 text-yellow-600'
    return 'bg-green-100 text-green-600'
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">📝 Todo App</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hi, {session?.user?.name}!</span>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm bg-red-50 text-red-500 px-4 py-2 rounded-lg hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Todos</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {showForm ? 'Cancel' : '+ Add Todo'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">New Todo</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                type="text"
                placeholder="Title *"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description (optional)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="grid grid-cols-3 gap-3">
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Category"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Add Todo
              </button>
            </form>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {editingTodo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Edit Todo</h3>
              <form onSubmit={handleUpdate} className="space-y-3">
                <input
                  type="text"
                  placeholder="Title *"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
                <div className="grid grid-cols-3 gap-3">
                  <select
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.dueDate}
                    onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTodo(null)}
                    className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">📭</p>
              <p>No todos yet. Add one above!</p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white rounded-2xl shadow-sm p-5 flex items-start gap-4 transition ${
                  todo.completed ? 'opacity-60' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo)}
                  className="mt-1 w-5 h-5 cursor-pointer accent-blue-600"
                />
                <div className="flex-1">
                  <p style={{ color: 'black', fontWeight: 'bold' }}>{todo.title}</p>
                  {todo.description && (
                    <p className="text-sm text-gray-500 mt-1">{todo.description}</p>
                  )}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColor(todo.priority)}`}>
                      {todo.priority}
                    </span>
                    {todo.category && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
                        {todo.category}
                      </span>
                    )}
                    {todo.dueDate && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        📅 {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(todo)}
                    className="text-blue-400 hover:text-blue-600 transition text-lg"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-400 hover:text-red-600 transition text-lg"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}