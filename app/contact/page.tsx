'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setFormState({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-16 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-5xl font-serif font-bold mb-4">Nous contacter</h1>
            <p className="text-lg text-neutral-600">
              Une question ? Une remarque ? Nous sommes ici pour vous aider.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Email */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-100 rounded-lg mb-4">
                <Mail className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-2">Email</h3>
              <p className="text-neutral-600 text-sm">
                <a href="mailto:contact@maisonserenia.ch" className="hover:underline">
                  contact@maisonserenia.ch
                </a>
              </p>
              <p className="text-xs text-neutral-500 mt-2">Réponse sous 4h</p>
            </div>

            {/* Téléphone */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-100 rounded-lg mb-4">
                <Phone className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-2">Téléphone</h3>
              <p className="text-neutral-600 text-sm">
                <a href="tel:+41000000000" className="hover:underline">
                  +41 (0) 00 000 0000
                </a>
              </p>
              <p className="text-xs text-neutral-500 mt-2">Lun-Ven 9h-17h CET</p>
            </div>

            {/* Adresse */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-100 rounded-lg mb-4">
                <MapPin className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-2">Adresse</h3>
              <p className="text-neutral-600 text-sm">
                [Votre adresse complète]<br />
                CH-xxxx Ville
              </p>
            </div>
          </div>

          {/* Horaires */}
          <div className="bg-neutral-50 p-8 rounded-lg mb-16">
            <h2 className="text-xl font-semibold text-black mb-6 flex items-center gap-3">
              <Clock className="w-5 h-5" />
              Horaires de service client
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-black mb-3">Heures d&apos;ouverture</h3>
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li>Lundi - Vendredi : 9h00 - 17h00</li>
                  <li>Samedi : 10h00 - 14h00</li>
                  <li>Dimanche : Fermé</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-black mb-3">Délai de réponse</h3>
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li>Email : Sous 4 heures (jours ouvrables)</li>
                  <li>Chat : Instantané (9h-17h CET)</li>
                  <li>Téléphone : Immédiat pendant les heures d&apos;ouverture</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif font-bold mb-8">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="votre@email.ch"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Sujet
                </label>
                <select
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="commande">Question sur une commande</option>
                  <option value="produit">Question sur un produit</option>
                  <option value="retour">Retour / échange</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
                  placeholder="Décrivez votre message..."
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-neutral-900 transition-colors"
                >
                  {submitted ? '✓ Message envoyé !' : 'Envoyer le message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
