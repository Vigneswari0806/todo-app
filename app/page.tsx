'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function AnimatedDemo() {
  const [step, setStep] = useState(0)
  const [typing, setTyping] = useState('')
  const fullText = 'Design new landing page'
  const [tasks, setTasks] = useState([
    { title: 'Review pull requests', priority: 'medium', done: false, cat: '💼' },
    { title: 'Team standup at 10am', priority: 'high', done: false, cat: '💼' },
  ])
  const [showForm, setShowForm] = useState(false)
  const [newTask, setNewTask] = useState<{ title: string; priority: string; cat: string } | null>(null)

  useEffect(() => {
    const sequence = async () => {
      await sleep(1000)
      setStep(1)
      await sleep(800)
      setStep(2)
      setShowForm(true)
      await sleep(500)
      setStep(3)
      for (let i = 0; i <= fullText.length; i++) {
        setTyping(fullText.slice(0, i))
        await sleep(80)
      }
      await sleep(500)
      setStep(4)
      await sleep(800)
      setStep(5)
      await sleep(600)
      setShowForm(false)
      setNewTask({ title: fullText, priority: 'high', cat: '💼' })
      setStep(6)
      await sleep(1000)
      setStep(7)
      await sleep(600)
      setTasks(prev => prev.map((t, i) => i === 0 ? { ...t, done: true } : t))
      setStep(8)
      await sleep(2000)
      setStep(0)
      setTyping('')
      setShowForm(false)
      setNewTask(null)
      setTasks([
        { title: 'Review pull requests', priority: 'medium', done: false, cat: '💼' },
        { title: 'Team standup at 10am', priority: 'high', done: false, cat: '💼' },
      ])
      sequence()
    }
    sequence()
  }, [])

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-64 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-gray-800">Today ☀️</h3>
        <button className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all duration-200 flex items-center gap-1 ${step === 1 ? 'bg-violet-700 text-white scale-95 shadow-lg' : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white'}`}>
          + Add Task
          {step === 1 && <span className="animate-ping w-1.5 h-1.5 bg-white rounded-full"></span>}
        </button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-4 mb-3 border-2 border-violet-200">
          <div className="mb-2">
            <div className="text-xs text-gray-400 mb-1">Task title</div>
            <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 min-h-8 flex items-center">
              {typing}
              {step === 3 && <span className="w-0.5 h-4 bg-violet-500 ml-0.5 animate-pulse"></span>}
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            <div className={`text-xs px-2 py-1 rounded-lg border transition-all duration-200 ${step >= 4 ? 'bg-red-50 border-red-300 text-red-500 font-bold' : 'border-gray-200 text-gray-400'}`}>🔴 High</div>
            <div className="text-xs px-2 py-1 rounded-lg border border-gray-200 text-gray-400">📅 Today</div>
            <div className="text-xs px-2 py-1 rounded-lg border border-gray-200 text-gray-400">💼 Work</div>
          </div>
          <div className="flex gap-2">
            <button className={`flex-1 text-xs py-1.5 rounded-lg font-bold transition-all duration-200 ${step === 5 ? 'bg-violet-700 text-white scale-95' : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white'}`}>Add Task ✓</button>
            <button className="flex-1 text-xs py-1.5 rounded-lg bg-gray-100 text-gray-500 font-bold">Cancel</button>
          </div>
        </div>
      )}
      {newTask && (
        <div className="flex items-center gap-3 p-3 rounded-xl mb-2 bg-violet-50 border border-violet-200 shadow-sm">
          <div className="w-5 h-5 rounded-full border-2 border-violet-400 flex-shrink-0"></div>
          <span className="text-xs">{newTask.cat}</span>
          <p className="text-sm font-bold text-violet-700 flex-1">{newTask.title}</p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-500 font-medium">high</span>
          <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full">✨ New!</span>
        </div>
      )}
      {tasks.map((task, i) => (
        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition-all duration-500 ${task.done ? 'opacity-40 bg-white' : 'bg-white shadow-sm'}`}>
          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${task.done ? 'bg-green-500 border-green-500' : (step === 7 && i === 0) ? 'border-green-400 scale-125' : 'border-gray-200'}`}>
            {task.done && <span className="text-white text-xs">✓</span>}
          </div>
          <span className="text-xs">{task.cat}</span>
          <p className={`text-sm flex-1 transition-all duration-300 ${task.done ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}`}>{task.title}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.priority === 'high' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-600'}`}>{task.priority}</span>
        </div>
      ))}
      <div className="absolute bottom-4 right-4 flex gap-1">
        {[0,1,2,3,4,5,6,7,8].map(s => (
          <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${step === s ? 'bg-violet-500 w-4' : 'bg-gray-200 w-1.5'}`}></div>
        ))}
      </div>
      <div className="absolute bottom-4 left-4 right-20">
        {step === 0 && <div className="text-xs text-gray-400 bg-white px-2 py-1 rounded-lg shadow-sm">👆 Watch how easy it is...</div>}
        {step === 1 && <div className="text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded-lg shadow-sm font-medium">1️⃣ Click "+ Add Task"</div>}
        {step === 2 && <div className="text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded-lg shadow-sm font-medium">2️⃣ Form appears instantly</div>}
        {step === 3 && <div className="text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded-lg shadow-sm font-medium">3️⃣ Type your task title</div>}
        {step === 4 && <div className="text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded-lg shadow-sm font-medium">4️⃣ Set priority level</div>}
        {step === 5 && <div className="text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded-lg shadow-sm font-medium">5️⃣ Click "Add Task"!</div>}
        {step === 6 && <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg shadow-sm font-medium">✨ Task added!</div>}
        {step === 7 && <div className="text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded-lg shadow-sm font-medium">6️⃣ Click to complete task</div>}
        {step === 8 && <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg shadow-sm font-medium">🎉 Done! Amazing!</div>}
      </div>
    </div>
  )
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  useEffect(() => {
    if (status === 'authenticated') router.push('/dashboard')
    setTimeout(() => setVisible(true), 100)
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [status])

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-8 py-4 flex justify-between items-center transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <span className="text-white text-lg">✓</span>
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Taskflow</span>
        </div>
        <div className="flex items-center gap-6">
          {['Features', 'How It Works', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="relative text-sm text-gray-600 font-medium group">
              <span className="group-hover:text-violet-600 transition-colors duration-200">{item}</span>
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-violet-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </a>
          ))}
          <Link href="/login" className="relative text-sm text-gray-600 font-medium group">
            <span className="group-hover:text-violet-600 transition-colors duration-200">Login</span>
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-violet-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
          </Link>
          <Link href="/register"
            className="group relative text-sm bg-gradient-to-r from-violet-600 to-pink-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-violet-300 active:scale-95">
            <span className="relative z-10 flex items-center gap-1">
              Get Started Free
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen pt-20 pb-20 px-8 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50"></div>

        {/* Doodles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-16 text-4xl text-violet-300 animate-spin" style={{ animationDuration: '10s' }}>✦</div>
          <div className="absolute top-40 right-24 text-2xl text-pink-300 animate-bounce" style={{ animationDuration: '2.5s' }}>★</div>
          <div className="absolute bottom-40 left-24 text-3xl text-violet-300 animate-pulse">✦</div>
          <div className="absolute top-60 left-1/4 text-xl text-orange-300 animate-bounce" style={{ animationDuration: '3.5s' }}>◆</div>
          <div className="absolute top-32 right-1/4 w-16 h-16 rounded-full bg-gradient-to-br from-violet-200 to-pink-200 opacity-60 animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 rounded-full bg-gradient-to-br from-pink-200 to-orange-200 opacity-50 animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-1/3 left-8 w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-violet-200 opacity-60 animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 opacity-70 animate-bounce"></div>
          <svg className="absolute top-24 right-40 w-16 h-16 text-violet-300 opacity-50" viewBox="0 0 100 100" fill="none">
            <path d="M10 50 Q30 10 50 50 Q70 90 90 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <svg className="absolute bottom-40 left-40 w-20 h-20 text-pink-300 opacity-50" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="3" strokeDasharray="10 5"/>
          </svg>
          <svg className="absolute top-1/2 right-12 w-12 h-12 text-orange-300 opacity-50" viewBox="0 0 100 100" fill="none">
            <polygon points="50,10 90,80 10,80" stroke="currentColor" strokeWidth="3" fill="none"/>
          </svg>
          {[...Array(15)].map((_, i) => (
            <div key={i} className="absolute rounded-full animate-pulse"
              style={{
                width: `${6 + (i % 4) * 4}px`,
                height: `${6 + (i % 4) * 4}px`,
                left: `${8 + (i * 7) % 84}%`,
                top: `${10 + (i * 11) % 75}%`,
                backgroundColor: ['#c4b5fd','#f9a8d4','#fed7aa','#a5f3fc','#bbf7d0'][i % 5],
                opacity: 0.5,
                animationDuration: `${2 + i * 0.4}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Hero Content */}
        <div className={`max-w-4xl mx-auto text-center relative z-10 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-violet-100 text-violet-600 text-sm px-4 py-2 rounded-full font-medium mb-8 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            🚀 Trusted by 1M+ productive people worldwide
          </div>

          <h1 className="text-7xl font-black text-gray-900 mb-6 leading-tight">
            Get things done.{' '}
            <br />
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500">
                Feel amazing.
              </span>
              <svg className="absolute -bottom-2 left-0 right-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M0 10 Q75 0 150 6 Q225 12 300 4" stroke="url(#grad)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7c3aed"/>
                    <stop offset="100%" stopColor="#f97316"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            <span className="font-black text-gray-800">Taskflow</span> is the beautifully simple task manager that helps you capture ideas, organize your life, and actually get stuff done. ✨
          </p>

          <div className="flex gap-4 justify-center mb-8">
            <Link href="/register"
              className="group relative bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-violet-300 active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                Start for Free
                <span className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200">✨</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity duration-100"></div>
            </Link>
            <Link href="/login"
              className="group bg-white text-gray-700 px-10 py-4 rounded-2xl font-black text-lg border-2 border-gray-100 hover:border-violet-300 hover:text-violet-600 hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-300 flex items-center gap-2">
              Login
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
            {['✓ Free forever', '✓ No credit card', '✓ Setup in 30s'].map((item, i) => (
              <span key={i} className="flex items-center gap-1 hover:text-violet-500 transition-colors duration-200 cursor-default">
                <span className="text-green-400">{item.split(' ')[0]}</span>
                {item.split(' ').slice(1).join(' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Animated Demo */}
        <div className={`max-w-4xl mx-auto mt-16 w-full relative z-10 transition-all duration-1000 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-400 to-pink-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl transition-shadow duration-300">
              <div className="bg-gray-900 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer"></div>
                </div>
                <span className="text-gray-400 text-xs ml-2">✦ taskflow.app/dashboard</span>
              </div>
              <div className="flex">
                <div className="w-48 bg-gray-900 p-4">
                  <div className="text-white text-sm font-black mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                    Taskflow
                  </div>
                  {['📥 Inbox', '📅 Today', '✅ Done'].map(item => (
                    <div key={item} className="text-gray-400 text-xs py-2 px-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors mb-0.5">{item}</div>
                  ))}
                  <div className="text-gray-600 text-xs mt-4 mb-2 uppercase tracking-wider">Projects</div>
                  {[
                    { name: '💼 Work', color: 'bg-blue-500' },
                    { name: '🧘 Personal', color: 'bg-purple-500' },
                    { name: '💪 Health', color: 'bg-green-500' },
                  ].map(item => (
                    <div key={item.name} className="flex items-center gap-2 text-gray-400 text-xs py-2 px-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors mb-0.5">
                      <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                      {item.name}
                    </div>
                  ))}
                </div>
                <AnimatedDemo />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-8 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500"></div>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-500 font-bold mb-2">🚀 Super simple</p>
            <h2 className="text-4xl font-black text-gray-800 mb-4">How Taskflow works</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Get started in seconds. No learning curve, just pure productivity.</p>
          </div>
          <div className="grid grid-cols-3 gap-8 relative">
            <div className="absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-violet-200 to-pink-200 hidden md:block"></div>
            {[
              { step: '01', icon: '📝', title: 'Create account', desc: 'Sign up free in 30 seconds. Just your email, no credit card!', color: 'from-violet-500 to-purple-600', glow: 'shadow-violet-200' },
              { step: '02', icon: '➕', title: 'Add your tasks', desc: 'Quickly capture tasks with titles, priorities, dates and categories.', color: 'from-pink-500 to-rose-600', glow: 'shadow-pink-200' },
              { step: '03', icon: '🎯', title: 'Get things done!', desc: 'Check off tasks and watch your productivity soar every single day!', color: 'from-orange-500 to-yellow-500', glow: 'shadow-orange-200' },
            ].map((item, i) => (
              <div key={i} className="group text-center relative cursor-default">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-6 shadow-xl ${item.glow} group-hover:scale-110 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 relative z-10`}>
                  <span className="text-4xl">{item.icon}</span>
                </div>
                <div className="absolute top-0 right-4 w-8 h-8 bg-white border-2 border-violet-200 rounded-full flex items-center justify-center z-20 shadow-sm group-hover:border-violet-400 transition-colors duration-300">
                  <span className="text-xs font-black text-violet-600">{item.step}</span>
                </div>
                <h3 className="font-black text-gray-800 text-xl mb-3 group-hover:text-violet-600 transition-colors duration-300">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mt-16">
            {[
              { number: '10M+', label: 'Tasks completed', icon: '✅', color: 'from-violet-500 to-purple-500' },
              { number: '30s', label: 'Average setup time', icon: '⚡', color: 'from-yellow-400 to-orange-500' },
              { number: '100%', label: 'Free forever', icon: '🎁', color: 'from-green-400 to-teal-500' },
              { number: '24/7', label: 'Always available', icon: '🔒', color: 'from-pink-400 to-rose-500' },
            ].map((stat, i) => (
              <div key={i} className="group text-center p-6 bg-gray-50 rounded-2xl hover:shadow-xl hover:-translate-y-3 hover:bg-white transition-all duration-300 cursor-default border border-transparent hover:border-violet-100">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <p className="text-3xl font-black text-gray-800 mb-1 group-hover:text-violet-600 transition-colors duration-300">{stat.number}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-8 bg-gradient-to-b from-white to-violet-50 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-violet-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-pink-100 rounded-full blur-3xl opacity-60"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-violet-500 font-bold mb-2">Why Taskflow?</p>
            <h2 className="text-4xl font-black text-gray-800 mb-4">
              Everything you need.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">Nothing you don't.</span>
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Add tasks in seconds. No friction, just pure flow and focus.', gradient: 'from-yellow-400 to-orange-400', bg: 'hover:bg-orange-50', border: 'hover:border-orange-200' },
              { icon: '🎨', title: 'Beautiful Design', desc: 'A stunning interface that makes you want to use it every single day.', gradient: 'from-pink-400 to-rose-500', bg: 'hover:bg-pink-50', border: 'hover:border-pink-200' },
              { icon: '🏷️', title: 'Smart Categories', desc: 'Organize by work, personal, health, finance and so much more.', gradient: 'from-blue-400 to-indigo-500', bg: 'hover:bg-blue-50', border: 'hover:border-blue-200' },
              { icon: '📅', title: 'Due Dates', desc: 'Never miss a deadline. Track everything with beautiful ease.', gradient: 'from-green-400 to-teal-500', bg: 'hover:bg-green-50', border: 'hover:border-green-200' },
              { icon: '🎯', title: 'Priority System', desc: 'Focus on what matters most. High, medium, or low priority.', gradient: 'from-red-400 to-pink-500', bg: 'hover:bg-red-50', border: 'hover:border-red-200' },
              { icon: '🔒', title: 'Safe & Secure', desc: 'Your data is encrypted and private. Only you see your tasks.', gradient: 'from-violet-400 to-purple-500', bg: 'hover:bg-violet-50', border: 'hover:border-violet-200' },
            ].map((feature, i) => (
              <div
                key={i}
                className={`group p-6 bg-white rounded-2xl border border-gray-100 ${feature.border} ${feature.bg} hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-default relative overflow-hidden`}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg relative z-10`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="font-black text-gray-800 mb-2 text-lg group-hover:text-gray-900 relative z-10">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed relative z-10">{feature.desc}</p>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planning Section */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-5xl mx-auto flex items-center gap-16">
          <div className="flex-1">
            <div className="inline-block bg-violet-100 text-violet-600 text-sm px-3 py-1 rounded-full font-semibold mb-4 hover:bg-violet-200 transition-colors cursor-default">Plan with confidence ✨</div>
            <h2 className="text-4xl font-black text-gray-800 mb-6 leading-tight">
              Simplify your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">planning</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">Schedule due dates, organize by categories, track progress with ease. Taskflow keeps you on top of everything — effortlessly.</p>
            <div className="space-y-4 mb-8">
              {[
                { text: 'Set due dates and never miss deadlines', color: 'from-violet-500 to-purple-500' },
                { text: 'Organize tasks by category and priority', color: 'from-pink-500 to-rose-500' },
                { text: 'Track progress with beautiful stats', color: 'from-orange-500 to-yellow-500' },
              ].map((item, i) => (
                <div key={i} className="group flex items-center gap-3 cursor-default">
                  <div className={`w-7 h-7 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-md`}>
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-200">{item.text}</p>
                </div>
              ))}
            </div>
            <Link href="/register"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-violet-200 hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Start Planning Free
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-200 to-pink-200 rounded-3xl blur-xl opacity-40 animate-pulse"></div>
            <div className="relative bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                📅 Upcoming
                <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full">4 tasks</span>
              </h3>
              {[
                { title: 'Team meeting', date: 'Today', color: 'from-red-400 to-pink-400' },
                { title: 'Project deadline', date: 'Tomorrow', color: 'from-yellow-400 to-orange-400' },
                { title: 'Weekly review', date: 'In 3 days', color: 'from-blue-400 to-indigo-400' },
                { title: 'Monthly report', date: 'In 5 days', color: 'from-green-400 to-teal-400' },
              ].map((task, i) => (
                <div key={i} className="group flex items-center gap-3 p-3 rounded-xl mb-2 bg-gray-50 hover:bg-violet-50 hover:shadow-sm transition-all duration-200 cursor-default">
                  <div className={`w-1 h-10 rounded-full bg-gradient-to-b ${task.color} flex-shrink-0 group-hover:h-12 transition-all duration-200`}></div>
                  <p className="text-sm font-semibold text-gray-700 flex-1 group-hover:text-violet-700 transition-colors duration-200">{task.title}</p>
                  <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full shadow-sm group-hover:bg-violet-100 group-hover:text-violet-600 transition-all duration-200">{task.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-24 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-pink-600 to-orange-500"></div>
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div key={i}
              className="absolute rounded-full bg-white opacity-10 animate-pulse"
              style={{
                width: `${60 + i * 30}px`,
                height: `${60 + i * 30}px`,
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                filter: 'blur(20px)',
                animationDuration: `${2 + i * 0.5}s`,
              }}
            ></div>
          ))}
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="text-7xl mb-6 animate-bounce" style={{ animationDuration: '2s' }}>🚀</div>
          <h2 className="text-5xl font-black text-white mb-4">Ready to get started?</h2>
          <p className="text-violet-100 text-xl mb-10">Join thousands of productive people. Completely free!</p>
          <Link href="/register"
            className="group inline-flex items-center gap-2 bg-white text-violet-600 px-12 py-5 rounded-2xl hover:bg-violet-50 hover:scale-105 active:scale-95 transition-all duration-300 font-black text-xl shadow-2xl hover:shadow-white/20">
            Get Started for Free
            <span className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200">✨</span>
          </Link>
          <p className="text-violet-200 text-sm mt-6">No credit card required • Free forever • Setup in 30 seconds</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4 group cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="font-black text-white text-lg">Taskflow</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">Organize work and life beautifully.</p>
              <div className="flex gap-2">
                {['𝕏', 'f', '📸', '▶️'].map((icon, i) => (
                  <span key={i} className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-violet-600 hover:to-pink-600 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg">{icon}</span>
                ))}
              </div>
            </div>
            {[
              { title: 'Features', items: ['How It Works', 'For Teams', 'Pricing', 'Templates'] },
              { title: 'Resources', items: ['Help Center', 'Privacy Policy', 'Terms of Use', 'Contact Us'] },
              { title: 'Company', items: ['About Us', 'Careers', 'Blog', 'Press'] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-white font-bold mb-4">{col.title}</p>
                {col.items.map(item => (
                  <p key={item} className="text-gray-400 text-sm hover:text-violet-400 cursor-pointer mb-2.5 transition-colors duration-200 hover:translate-x-1 transform">{item}</p>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 flex justify-between items-center">
            <p className="text-gray-500 text-sm">© 2026 Taskflow. All rights reserved. Made with 💜</p>
            <div className="flex gap-4">
              {['Privacy', 'Terms', 'Cookies'].map(item => (
                <span key={item} className="text-gray-500 hover:text-violet-400 cursor-pointer transition-colors duration-200 text-sm">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}