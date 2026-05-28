'use client'
import { useState, useEffect, useRef } from 'react'
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
  const containerRef = useRef(null)

  useEffect(() => { fetchPickrs() }, [category])

  async function fetchPickrs() {
    let query = supabase.from('pickrs').select('*').order('created_at', { ascending: false })
    if (category !== 'Tout') query = query.eq('category', category.toLowerCase())
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
    setTimeout(() => { setVoted(false); setVotedChoice(''); setSplitPos(50); setCurrent(prev => (prev + 1) % pickrs.length) }, 1200)
  }

  function handlePointerMove(e) {
    if (!isDragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.touches ? e.touches[0].clientX : e.clientX
    setSplitPos(Math.max(10, Math.min(90, ((x - rect.left) / rect.width) * 100)))
  }

  const pickr = pickrs[current]
  const credits = Math.floor(voteCount / 10)
  const progress = (voteCount % 10) * 10

  return (
    <main style={{ minHeight: '100svh', backgroundColor: '#080808', color: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui' }}>
      <div style={{ padding: '10px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 24, letterSpacing: 4, color: '#fff' }}>P/CKR<span style={{ color: '#C9A84C' }}>·</span></div>
        <div style={{ background: '#111', border: '0.5px solid rgba(201,168,76,0.3)', borderRadius: 20, padding: '3px 12px', color: '#C9A84C', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>◈ {credits} crédit{credits !== 1 ? 's' : ''}</div>
      </div>
      <div style={{ padding: '0 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid #1a1a1a', flexShrink: 0 }}>
        <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 15, letterSpacing: 5, color: '#555' }}>PICK ONE</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 5, height: 5, background: '#C9A84C', borderRadius: '50%' }} /><span style={{ fontSize: 9, letterSpacing: 3, color: '#C9A84C', textTransform: 'uppercase' }}>{pickr?.category || 'mode'}</span></div>
      </div>
      <div style={{ padding: '8px 20px', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0 }}>
        {CATEGORIES.map(cat => (<button key={cat} onClick={() => setCategory(cat)} style={{ flexShrink: 0, padding: '4px 12px', borderRadius: 20, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', background: category === cat ? '#C9A84C' : 'transparent', color: category === cat ? '#080808' : '#444', border: category === cat ? '0.5px solid #C9A84C' : '0.5px solid #2a2a2a' }}>{cat}</button>))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {pickr ? (
          <>
            <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: 'col-resize', userSelect: 'none', minHeight: 0 }} onMouseMove={handlePointerMove} onMouseUp={() => setIsDragging(false)} onMouseLeave={() => setIsDragging(false)} onTouchMove={handlePointerMove} onTouchEnd={() => setIsDragging(false)}>
              <div style={{ position: 'absolute', inset: 0, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => !isDragging && handleVote('B')}>
                {pickr.image_b ? <img src={pickr.image_b} alt="B" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#2a2a2a', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' }}>photo B</span>}
              </div>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, overflow: 'hidden', width: splitPos + '%' }} onClick={() => !isDragging && handleVote('A')}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', width: (10000 / splitPos) + '%' }}>
                  {pickr.image_a ? <img src={pickr.image_a} alt="A" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#2a2a2a', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' }}>photo A</span>}
                </div>
              </div>
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(8,8,8,0.75)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '3px 9px', fontSize: 10, letterSpacing: 3, color: '#fff', textTransform: 'uppercase', pointerEvents: 'none' }}>A</div>
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(8,8,8,0.75)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '3px 9px', fontSize: 10, letterSpacing: 3, color: '#fff', textTransform: 'uppercase', pointerEvents: 'none' }}>B</div>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: splitPos + '%', transform: 'translateX(-50%)', width: 2, background: '#C9A84C', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseDown={e => { setIsDragging(true); e.preventDefault() }} onTouchStart={() => setIsDragging(true)}>
                <div style={{ width: 26, height: 26, background: '#C9A84C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab' }}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M5 3L2 7L5 11M9 3L12 7L9 11" stroke="#080808" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', background: 'rgba(8,8,8,0.8)', border: '0.5px solid rgba(201,168,76,0.4)', borderRadius: 20, padding: '4px 13px', fontSize: 9, letterSpacing: 2, color: '#C9A84C', textTransform: 'uppercase', whiteSpace: 'nowrap', pointerEvents: 'none' }}>glisse · tape pour voter</div>
              {voted && (<div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,8,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}><div style={{ width: 56, height: 56, background: '#C9A84C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#080808" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div><div style={{ color: '#fff', fontWeight: 600, fontSize: 14, letterSpacing: 3, textTransform: 'uppercase' }}>Voté {votedChoice}</div><div style={{ color: '#C9A84C', fontSize: 10, marginTop: 4 }}>+0.1 crédit</div></div>)}
            </div>
            <div style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <span style={{ fontSize: 10, color: '#333', minWidth: 28 }}>{voteCount % 10}/10</span>
              <div style={{ flex: 1, height: 2, background: '#1a1a1a', borderRadius: 1, overflow: 'hidden' }}><div style={{ height: '100%', background: '#C9A84C', borderRadius: 1, width: progress + '%', transition: 'width 0.3s ease' }} /></div>
              <span style={{ fontSize: 10, color: '#333' }}>1 crédit</span>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
            <div style={{ fontSize: 11, color: '#2a2a2a', letterSpacing: 3, textTransform: 'uppercase' }}>Aucun pickr disponible</div>
            <a href="/submit" style={{ background: '#C9A84C', color: '#080808', padding: '10px 24px', borderRadius: 20, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none' }}>Soumettre le premier →</a>
          </div>
        )}
      </div>
      <div style={{ borderTop: '0.5px solid #1a1a1a', display: 'flex', justifyContent: 'space-around', padding: '7px 0 4px', flexShrink: 0, background: '#080808' }}>
        {[{href:'/vote',label:'Vote',active:true,icon:'M4 6h16M4 12h16M4 18h7'},{href:'/submit',label:'Créer',active:false,icon:'M12 5v14M5 12h14'},{href:'/results',label:'Résultats',active:false,icon:'M4 20V10m5 10V4m5 16v-7m5 7v-4'},{href:'/profile',label:'Profil',active:false,icon:'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z'}].map(item => (
          <a key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: item.active ? '#C9A84C' : '#333', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', padding: '3px 12px', textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </main>
  )
}
