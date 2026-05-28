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
    <main style={{ minHeight: '100svh', backgroundColor: '#080808', color: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      <div style={{ padding: '10px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: '"Bebas Neue", "Arial Black", sans-seri
