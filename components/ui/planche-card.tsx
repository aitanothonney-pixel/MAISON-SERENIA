'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { nice99 } from '@/lib/products';
import { formatPrice, useCurrency } from '@/lib/currency';
import { useWishlist } from '@/lib/useWishlist';
import { BLACK_FRIDAY_PROMO } from '@/lib/promotions';

// Planche : carte produit de la direction artistique « mobilier architectural ».
// Une photo sur papier, la cote de largeur, le nom, les dimensions, la matière et le prix.
// Utilisée par l'accueil, les coups de cœur et les pages de collection.

/** Étiquette affichée sur les pièces Bubble en promotion. */
export const BADGE_BUBBLE = BLACK_FRIDAY_PROMO.bubbleDiscountLabel;

/** Prix d'une pièce Bubble en promotion : prix barré = prix catalogue, prix affiché = remise de 30 %. */
export function prixBubble(prixCatalogue: number): { price: number; oldPrice: number } {
  return { price: nice99(Math.round(prixCatalogue * 0.7)), oldPrice: prixCatalogue };
}

// Zoom des photos : les canapés Bubble sont agrandis pour que leurs proportions soient justes face aux fauteuils.
const ZOOM_PAR_PRODUIT: Record<number, number> = { 10: 1.2, 12: 1.2, 13: 1.2, 22: 1.2, 34: 1.35 };

export function zoomDe(id: number): number | undefined {
  return ZOOM_PAR_PRODUIT[id];
}

/** Cote de largeur : la plus grande valeur « L » des dimensions, ex. « Largeur 225 cm ». */
export function coteDe(dimensions?: string): string | null {
  if (!dimensions) return null;
  const largeurs = [...dimensions.matchAll(/\bL\.?\s*(\d+)/g)].map((m) => Number(m[1]));
  return largeurs.length > 0 ? `Largeur ${Math.max(...largeurs)} cm` : null;
}

/** Libellé de la pièce : « Canapé », « Fauteuil » ou la catégorie du produit. */
function typeDe(nom: string, categorie: string): string {
  const n = nom.toLowerCase();
  if (n.includes('canapé')) return 'Canapé';
  if (n.includes('fauteuil')) return 'Fauteuil';
  return categorie;
}

export interface PlancheProduct {
  id: number;
  name: string;
  category: string;
  images: string[];
  dimensions?: string;
  material?: string;
}

interface PlancheProps {
  product: PlancheProduct;
  /** Prix affiché, en CHF (converti selon la devise choisie). */
  price: number;
  /** Prix barré, en CHF, lorsqu'une remise est appliquée. */
  oldPrice?: number;
  /** Étiquette sur la photo, par exemple « −30 % ». */
  badge?: string;
  /** Numéro de planche (0 pour la première). */
  index?: number;
  /** Zoom de la photo. */
  zoom?: number;
  /** 'lcp' : photo chargée en priorité. 'eager' : chargée dès l'ouverture. Absent : chargement différé. */
  chargement?: 'lcp' | 'eager';
  /** Affiche le bouton favoris. */
  wishlist?: boolean;
}

export function PlancheCard({ product, price, oldPrice, badge, index, zoom, chargement, wishlist = false }: PlancheProps) {
  const cur = useCurrency();
  const href = `/products/${product.id}`;
  const contain = product.name.includes('Bubble') || product.category === 'Décorations' || product.category === 'Été';
  const classeImage = contain ? 'planche-img--contain' : 'planche-img--cover';
  const survol = product.images[1];
  const cote = coteDe(product.dimensions);
  const lignes = product.dimensions ? product.dimensions.split(' · ') : [];
  const numero = index === undefined ? product.category : `Planche ${String(index + 1).padStart(2, '0')}`;
  // Zoom : la photo est agrandie et son cadre réduit (marge de 2 % de chaque côté) pour que le produit reste entier.
  const style = zoom
    ? { transform: `scale(${zoom})`, padding: contain ? `${((1 - 0.96 / zoom) / 2) * 100}%` : undefined }
    : undefined;
  const tailles = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw';

  return (
    <article className={survol ? 'planche a-survol' : 'planche'}>
      <header className="planche-tete">
        <span className="da-mono">{numero}</span>
        <span className="da-mono planche-type">{typeDe(product.name, product.category)}</span>
      </header>

      <div className="planche-cadre">
        <Link href={href} tabIndex={-1} className="planche-photo">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes={tailles}
            priority={chargement === 'lcp'}
            loading={chargement ? 'eager' : undefined}
            className={`planche-img planche-img--principal ${classeImage}`}
            style={style}
          />
          {survol && (
            <Image
              src={survol}
              alt=""
              fill
              sizes={tailles}
              className={`planche-img planche-img--survol ${classeImage}`}
              style={style}
            />
          )}
        </Link>
        {badge && <span className="planche-badge da-mono">{badge}</span>}
        {wishlist && <BoutonFavori id={product.id} />}
      </div>

      {cote && (
        <div className="planche-cote">
          <span className="da-mono planche-cote-libelle">{cote}</span>
        </div>
      )}

      <h2 className="planche-titre">
        <Link href={href}>{product.name}</Link>
      </h2>

      {(lignes.length > 0 || product.material) && (
        <dl className="planche-fiche">
          {lignes.length > 0 && (
            <div>
              <dt className="da-mono">Dimensions</dt>
              <dd>
                {lignes.map((ligne) => (
                  <span key={ligne} className="planche-ligne">{ligne.replace(' cm', ' cm')}</span>
                ))}
              </dd>
            </div>
          )}
          {product.material && (
            <div>
              <dt className="da-mono">Matière</dt>
              <dd>{product.material}</dd>
            </div>
          )}
        </dl>
      )}

      <p className="planche-prix">
        <strong>{formatPrice(price, cur)}</strong>
        {oldPrice !== undefined && <s>{formatPrice(oldPrice, cur)}</s>}
      </p>

      <p className="da-lien">
        <Link href={href}>Voir la fiche <span aria-hidden="true">→</span></Link>
      </p>
    </article>
  );
}

// Bouton favoris, hors du lien de la photo. Séparé pour que la carte n'ait pas besoin de la liste de favoris.
function BoutonFavori({ id }: { id: number }) {
  const { isWished, toggle } = useWishlist();
  const favori = isWished(id);

  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-label="Ajouter aux favoris"
      aria-pressed={favori}
      className={favori ? 'planche-favori is-on' : 'planche-favori'}
    >
      <Heart className={`w-3.5 h-3.5 ${favori ? 'fill-red-500 text-red-500' : ''}`} />
    </button>
  );
}
