'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ResultsPage() {
  const [pickrs, setPickrs] = useState<any[]>([])

  useEffect(() => {
    supabase.from('pickrs').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setPickrs(data || []))
  }, [])

  const nav = [
    { label: 'Vote', icon: 'M4 6h16M4 12h16M4 18h7', path: '/vote' },
    { label: 'Submit', icon: 'M12 5v14M5 12h14', path: '/submit' },
    { label: 'Results', icon: 'M4 20V10m5 10V4m5 16v-7m5 7v-4', path: '/results' },
    { label: 'Profile', icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z', path: '/profile' },
  ]

  return (
    <main style={{ minHeight: '100svh', backgroundColor: '#080808', color: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>

      <div style={{ padding: '10px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: 'Bebas Neue, Arial Black, sans-serif', fontSize: 24, letterSpacing: 4, color: '#fff' }}>
          P/CKR<span style={{ color: '#C9A84C' }}>·</span>
        </div>
      </div>

      <div style={{ padding: '0 20px 16px', borderBottom: '0.5px solid #1a1a1a', flexShrink: 0 }}>
        <div style={{ fontFamily: 'Bebas Neue, Arial Black, sans-serif', fontSize: 15, letterSpacing: 5, color: '#C9A84C' }}>RESULTS</div>
      </div>

      <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
        {pickrs.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ fontSize: 11, color: '#444', letterSpacing: 3, textTransform: 'uppercase' }}>No results yet</div>
            <button onClick={() => window.location.href = '/vote'} style={{ background: '#C9A84C', color: '#080808', padding: '10px 24px', borderRadius: 20, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Start voting</button>
          </div>
        ) : (
          pickrs.map(pickr => {
            const total = (pickr.votes_a || 0) + (pickr.votes_b || 0)
            const pctA = total > 0 ? Math.round((pickr.votes_a / total) * 100) : 50
            const pctB = total > 0 ? Math.round((pickr.votes_b / total) * 100) : 50
            const winner = pickr.votes_a > pickr.votes_b ? 'A' : pickr.votes_b > pickr.votes_a ? 'B' : null

            return (
              <div key={pickr.id} style={{ background: '#111', border: '0.5px solid #1a1a1a', borderRadius: 12, overflow: 'hidden' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  {[
                    { label: 'A', img: pickr.image_a, pct: pctA, win: winner === 'A' },
                    { label: 'B', img: pickr.image_b, pct: pctB, win: winner === 'B' },
                  ].map(item => (
                    <div key={item.label} style={{ position: 'relative', height: 160, background: '#1a1a1a' }}>
                      {item.img && <img src={item.img} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
                      <div style={{ position: 'absolute', top: 8, left: item.label === 'A' ? 8 : 'auto', right: item.label === 'B' ? 8 : 'auto', background: 'rgba(8,8,8,0.75)', borderRadius: 4, padding: '2px 8px', fontSize: 10, letterSpacing: 2, color: item.win ? '#C9A84C' : '#fff', fontWeight: item.win ? 600 : 400 }}>{item.label}</div>
                      <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center' }}>
                        <span style={{ fontSize: item.win ? 22 : 18, fontWeight: 700, color: item.win ? '#C9A84C' : '#fff', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: 2 }}>{item.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 9, letterSpacing: 3, color: '#C9A84C', textTransform: 'uppercase' }}>{pickr.category}</span>
                    <span style={{ fontSize: 10, color: '#fff', letterSpacing: 1 }}>{total} vote{total !== 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ height: 3, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden', display: 'flex' }}>
                    <div style={{ height: '100%', background: '#C9A84C', width: pctA + '%', transition: 'width 0.5s ease', borderRadius: '2px 0 0 2px' }} />
                    <div style={{ height: '100%', background: '#2a2a2a', flex: 1, borderRadius: '0 2px 2px 0' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 9, color: winner === 'A' ? '#C9A84C' : '#888', letterSpacing: 1 }}>A · {pickr.votes_a || 0} votes</span>
                    <span style={{ fontSize: 9, color: winner === 'B' ? '#C9A84C' : '#888', letterSpacing: 1 }}>B · {pickr.votes_b || 0} votes</span>
                  </div>
                </div>

              </div>
            )
          })
        )}
      </div>

      <div style={{ borderTop: '0.5px solid #1a1a1a', display: 'flex', justifyContent: 'space-around', padding: '7px 0 4px', flexShrink: 0, background: '#080808' }}>
        {nav.map(item => (
          <button key={item.label} onClick={() => window.location.href = item.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: item.label === 'Results' ? '#C9A84C' : '#fff', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', padding: '3px 12px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

    </main>
  )
}
