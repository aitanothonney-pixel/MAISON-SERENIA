'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import {
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Share2,
  Heart,
  Globe,
} from 'lucide-react';
import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero';
import { Gallery4 } from '@/components/blocks/gallery4';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';
import { motion as motionLib } from 'motion/react';

// ─── Data ────────────────────────────────────────────────────────────────────

const collections = [
  {
    id: '1',
    title: 'Salon',
    description: 'Canapés, fauteuils et tables basses pour un salon raffiné.',
    href: '#',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  },
  {
    id: '2',
    title: 'Chambre',
    description: 'Lits, chevets et armoires pour une chambre apaisante.',
    href: '#',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
  },
  {
    id: '3',
    title: 'Salle à manger',
    description: 'Tables et chaises pour des repas en toute élégance.',
    href: '#',
    image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&q=80',
  },
  {
    id: '4',
    title: 'Bureau',
    description: 'Mobilier de bureau alliant confort et esthétique.',
    href: '#',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
  },
  {
    id: '5',
    title: 'Terrasse',
    description: 'Mobilier d\'extérieur pour profiter de vos espaces outdoor.',
    href: '#',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
  },
];

const products = [
  { id: 1, name: 'Canapé Lumière', desc: 'Tissu bouclé, structure en chêne massif', price: 2890, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80' },
  { id: 2, name: 'Fauteuil Épure', desc: 'Cuir pleine fleur, pieds laiton brossé', price: 1450, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80' },
  { id: 3, name: 'Lit Nuage', desc: 'Tête de lit capitonnée, velours doux', price: 3200, image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80' },
  { id: 4, name: 'Table Conviviale', desc: 'Chêne massif huilé, rallonges intégrées', price: 1890, image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600&q=80' },
  { id: 5, name: 'Bibliothèque Atelier', desc: 'Métal noir mat, étagères en noyer', price: 2100, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80' },
  { id: 6, name: 'Table Basse Marbre', desc: 'Marbre de Carrare, base en laiton', price: 980, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80' },
  { id: 7, name: 'Lampe Sculpture', desc: 'Céramique artisanale, abat-jour lin', price: 560, image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80' },
  { id: 8, name: 'Salon Complet Sérène', desc: 'Collection complète en tissu naturel', price: 3890, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80' },
  { id: 9, name: 'Bergère Tradition', desc: 'Velours côtelé, structure hêtre naturel', price: 1290, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=80' },
  { id: 10, name: 'Canapé d\'Angle', desc: 'Modulable, tissu performance résistant', price: 3450, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80' },
  { id: 11, name: 'Armoire Dressing', desc: 'Miroir intégré, intérieur personnalisable', price: 2750, image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600&q=80' },
  { id: 12, name: 'Lit Baldaquin', desc: 'Structure métal forgé, voilage inclus', price: 3900, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80' },
  { id: 13, name: 'Table à Manger Ronde', desc: 'Noyer américain, pied central tulipe', price: 2200, image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80' },
  { id: 14, name: 'Chambre Douce Nuit', desc: 'Ensemble lit + chevets assortis', price: 4200, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80' },
  { id: 15, name: 'Table d\'Appoint Or', desc: 'Laiton doré, plateau verre teinté', price: 480, image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80' },
  { id: 16, name: 'Canapé Terrasse', desc: 'Résine tressée, coussins waterproof', price: 1850, image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=600&q=80' },
  { id: 17, name: 'Chaise Parisienne', desc: 'Assise cannée, bois de hêtre courbé', price: 420, image: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=600&q=80' },
  { id: 18, name: 'Fauteuil Pivotant', desc: 'Cuir pleine fleur, base aluminium', price: 1680, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80' },
  { id: 19, name: 'Miroir Lune', desc: 'Cadre en rotin naturel, grand format', price: 650, image: 'https://images.unsplash.com/photo-1572544052944-0c4f611e9b2c?w=600&q=80' },
  { id: 20, name: 'Tabouret Bar', desc: 'Métal noir, assise simili cuir ivoire', price: 310, image: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=600&q=80' },
  { id: 21, name: 'Meuble TV Scandinave', desc: 'Chêne clair, pieds effilés, portes cannelées', price: 1290, image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80' },
  { id: 22, name: 'Lampadaire Arc', desc: 'Base marbre, bras articulé en laiton', price: 780, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { id: 23, name: 'Étagère Murale', desc: 'Chêne massif, supports invisibles acier', price: 390, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80' },
  { id: 24, name: 'Coiffeuse Élégance', desc: 'Miroir tri-faces, tiroirs velours', price: 1100, image: 'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=600&q=80' },
  { id: 25, name: 'Canapé Convertible', desc: 'Mécanisme rapide, matelas mémoire', price: 1750, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80' },
  { id: 26, name: 'Tabouret Cuisine', desc: 'Velours texturé, réglable en hauteur', price: 280, image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=600&q=80' },
  { id: 27, name: 'Salon Outdoor Prestige', desc: 'Aluminium traité, coussins Sunbrella®', price: 3100, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80' },
  { id: 28, name: 'Bureau Directorial', desc: 'Cuir noir, structure en métal brossé', price: 2400, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80' },
  { id: 29, name: 'Chevet Asymétrique', desc: 'Noyer et laiton, tiroir coulissant', price: 490, image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80' },
  { id: 30, name: 'Suspension Organic', desc: 'Rotin tressé main, ampoule E27 incluse', price: 340, image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80' },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#faf9f7]/95 backdrop-blur-md shadow-sm border-b border-[#e5e0d8]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <a
          href="#"
          className={`text-lg lg:text-xl font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${
            scrolled ? 'text-[#1a1a1a]' : 'text-white'
          }`}
          style={{ fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '0.25em' }}
        >
          MAISON SERENIA
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {['Collections', 'Nouveautés', 'Inspirations', 'À Propos', 'Contact'].map((item) => (
            <a
              key={item}
              href="#"
              className={`text-sm tracking-widest uppercase transition-colors duration-300 hover:text-[#c9a96e] ${
                scrolled ? 'text-[#1a1a1a]' : 'text-white/90'
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Cart + Burger */}
        <div className="flex items-center gap-4">
          <button className="relative p-2">
            <ShoppingBag
              className={`w-5 h-5 transition-colors duration-300 ${
                scrolled ? 'text-[#1a1a1a]' : 'text-white'
              }`}
            />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#c9a96e] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="lg:hidden p-2 flex flex-col gap-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-5 h-0.5 transition-colors ${scrolled ? 'bg-[#1a1a1a]' : 'bg-white'}`} />
            <span className={`block w-5 h-0.5 transition-colors ${scrolled ? 'bg-[#1a1a1a]' : 'bg-white'}`} />
            <span className={`block w-5 h-0.5 transition-colors ${scrolled ? 'bg-[#1a1a1a]' : 'bg-white'}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#faf9f7] border-t border-[#e5e0d8] px-6 py-6 flex flex-col gap-4">
          {['Collections', 'Nouveautés', 'Inspirations', 'À Propos', 'Contact'].map((item) => (
            <a key={item} href="#" className="text-sm tracking-widest uppercase text-[#1a1a1a] hover:text-[#c9a96e]">
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  image: string;
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={450}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        {/* Quick add button */}
        <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
          <button className="w-full bg-white text-[#1a1a1a] text-xs font-semibold tracking-widest uppercase py-3 rounded-xl hover:bg-[#c9a96e] hover:text-white transition-colors duration-300">
            Ajouter au panier
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-semibold text-[#1a1a1a] text-base mb-1 tracking-wide">{product.name}</h3>
        <p className="text-[#6b6b6b] text-sm mb-3 line-clamp-1">{product.desc}</p>
        <div className="flex items-center justify-between">
          <span className="text-[#1a1a1a] font-bold text-lg">
            {product.price.toLocaleString('fr-FR')} €
          </span>
          <button className="text-[#c9a96e] text-xs font-semibold tracking-wider uppercase hover:underline">
            Voir
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    text: "Le canapé Sérénia est d'une qualité exceptionnelle. Le tissu est doux, les coussins gardent leur forme après des mois d'utilisation. Un achat que je ne regrette absolument pas.",
    image: "https://randomuser.me/api/portraits/women/11.jpg",
    name: "Sophie Marchand",
    role: "Cliente vérifiée",
  },
  {
    text: "La table à manger en chêne massif est tout simplement magnifique. Le bois est chaleureux, les finitions sont parfaites. Ma salle à manger a été transformée.",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    name: "Thomas Lefebvre",
    role: "Client vérifié",
  },
  {
    text: "Livraison rapide, emballage soigné, et le fauteuil est encore plus beau en vrai qu'en photo. MAISON SERENIA a un sens du détail remarquable.",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    name: "Camille Rousseau",
    role: "Cliente vérifiée",
  },
  {
    text: "J'ai commandé l'ensemble chambre — lit, chevets et commode. L'harmonie des pièces est parfaite, et la qualité justifie amplement le prix. Je recommande vivement.",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    name: "Antoine Dubois",
    role: "Client vérifié",
  },
  {
    text: "Le service client est au top. J'avais une question sur les dimensions du buffet, ils ont répondu en moins d'une heure avec des photos supplémentaires. Impeccable.",
    image: "https://randomuser.me/api/portraits/women/55.jpg",
    name: "Isabelle Fontaine",
    role: "Cliente vérifiée",
  },
  {
    text: "Ma bibliothèque sur mesure est arrivée parfaitement assemblée. Les étagères sont robustes et le bois sent bon. Je suis conquise.",
    image: "https://randomuser.me/api/portraits/women/66.jpg",
    name: "Marie-Claire Petit",
    role: "Cliente vérifiée",
  },
  {
    text: "Le lampadaire en laiton est une vraie pièce de décoration. La lumière qu'il diffuse est douce et chaleureuse. Mes invités le remarquent à chaque visite.",
    image: "https://randomuser.me/api/portraits/men/77.jpg",
    name: "Julien Bernard",
    role: "Client vérifié",
  },
  {
    text: "Excellent rapport qualité-prix sur la table basse en marbre. Elle est lourde (signe de qualité !), facile à nettoyer et sublime mon salon.",
    image: "https://randomuser.me/api/portraits/women/88.jpg",
    name: "Nathalie Girard",
    role: "Cliente vérifiée",
  },
  {
    text: "Les chaises de salle à manger sont stables, confortables et résistantes. Après un an d'usage quotidien, elles sont comme neuves. Une belle réussite.",
    image: "https://randomuser.me/api/portraits/men/99.jpg",
    name: "Pierre Morel",
    role: "Client vérifié",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

function TestimonialsSection() {
  return (
    <section className="bg-background my-20 relative">
      <div className="container z-10 mx-auto">
        <motionLib.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border border-[#c9a96e] text-[#c9a96e] py-1 px-4 rounded-lg text-xs tracking-[0.2em] uppercase">
              Témoignages
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-5 text-center font-serif">
            Ce que disent nos clients
          </h2>
          <p className="text-center mt-5 opacity-60">
            Des milliers de clients satisfaits font confiance à MAISON SERENIA pour sublimer leur intérieur.
          </p>
        </motionLib.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────

function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: <Truck className="w-8 h-8 text-[#c9a96e]" />,
      title: 'Livraison offerte',
      subtitle: 'dès 500 €',
      description: 'Livraison en blanc à domicile, installation comprise pour toute commande supérieure à 500 €.',
    },
    {
      icon: <Shield className="w-8 h-8 text-[#c9a96e]" />,
      title: 'Garantie 5 ans',
      subtitle: 'sur tous nos produits',
      description: 'Chaque pièce est garantie 5 ans contre tout défaut de fabrication. Notre qualité, votre sérénité.',
    },
    {
      icon: <RotateCcw className="w-8 h-8 text-[#c9a96e]" />,
      title: 'Retours gratuits',
      subtitle: '30 jours',
      description: 'Vous disposez de 30 jours pour retourner votre commande sans frais et sans justification.',
    },
  ];

  return (
    <section className="py-24 bg-[#f0ede8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="p-4 bg-white rounded-2xl shadow-sm">{f.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-[#1a1a1a]">{f.title}</h3>
                <p className="text-[#c9a96e] font-semibold text-sm tracking-wider uppercase mb-2">{f.subtitle}</p>
                <p className="text-[#6b6b6b] text-sm leading-relaxed">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter Section ───────────────────────────────────────────────────────

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-28 bg-[#1a1a1a] text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase mb-4">Newsletter</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          L'art de vivre, chaque semaine
        </h2>
        <p className="text-white/60 mb-10 max-w-lg mx-auto text-sm leading-relaxed">
          Recevez nos nouvelles collections, nos conseils déco exclusifs et nos offres privilèges directement dans votre boîte mail.
        </p>
        {submitted ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#c9a96e] font-semibold text-lg">
            Merci ! Vous êtes désormais inscrit(e) à notre newsletter.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-5 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c9a96e] transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-[#c9a96e] hover:bg-[#b8924f] text-white font-semibold px-6 py-3 rounded-xl text-sm tracking-wider uppercase transition-colors duration-300"
            >
              S'inscrire
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#111] text-white/70 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-white text-lg font-bold tracking-[0.2em] uppercase mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              MAISON SERENIA
            </h3>
            <p className="text-sm leading-relaxed mb-6">
              L'art de vivre à la française. Des pièces intemporelles, conçues pour durer et sublimer votre intérieur.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#c9a96e] transition-colors"><Share2 className="w-5 h-5" /></a>
              <a href="#" className="hover:text-[#c9a96e] transition-colors"><Heart className="w-5 h-5" /></a>
              <a href="#" className="hover:text-[#c9a96e] transition-colors"><Globe className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">Collections</h4>
            <ul className="space-y-2 text-sm">
              {['Salon', 'Chambre', 'Salle à manger', 'Bureau', 'Terrasse'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#c9a96e] transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" /> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">Informations</h4>
            <ul className="space-y-2 text-sm">
              {['À Propos', 'Nos Showrooms', 'Presse', 'Carrières', 'Blog'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#c9a96e] transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" /> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service client */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">Service Client</h4>
            <ul className="space-y-2 text-sm">
              {['Livraison & Retours', 'FAQ', 'Contact', 'Garantie', 'Financement'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#c9a96e] transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" /> {item}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-sm">
              <p className="text-white font-semibold mb-1">01 23 45 67 89</p>
              <p>Lun–Ven 9h–19h</p>
              <p>contact@maisonserenia.fr</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© 2024 MAISON SERENIA. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/70 transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white/70 transition-colors">CGV</a>
            <a href="#" className="hover:text-white/70 transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="bg-[#faf9f7]">
      <Navbar />

      {/* Hero with scroll expansion */}
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1280&q=80"
        bgImageSrc="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80"
        title="MAISON SERENIA"
        date="Collection 2024"
        scrollToExpand="Défiler pour découvrir"
        textBlend={true}
      >
        {/* Content revealed after hero expansion */}
        <div className="w-full">
          {/* Tagline */}
          <div className="text-center mb-20">
            <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase mb-4">L'art de vivre à la française</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Mobilier d'exception,<br />intérieurs sublimés
            </h2>
            <p className="text-[#6b6b6b] max-w-xl mx-auto leading-relaxed">
              Depuis 1985, MAISON SERENIA crée des espaces de vie où le raffinement rencontre le confort. Chaque pièce est pensée pour traverser les générations.
            </p>
          </div>

          {/* Collections Carousel */}
          <Gallery4
            title="Nos Collections"
            description="Du salon à la terrasse, découvrez des univers conçus pour vous ressembler."
            items={collections}
          />

          {/* Products Grid */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase mb-3">Sélection</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a]" style={{ fontFamily: 'Georgia, serif' }}>
                  Nos Pièces Signatures
                </h2>
                <p className="text-[#6b6b6b] mt-3 max-w-lg mx-auto text-sm">
                  Une sélection rigoureuse de meubles et objets décoratifs qui façonnent les intérieurs d'exception.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </ScrollExpandMedia>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Features */}
      <FeaturesSection />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
