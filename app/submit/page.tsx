'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['Mode', 'Coiffure', 'Make-up', 'Voyage', 'Profil']

export default function SubmitPage() {
  const [question, setQuestion] = useState('')
  const [category, setCategory] = useState('Mode')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit() {
    if (!question.trim()) return
    setLoading(true)
    const { error } = await supabase.from('pickrs').insert({
      question,
      category: category.toLowerCase(),
      user_id: null
    })
    setLoading(false)
    if (!error) {
      setSuccess(true)
    } else {
      alert('Erreur : ' + error.message)
    }
  }
  if (success) return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 gap-6">
      <div className="text-6xl">🎉</div>
      <h2 className="text-2xl font-bold">Soumis !</h2>
      <p className="text-gray-400 text-center">La communauté va voter sur ta question.</p>
      <a href="/vote" className="bg-white text-black px-8 py-3 rounded-full font-semibold">
        Voir les votes →
      </a>
    </main>
  )

  return (
    <main className="min-h-screen bg-black text-white flex flex-col p-6 gap-6">
      <div className="flex items-center gap-3">
        <a href="/" className="text-gray-400">←</a>
        <h1 className="text-2xl font-bold">Nouveau Pickr</h1>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Ta question</label>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Laquelle de ces deux tenues tu préfères ?"
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 resize-none h-24 focus:outline-none focus:border-white/30"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-2 block">Catégorie</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  category === cat ? 'bg-white text-black' : 'border border-white/20 text-gray-400'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="aspect-square rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-white/40 transition">
            <span className="text-3xl">📷</span>
            <span className="text-sm text-gray-500">Photo A</span>
          </div>
          <div className="aspect-square rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-white/40 transition">
            <span className="text-3xl">📷</span>
            <span className="text-sm text-gray-500">Photo B</span>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading || !question.trim()}
          className="w-full bg-white text-black font-semibold py-4 rounded-2xl text-lg disabled:opacity-40 transition">
          {loading ? 'Envoi...' : 'Soumettre mon Pickr →'}
        </button>

        <p className="text-center text-gray-600 text-sm">
          Coûte 1 crédit · Tu en as 3 gratuits au départ
        </p>
      </div>
    </main>
  )
}