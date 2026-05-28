'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ResultsPage() {
  const [pickrs, setPickrs] = useState<any[]>([])

  useEffect(() => {
    supabase.from('pickrs').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setPickrs(data || []))
  }, [])

  return (
    <main style={{ minHeight: '100svh', backgroundColor: '#080808', color: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      <div style={{ padding: '10px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: '"Bebas Neue", "Arial Black", sans-serif', fontSize: 24, letterSpacing: 4, color: '#fff' }}>
          P/CKR<span style={{ color: '#C9A84C' }}>·</span>
        </div>
      </div>

      <div style={{ padding: '0 20px 16px', borderBottom: '0.5px solid #1a1a1a', flexShrink: 0 }}>
        <div style={{ fontFamily: '"Bebas Neue", "Arial Black", sans-serif', fontSize: 15, letterSpacing: 5, color: '#555' }}>RÉSULTATS</div>
      </div>

      <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
        {pickrs.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ fontSize: 11, color: '#2a2a2a', letterSpacing: 3, textTransform: 'uppercase' }}>Aucun résultat</div>
            <a href="/vote" style={{ background: '#C9A84C', color: '#080808', padding: '10px 24px', borderRadius: 20, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none' }}>Commencer à voter →</a>
          </div>
        ) : (
          pickrs.map(pickr => {
            const total = (pickr.votes_a || 0) + (pickr.votes_b || 0)
            const pctA = total > 0 ? Math.round((pickr.votes_a / total) * 100) : 50
            const pctB = total > 0 ? Math.round((pickr.votes_b / total) * 100) : 50
            const winner = pickr.votes_a > pickr.votes_b ? 'A' : pickr.votes_b > pickr.votes_a ? 'B' : null

            return (
              <div key={pickr.id} style={{ background: '#111', border: '0.5px solid #1a1a1a', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 9, letterSpacing: 3, color: '#C9A84C', textTransform: 'uppercase' }}>{pickr.category}</span>
                  <span style={{ fontSize: 10, color: '#333', letterSpacing: 1 }}>{total} votes</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[{ label: 'A', pct: pctA, win: winner === 'A' }, { label: 'B', pct: pctB, win: winner === 'B' }].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 10, letterSpacing: 2, color: item.win ? '#C9A84C' : '#444', minWidth: 16, fontWeight: item.win ? 600 : 400 }}>{item.label}</span>
                      <div style={{ flex: 1, height: 3, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: item.win ? '#C9A84C' : '#333', borderRadius: 2, width: `${item.pct}%`, transition: 'width 0.5s ease' }} />
                      </div>
                      <span style={{ fontSize: 10, color: item.win ? '#C9A84C' : '#333', minWidth: 32, textAlign: 'right' }}>{item.pct}%</span>
                      {item.win && <span style={{ fontSize: 10, color: '#C9A84C' }}>✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>

      <div style={{ borderTop: '0.5px solid #1a1a1a', display: 'flex', justifyContent: 'space-around', padding: '7px 0 4px', flexShrink: 0, background: '#080808' }}>
        {[
          { href: '/vote', label: 'Vote', active: false, icon: 'M4 6h16M4 12h16M4 18h7' },
          { href: '/submit', label: 'Créer', active: false, icon: 'M12 5v14M5 12h14' },
          { href: '/results', label: 'Résultats', active: true, icon: 'M4 20V10m5 10V4m5 16v-7m5 7v-4' },
          { href: '/profile', label: 'Profil', active: false, icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z' },
        ].map(item => (
          <a key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: item.active ? '#C9A84C' : '#333', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', padding: '3px 12px', textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
            <span>{item.label}</span>
          </a>
        ))}
      </div>

    </main>
  )
}
