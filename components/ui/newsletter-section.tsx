'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 lg:px-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white/10 rounded-none">
            <Mail className="w-8 h-8" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">
          Rejoignez notre communauté
        </h2>
        <p className="text-white/70 mb-8">
          Recevez nos nouvelles collections en avant-première et −10% sur votre première commande.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-none bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-white text-black font-semibold rounded-none hover:bg-white/90 transition-colors whitespace-nowrap tracking-[0.1em]"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          >
            {submitted ? '✓ Merci !' : "J'en profite"}
          </button>
        </form>

        <p className="text-xs text-white/50 mt-4">
          Sans spam. Désabonnement en 1 clic.
        </p>
      </div>
    </section>
  );
}
