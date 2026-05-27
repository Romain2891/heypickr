'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['Tout', 'Mode', 'Coiffure', 'Make-up', 'Voyage', 'Profil']

export default function VotePage() {
  const [pickrs, setPickrs] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [splitPos, setSplitPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [category, setCategory] = useState('Tout')
  const [voted, setVoted] = useState(false)
  const [votedChoice, setVotedChoice] = useState('')
  const [voteCount, setVoteCount] = useState(0)

  useEffect(() => {
    fetchPickrs()
  }, [category])

  async function fetchPickrs() {
    let query = supabase.from('pickrs').select('*').order('created_at', { ascending: false })
    if (category !== 'Tout') query = query.eq('category', category.toLowerCase())
    const { data } = await query
    setPickrs(data || [])
    setCurrent(0)
  }

  async function handleVote(choice: 'A' | 'B') {
    if (voted || pickrs.length === 0) return
    const pickr = pickrs[current]
    const field = choice === 'A' ? 'votes_a' : 'votes_b'
    await supabase.from('pickrs').update({ [field]: (pickr[field] || 0) + 1 }).eq('id', pickr.id)
    setVoted(true)
    setVotedChoice(choice)
    const newCount = voteCount + 1
    setVoteCount(newCount)
    setTimeout(() => {
      setVoted(false)
      setVotedChoice('')
      setSplitPos(50)
      setCurrent(prev => (prev + 1) % pickrs.length)
    }, 1200)
  }

  function handleDrag(e: React.MouseEvent | React.TouchEvent) {
    if (!isDragging) return
    const el = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    const pct = Math.max(3, Math.min(97, ((x - el.left) / el.width) * 100))
    setSplitPos(pct)
  }

  const pickr = pickrs[current]

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">pickr</h1>
        <div className="bg-white/10 rounded-full px-3 py-1 text-sm">
          🪙 {Math.floor(voteCount / 10)} crédits
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition ${
              category === cat ? 'bg-white text-black' : 'border border-white/20 text-gray-400'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="flex-1 p-4 flex flex-col gap-4">
        {pickr ? (
          <>
            <p className="text-center text-gray-400 text-sm">{pickr.question}</p>

            {/* Compare area */}
            <div className="relative rounded-2xl overflow-hidden h-80 cursor-col-resize select-none"
              onMouseMove={handleDrag} onMouseUp={() => setIsDragging(false)}
              onTouchMove={handleDrag} onTouchEnd={() => setIsDragging(false)}>

              {/* Photo B (right) */}
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #9FE1CB, #1D9E75)' }}
                onClick={() => !isDragging && handleVote('B')}>
                <div className="text-center">
                  <div className="text-6xl mb-2">👗</div>
                  <div className="text-white font-bold text-xl">B</div>
                </div>
              </div>

              {/* Photo A (left, clipped) */}
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${splitPos}%` }}>
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ width: `${100 / splitPos * 100}%`, background: 'linear-gradient(135deg, #AFA9EC, #7F77DD)' }}
                  onClick={() => !isDragging && handleVote('A')}>
                  <div className="text-center">
                    <div className="text-6xl mb-2">👗</div>
                    <div className="text-white font-bold text-xl">A</div>
                  </div>
                </div>
              </div>

              {/* Handle */}
              <div className="absolute top-0 bottom-0 w-8 -translate-x-1/2 flex items-center justify-center z-10"
                style={{ left: `${splitPos}%` }}
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}>
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/80 -translate-x-1/2" />
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg z-10 text-xs">⟺</div>
              </div>

              {/* Badges */}
              <div className="absolute bottom-3 left-3 bg-purple-500/80 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
                👆 Vote A
              </div>
              <div className="absolute bottom-3 right-3 bg-green-500/80 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
                Vote B 👆
              </div>

              {/* Voted overlay */}
              {voted && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20"
                  style={{ background: votedChoice === 'A' ? 'rgba(127,119,221,0.6)' : 'rgba(29,158,117,0.6)' }}>
                  <div className="text-5xl">✓</div>
                  <div className="text-white font-bold text-xl mt-2">Voté {votedChoice} !</div>
                  <div className="text-white/80 text-sm">+0.1 crédit</div>
                </div>
              )}
            </div>

            {/* Progress */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{voteCount % 10}/10</span>
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${(voteCount % 10) * 10}%` }} />
              </div>
              <span className="text-xs text-gray-500">1 crédit</span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <p className="text-gray-500">Aucun vote disponible pour l'instant</p>
            <a href="/submit" className="bg-white text-black px-6 py-3 rounded-full font-semibold">
              Soumettre le premier →
            </a>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="border-t border-white/10 flex justify-around py-3">
        <a href="/vote" className="flex flex-col items-center gap-1 text-white">
          <span className="text-xl">🗳️</span>
          <span className="text-xs">Voter</span>
        </a>
        <a href="/submit" className="flex flex-col items-center gap-1 text-gray-500">
          <span className="text-xl">➕</span>
          <span className="text-xs">Soumettre</span>
        </a>
        <a href="/results" className="flex flex-col items-center gap-1 text-gray-500">
          <span className="text-xl">📊</span>
          <span className="text-xs">Résultats</span>
        </a>
      </div>
    </main>
  )
}