'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['All', 'Fashion', 'Deco', 'Best Pic', 'Others']

export default function VotePage() {
  const [pickrs, setPickrs] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [splitPos, setSplitPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [category, setCategory] = useState('All')
  const [voted, setVoted] = useState(false)
  const [votedChoice, setVotedChoice] = useState('')
  const [voteCount, setVoteCount] = useState(0)
  const [showHint, setShowHint] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchPickrs() }, [category])

  async function fetchPickrs() {
    let query = supabase.from('pickrs').select('*').order('created_at', { ascending: false })
    if (category !== 'All') query = query.eq('category', category.toLowerCase())
    const { data } = await query
    setPickrs(data || [])
    setCurrent(0)
    setSplitPos(50)
  }

  async function handleVote(choice: 'A' | 'B') {
    if (voted || pickrs.length === 0) return
    const pickr = pickrs[current]
    const field = choice === 'A' ? 'votes_a' : 'votes_b'
    await supabase.from('pickrs').update({ [field]: (pickr[field] || 0) + 1 }).eq('id', pickr.id)
    setVoted(true)
    setVotedChoice(choice)
    setVoteCount(v => v + 1)
    setShowHint(false)
    setTimeout(() => {
      setVoted(false)
      setVotedChoice('')
      setSplitPos(50)
      setCurrent(prev => (prev + 1) % pickrs.length)
    }, 1200)
  }

  function handlePointerMove(e: React.MouseEvent | React.TouchEvent) {
    if (!isDragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    setSplitPos(Math.max(10, Math.min(90, ((x - rect.left) / rect.width) * 100)))
  }

  const pickr = pickrs[current]
  const credits = Math.floor(voteCount / 10)
  const progress = (voteCount % 10) * 10

  return (
    <main style={{ minHeight: '100svh', backgroundColor: '#080808', color: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      <div style={{ padding: '10px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: '"Bebas Neue", "Arial Black", sans-serif', fontSize: 24, letterSpacing: 4, color: '#fff' }}>
          P/CKR<span style={{ color: '#C9A84C' }}>·</span>
        </div>
        <div style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid #C9A84C', borderRadius: 20, padding: '5px 14px', color: '#C9A84C', fontSize: 12, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
          <span>◈</span>
          <span>{credits} credit{credits !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div style={{ padding: '0 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid #1a1a1a', flexShrink: 0 }}>
        <div style={{ fontFamily: '"Bebas Neue", "Arial Black", sans-serif', fontSize: 15, letterSpacing: 5, color: '#C9A84C' }}>PICK ONE</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 5, height: 5, background: '#C9A84C', borderRadius: '50%' }} />
          <span style={{ fontSize: 9, letterSpacing: 3, color: '#fff', textTransform: 'uppercase' as const }}>{pickr?.category || 'fashion'}</span>
        </div>
      </div>

      <div style={{ padding: '8px 20px', display: 'flex', gap: 6, overflowX: 'auto' as const, flexShrink: 0 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{ flexShrink: 0, padding: '4px 12px', borderRadius: 20, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const, cursor: 'pointer', background: category === cat ? '#C9A84C' : 'transparent', color: category === cat ? '#080808' : '#fff', border: category === cat ? '0.5px solid #C9A84C' : '0.5px solid #444', fontWeight: category === cat ? 600 : 400 }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, minHeight: 0 }}>
        {pickr ? (
          <>
            <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: 'col-resize', userSelect: 'none' as const, minHeight: 0 }}
              onMouseMove={handlePointerMove} onMouseUp={() => setIsDragging(false)} onMouseLeave={() => setIsDragging(false)}
              onTouchMove={handlePointerMove} onTouchEnd={() => setIsDragging(false)}>

              <div style={{ position: 'absolute', inset: 0, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => !isDragging && handleVote('B')}>
                {pickr.image_b ? <img src={pickr.image_b} alt="B" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#2a2a2a', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' as const }}>photo B</span>}
              </div>

              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, overflow: 'hidden', width: `${splitPos}%` }} onClick={() => !isDragging && handleVote('A')}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', width: `${10000 / splitPos}%` }}>
                  {pickr.image_a ? <img src={pickr.image_a} alt="A" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#2a2a2a', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' as const }}>photo A</span>}
                </div>
              </div>

              <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(8,8,8,0.75)', border: '0.5px solid rgba(255,255,255,0.3)', borderRadius: 4, padding: '3px 9px', fontSize: 10, letterSpacing: 3, color: '#fff', textTransform: 'uppercase' as const, pointerEvents: 'none' }}>A</div>
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(8,8,8,0.75)', border: '0.5px solid rgba(255,255,255,0.3)', borderRadius: 4, padding: '3px 9px', fontSize: 10, letterSpacing: 3, color: '#fff', textTransform: 'uppercase' as const, pointerEvents: 'none' }}>B</div>

              <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${splitPos}%`, transform: 'translateX(-50%)', width: 2, background: '#C9A84C', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseDown={e => { setIsDragging(true); e.preventDefault() }} onTouchStart={() => setIsDragging(true)}>
                <div style={{ width: 26, height: 26, background: '#C9A84C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab', flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M5 3L2 7L5 11M9 3L12 7L9 11" stroke="#080808" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>

              {showHint && (
                <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 20, pointerEvents: 'none' }}>
                  <div style={{ background: 'rgba(8,8,8,0.85)', border: '0.5px solid rgba(201,168,76,0.5)', borderRadius: 24, padding: '8px 16px', display: 'flex', alig
