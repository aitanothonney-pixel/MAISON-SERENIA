'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ShoppingBag, ChevronRight, Share2, Heart, Globe } from 'lucide-react';
import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero';
import { Gallery4 } from '@/components/blocks/gallery4';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';
import { motion as motionLib } from 'motion/react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { products } from '@/lib/products';

// ─── FadeIn wrapper ───────────────────────────────────────────────────────────

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Collections data ─────────────────────────────────────────────────────────

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
    description: "Mobilier d'extérieur pour profiter de vos espaces outdoor.",
    href: '#',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
  },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
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
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">
        <a
          href="#"
          className={`text-lg lg:text-xl font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${
            scrolled ? 'text-black' : 'text-white'
          }`}
          style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', letterSpacing: '0.25em' }}
        >
          MAISON SERENIA
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {['Collections', 'Nouveautés', 'Inspirations', 'À Propos', 'Contact'].map((item) => (
            <a
              key={item}
              href="#"
              className={`text-sm tracking-widest uppercase transition-colors duration-300 hover:opacity-60 ${
                scrolled ? 'text-black' : 'text-white/90'
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="relative p-2">
            <ShoppingBag
              className={`w-5 h-5 transition-colors duration-300 ${scrolled ? 'text-black' : 'text-white'}`}
            />
          </button>
          <button
            className="lg:hidden p-2 flex flex-col gap-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-5 h-0.5 transition-colors ${scrolled ? 'bg-black' : 'bg-white'}`} />
            <span className={`block w-5 h-0.5 transition-colors ${scrolled ? 'bg-black' : 'bg-white'}`} />
            <span className={`block w-5 h-0.5 transition-colors ${scrolled ? 'bg-black' : 'bg-white'}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-100 px-6 py-6 flex flex-col gap-4">
          {['Collections', 'Nouveautés', 'Inspirations', 'À Propos', 'Contact'].map((item) => (
            <a key={item} href="#" className="text-sm tracking-widest uppercase text-black hover:opacity-60">
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

interface ProductPreview {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
}

function ProductCard({ product, index }: { product: ProductPreview; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-transparent hover:border-neutral-200 transition-all duration-500 shadow-sm hover:shadow-lg"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden aspect-[4/3]">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={450}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="block w-full text-center bg-white text-black text-xs font-semibold tracking-widest uppercase py-3 rounded-xl">
              Voir le produit
            </span>
          </div>
        </div>
        <div className="p-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1">{product.category}</p>
          <h3 className="font-serif font-semibold text-black text-base mb-1">{product.name}</h3>
          <p className="text-neutral-500 text-xs mb-3 line-clamp-1">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-black font-bold text-base">
              {product.price.toLocaleString('fr-FR')} €
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400 group-hover:text-black transition-colors">
              Voir →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Interior Showcase ────────────────────────────────────────────────────────

function InteriorShowcaseSection() {
  return (
    <FadeInSection>
      <div className="flex flex-col overflow-hidden bg-white">
        <ContainerScroll
          titleComponent={
            <div className="mb-8">
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-neutral-400">L&apos;art de vivre</p>
              <h2 className="text-3xl md:text-5xl font-bold text-black leading-tight" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                Des intérieurs qui vous <br />
                <span className="italic">ressemblent</span>
              </h2>
              <p className="mt-4 text-neutral-500 max-w-xl mx-auto text-base">
                Chaque pièce est pensée pour s&apos;intégrer harmonieusement dans votre espace de vie.
              </p>
            </div>
          }
        >
          <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full w-full">
            <div className="col-span-2 row-span-2 relative overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80"
                alt="Salon MAISON SERENIA"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-xs tracking-widest uppercase opacity-70">Collection</p>
                <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>Salon Contemporain</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80"
                alt="Chambre"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">Chambre</div>
            </div>
            <div className="relative overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600&q=80"
                alt="Salle à manger"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">Salle à manger</div>
            </div>
          </div>
        </ContainerScroll>
      </div>
    </FadeInSection>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    text: "Le canapé Élysée est d'une qualité exceptionnelle. Le tissu est doux, les coussins gardent leur forme après des mois d'utilisation. Un achat que je ne regrette absolument pas.",
    image: 'https://randomuser.me/api/portraits/women/11.jpg',
    name: 'Sophie Marchand',
    role: 'Cliente vérifiée',
  },
  {
    text: 'La table à manger Opéra en chêne massif est tout simplement magnifique. Le bois est chaleureux, les finitions sont parfaites. Ma salle à manger a été transformée.',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    name: 'Thomas Lefebvre',
    role: 'Client vérifié',
  },
  {
    text: "Livraison rapide, emballage soigné, et le fauteuil Rivoli est encore plus beau en vrai qu'en photo. MAISON SERENIA a un sens du détail remarquable.",
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    name: 'Camille Rousseau',
    role: 'Cliente vérifiée',
  },
  {
    text: "J'ai commandé l'ensemble chambre — lit Vendôme, chevets et commode. L'harmonie des pièces est parfaite, et la qualité justifie amplement le prix. Je recommande vivement.",
    image: 'https://randomuser.me/api/portraits/men/44.jpg',
    name: 'Antoine Dubois',
    role: 'Client vérifié',
  },
  {
    text: "Le service client est au top. J'avais une question sur les dimensions du buffet, ils ont répondu en moins d'une heure avec des photos supplémentaires. Impeccable.",
    image: 'https://randomuser.me/api/portraits/women/55.jpg',
    name: 'Isabelle Fontaine',
    role: 'Cliente vérifiée',
  },
  {
    text: 'Ma bibliothèque Haussmann est arrivée parfaitement assemblée. Les étagères sont robustes et le bois sent bon. Je suis conquise.',
    image: 'https://randomuser.me/api/portraits/women/66.jpg',
    name: 'Marie-Claire Petit',
    role: 'Cliente vérifiée',
  },
  {
    text: 'Le lampadaire Molière en laiton est une vraie pièce de décoration. La lumière qu\'il diffuse est douce et chaleureuse. Mes invités le remarquent à chaque visite.',
    image: 'https://randomuser.me/api/portraits/men/77.jpg',
    name: 'Julien Bernard',
    role: 'Client vérifié',
  },
  {
    text: 'Excellent rapport qualité-prix sur la table basse Concorde en marbre. Elle est lourde (signe de qualité !), facile à nettoyer et sublime mon salon.',
    image: 'https://randomuser.me/api/portraits/women/88.jpg',
    name: 'Nathalie Girard',
    role: 'Cliente vérifiée',
  },
  {
    text: 'Les chaises Palais Royal sont stables, confortables et résistantes. Après un an d\'usage quotidien, elles sont comme neuves. Une belle réussite.',
    image: 'https://randomuser.me/api/portraits/men/99.jpg',
    name: 'Pierre Morel',
    role: 'Client vérifié',
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

function TestimonialsSection() {
  return (
    <FadeInSection>
      <section className="bg-white py-20">
        <div className="container z-10 mx-auto">
          <motionLib.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
          >
            <div className="flex justify-center">
              <div className="border border-black text-black py-1 px-4 rounded-full text-xs tracking-[0.2em] uppercase">
                Témoignages
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-5 text-center" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
              Ce que disent nos clients
            </h2>
            <p className="text-center mt-5 text-neutral-500 text-sm">
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
    </FadeInSection>
  );
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <FadeInSection>
      <section className="py-28 bg-black text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-4 text-white/40">Newsletter</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
            L&apos;art de vivre, chaque semaine
          </h2>
          <p className="text-white/50 mb-10 max-w-lg mx-auto text-sm leading-relaxed">
            Recevez nos nouvelles collections, nos conseils déco exclusifs et nos offres privilèges directement dans votre boîte mail.
          </p>
          {submitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white font-semibold text-lg">
              Merci ! Vous êtes désormais inscrit(e) à notre newsletter.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-5 py-3 rounded-xl text-sm focus:outline-none focus:border-white transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-white hover:bg-neutral-100 text-black font-semibold px-6 py-3 rounded-xl text-sm tracking-wider uppercase transition-colors duration-300"
              >
                S&apos;inscrire
              </button>
            </form>
          )}
        </div>
      </section>
    </FadeInSection>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-black text-white/60 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3
              className="text-white text-lg font-bold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
            >
              MAISON SERENIA
            </h3>
            <p className="text-sm leading-relaxed mb-6">
              L&apos;art de vivre à la française. Des pièces intemporelles, conçues pour durer et sublimer votre intérieur.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Share2 className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Heart className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">Collections</h4>
            <ul className="space-y-2 text-sm">
              {['Salon', 'Chambre', 'Salle à manger', 'Bureau', 'Terrasse'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
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
                  <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" /> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© 2024 MAISON SERENIA. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/60 transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white/60 transition-colors">CGV</a>
            <a href="#" className="hover:text-white/60 transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />

      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1280&q=80"
        bgImageSrc="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80"
        title="MAISON SERENIA"
        date="Collection 2024"
        scrollToExpand="Défiler pour découvrir"
        textBlend={true}
      >
        <div className="w-full">
          {/* Tagline */}
          <FadeInSection>
            <div className="text-center mb-20">
              <p className="text-xs tracking-[0.4em] uppercase mb-4 text-neutral-400">L&apos;art de vivre à la française</p>
              <h2
                className="text-3xl md:text-5xl font-bold text-black mb-6"
                style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
              >
                Mobilier d&apos;exception,<br />intérieurs sublimés
              </h2>
              <p className="text-neutral-500 max-w-xl mx-auto leading-relaxed text-sm">
                Depuis 1985, MAISON SERENIA crée des espaces de vie où le raffinement rencontre le confort. Chaque pièce est pensée pour traverser les générations.
              </p>
            </div>
          </FadeInSection>

          {/* Collections */}
          <FadeInSection delay={0.1}>
            <Gallery4
              title="Nos Collections"
              description="Du salon à la terrasse, découvrez des univers conçus pour vous ressembler."
              items={collections}
            />
          </FadeInSection>

          {/* Products Grid */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto">
              <FadeInSection>
                <div className="text-center mb-14">
                  <p className="text-xs tracking-[0.4em] uppercase mb-3 text-neutral-400">Sélection</p>
                  <h2
                    className="text-3xl md:text-4xl font-bold text-black"
                    style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
                  >
                    Nos Pièces Signatures
                  </h2>
                  <p className="text-neutral-500 mt-3 max-w-lg mx-auto text-sm">
                    Une sélection rigoureuse de meubles et objets décoratifs qui façonnent les intérieurs d&apos;exception.
                  </p>
                </div>
              </FadeInSection>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </ScrollExpandMedia>

      <InteriorShowcaseSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
