'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ResultsPage() {
  const [pickrs, setPickrs] = useState<any[]>([])

  useEffect(() => {
    supabase.from('pickrs')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setPickrs(data || []))
  }, [])

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <div className="p-4 flex items-center gap-3">
        <a href="/" className="text-gray-400">←</a>
        <h1 className="text-2xl font-bold">Résultats</h1>
      </div>

      <div className="p-4 space-y-4">
        {pickrs.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-4xl mb-4">📊</p>
            <p>Aucun résultat pour l'instant</p>
            <a href="/vote" className="mt-4 inline-block text-white underline">
              Commencer à voter →
            </a>
          </div>
        ) : (
          pickrs.map(pickr => {
            const total = (pickr.votes_a || 0) + (pickr.votes_b || 0)
            const pctA = total > 0 ? Math.round((pickr.votes_a / total) * 100) : 50
            const pctB = total > 0 ? Math.round((pickr.votes_b / total) * 100) : 50
            const winner = pickr.votes_a > pickr.votes_b ? 'A' : pickr.votes_b > pickr.votes_a ? 'B' : null

            return (
              <div key={pickr.id} className="bg-white/5 rounded-2xl p-4 space-y-3 border border-white/10">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-white font-medium flex-1 pr-2">{pickr.question}</p>
                  <span className="text-xs text-gray-500 bg-white/10 px-2 py-1 rounded-full capitalize">
                    {pickr.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-4 text-purple-400 font-bold">A</span>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full transition-all"
                        style={{ width: `${pctA}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">{pctA}%</span>
                    {winner === 'A' && <span className="text-xs">🏆</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-4 text-green-400 font-bold">B</span>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${pctB}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">{pctB}%</span>
                    {winner === 'B' && <span className="text-xs">🏆</span>}
                  </div>
                </div>

                <p className="text-xs text-gray-600">{total} votes au total</p>
              </div>
            )
          })
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black flex justify-around py-3">
        <a href="/vote" className="flex flex-col items-center gap-1 text-gray-500">
          <span className="text-xl">🗳️</span>
          <span className="text-xs">Voter</span>
        </a>
        <a href="/submit" className="flex flex-col items-center gap-1 text-gray-500">
          <span className="text-xl">➕</span>
          <span className="text-xs">Soumettre</span>
        </a>
        <a href="/results" className="flex flex-col items-center gap-1 text-white">
          <span className="text-xl">📊</span>
          <span className="text-xs">Résultats</span>
        </a>
      </div>
    </main>
  )
}