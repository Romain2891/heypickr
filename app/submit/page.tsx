'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['Fashion', 'Deco', 'Best Pic', 'Others']

export default function SubmitPage() {
  const [category, setCategory] = useState('Fashion')
  const [photoA, setPhotoA] = useState<File | null>(null)
  const [photoB, setPhotoB] = useState<File | null>(null)
  const [previewA, setPreviewA] = useState<string | null>(null)
  const [previewB, setPreviewB] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleFile(file: File, slot: 'A' | 'B') {
    const url = URL.createObjectURL(file)
    if (slot === 'A') { setPhotoA(file); setPreviewA(url) }
    else { setPhotoB(file); setPreviewB(url) }
  }

  async function uploadPhoto(file: File, name: string) {
    const { error } = await supabase.storage.from('pickr').upload(name, file, { upsert: true })
    if (error) throw error
    const { data: urlData } = supabase.storage.from('pickr').getPublicUrl(name)
    return urlData.publicUrl
  }

  async function handleSubmit() {
    if (!photoA || !photoB) return
    setLoading(true)
    try {
      const timestamp = Date.now()
      const urlA = await uploadPhoto(photoA, `${timestamp}_a.jpg`)
      const urlB = await uploadPhoto(photoB, `${timestamp}_b.jpg`)
      const { error } = await supabase.from('pickrs').insert({
        category: category.toLowerCase(),
        image_a: urlA,
        image_b: urlB,
        user_id: null
      })
      if (error) throw error
      setSuccess(true)
    } catch (e) {
      console.error('Error:', e)
    }
    setLoading(false)
  }

  if (success) return (
    <main style={{ minHeight: '100svh', backgroundColor: '#080808', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, fontFamily: 'system-ui', padding: 24 }}>
      <div style={{ width: 64, height: 64, background: '#C9A84C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#080808" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 28, letterSpacing: 4, color: '#fff' }}>Submitted!</div>
      <div style={{ fontSize: 13, color: '#aaa', letterSpacing: 1, textAlign: 'center' }}>The community will vote on your pickr.</div>
      <a href="/vote" onClick={() => window.location.href = '/vote'} style={{ background: '#C9A84C', color: '#080808', padding: '10px 28px', borderRadius: 20, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none' }}>See votes →</a>
    </main>
  )

  return (
    <main style={{ minHeight: '100svh', backgroundColor: '#080808', color: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      <div style={{ padding: '10px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: '"Bebas Neue", "Arial Black", sans-serif', fontSize: 24, letterSpacing: 4, color: '#fff' }}>
          P/CKR<span style={{ color: '#C9A84C' }}>·</span>
        </div>
        <a href="/vote" style={{ color: '#aaa', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none' }}>← back</a>
      </div>

      <div style={{ padding: '0 20px 16px', borderBottom: '0.5px solid #1a1a1a', flexShrink: 0 }}>
        <div style={{ fontFamily: '"Bebas Neue", "Arial Black", sans-serif', fontSize: 15, letterSpacing: 5, color: '#C9A84C' }}>NEW PICKR</div>
      </div>

      <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {(['A', 'B'] as const).map(label => (
            <label key={label} style={{ aspectRatio: '1', background: '#111', border: '0.5px solid #2a2a2a', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0], label)} />
              {(label === 'A' ? previewA : previewB) ? (
                <img src={label === 'A' ? previewA! : previewB!} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                  <span style={{ fontSize: 10, letterSpacing: 3, color: '#444', textTransform: 'uppercase' }}>photo {label}</span>
                </>
              )}
            </label>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: '#C9A84C', textTransform: 'uppercase', marginBottom: 12 }}>Category</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', background: category === cat ? '#C9A84C' : 'transparent', color: category === cat ? '#080808' : '#fff', border: category === cat ? '0.5px solid #C9A84C' : '0.5px solid #444', fontWeight: category === cat ? 600 : 400 }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: '#111', border: '0.5px solid #1a1a1a', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#aaa', letterSpacing: 1 }}>Cost</span>
          <span style={{ fontSize: 11, color: '#C9A84C', letterSpacing: 1, fontWeight: 600 }}>1 credit</span>
        </div>

        <button onClick={handleSubmit} disabled={loading || !photoA || !photoB} style={{ background: loading || !photoA || !photoB ? '#1a1a1a' : '#C9A84C', color: loading || !photoA || !photoB ? '#444' : '#080808', border: 'none', borderRadius: 20, padding: '14px', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, cursor: loading || !photoA || !photoB ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
          {loading ? 'Uploading...' : !photoA || !photoB ? 'Add 2 photos' : 'Submit →'}
        </button>

      </div>

      <div style={{ borderTop: '0.5px solid #1a1a1a', display: 'flex', justifyContent: 'space-around', padding: '7px 0 4px', flexShrink: 0, background: '#080808' }}>
        {[
          { href: '/vote', label: 'Vote', active: false, icon: 'M4 6h16M4 12h16M4 18h7' },
          { href: '/submit', label: 'Submit', active: true, icon: 'M12 5v14M5 12h14' },
          { href: '/results', label: 'Results', active: false, icon: 'M4 20V10m5 10V4m5 16v-7m5 7v-4' },
          { href: '/profile', label: 'Profile', active: false, icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z' },
        ].map(item => (
          <a key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: item.active ? '#C9A84C' : '#fff', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', padding: '3px 12px', textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
            <span>{item.label}</span>
          </a>
        ))}
      </div>

    </main>
  )
}
