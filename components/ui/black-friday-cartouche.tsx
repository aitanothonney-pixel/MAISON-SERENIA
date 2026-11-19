'use client';

import Link from 'next/link';
import { BLACK_FRIDAY_PROMO, formatPromoEnd, promoEndTimestamp } from '@/lib/promotions';
import { PromoCountdown } from '@/components/ui/promo-countdown';
import { formatPrice, useCurrency } from '@/lib/currency';

// Cartouche d'accueil : promotion Black Friday, plan d'implantation et boutons.
// Direction artistique « mobilier architectural ». Aucun chiffre n'est inventé : la remise vient de
// lib/promotions.ts, et la date de fin n'apparaît que lorsqu'elle est configurée.
export function BlackFridayCartouche({ marginTop }: { marginTop: number }) {
  const cur = useCurrency();
  const endsAt = BLACK_FRIDAY_PROMO.endsAt;
  const finActive = promoEndTimestamp() !== null;

  return (
    <section className="da-page" style={{ marginTop }} aria-labelledby="black-friday-titre">
      <header className="da-cartouche">
        <div>
          <p className="da-mono">Maison Serenia · Promotion</p>
          <h1 id="black-friday-titre" className="da-cartouche-titre">Black Friday</h1>
          <p className="da-sous">
            Collection Bubble · remise {BLACK_FRIDAY_PROMO.bubbleDiscountLabel} sur les neuf pièces en promotion
          </p>
        </div>
        <dl className="da-cartouche-infos">
          <div><dt className="da-mono">Remise</dt><dd>{BLACK_FRIDAY_PROMO.bubbleDiscountLabel}</dd></div>
          <div><dt className="da-mono">Pièces</dt><dd>01 à 09</dd></div>
          <div><dt className="da-mono">Cotes</dt><dd>en centimètres</dd></div>
          <div><dt className="da-mono">Livraison</dt><dd>offerte dès {formatPrice(40, cur)}</dd></div>
          {finActive && endsAt && (
            <div><dt className="da-mono">Fin de l&apos;offre</dt><dd>{formatPromoEnd(endsAt)}</dd></div>
          )}
        </dl>
      </header>

      <div className="da-plan-grille">
        <div>
          <p className="da-intro">
            Neuf pièces Bubble en promotion. Chaque planche donne les cotes et la matière, pour vérifier la place disponible avant de commander.
          </p>
          <p className="da-note">
            Le plan ci-contre montre un canapé et deux fauteuils à leurs cotes réelles, dans un salon indicatif de 580 × 360 cm.
          </p>
        </div>
        <figure className="da-plan">
          <figcaption className="da-mono">Plan d&apos;implantation · cotes en cm</figcaption>
          <PlanImplantation />
        </figure>
      </div>

      <div className="da-actions">
        <a href="#bubble-promo" className="da-bouton">Voir les neuf planches</a>
        <Link href="/collections/salon" className="da-bouton da-bouton--ligne">Toute la collection Salon</Link>
      </div>

      {finActive && endsAt && (
        <div className="da-compte">
          <PromoCountdown endsAt={endsAt} className="flex flex-col items-start" />
        </div>
      )}

      <p className="da-mono da-bas">
        {endsAt
          ? `Offre valable jusqu’au ${formatPromoEnd(endsAt)}, dans la limite des stocks disponibles.`
          : 'Remise appliquée automatiquement sur les pièces de la collection Bubble.'}
      </p>
    </section>
  );
}

// Plan d'implantation : un canapé et deux fauteuils à leurs cotes (en cm) dans un salon indicatif.
function PlanImplantation() {
  return (
    <svg
      viewBox="0 0 640 486"
      role="img"
      aria-label="Plan d'implantation : un canapé et deux fauteuils dans un salon indicatif, cotes en centimètres"
      className="da-plan-svg"
    >
      <rect x="30" y="30" width="580" height="360" fill="#F7F4EF" stroke="#1E1C19" strokeWidth="3" />
      <rect x="262" y="26" width="116" height="8" fill="#8A6D4B" />
      <rect x="210" y="252" width="225" height="114" rx="16" fill="#E4D9C6" stroke="#1E1C19" strokeWidth="1.6" />
      <rect x="210" y="252" width="225" height="26" rx="12" fill="#CDBFA7" />
      <rect x="60" y="252" width="120" height="114" rx="16" fill="#E4D9C6" stroke="#1E1C19" strokeWidth="1.6" />
      <rect x="60" y="252" width="120" height="26" rx="12" fill="#CDBFA7" />
      <rect x="460" y="252" width="120" height="114" rx="16" fill="#E4D9C6" stroke="#1E1C19" strokeWidth="1.6" />
      <rect x="460" y="252" width="120" height="26" rx="12" fill="#CDBFA7" />
      <g stroke="#1E1C19" strokeWidth="1.2" fill="none">
        <line x1="30" y1="14" x2="610" y2="14" />
        <line x1="30" y1="8" x2="30" y2="20" />
        <line x1="610" y1="8" x2="610" y2="20" />
        <line x1="14" y1="30" x2="14" y2="390" />
        <line x1="8" y1="30" x2="20" y2="30" />
        <line x1="8" y1="390" x2="20" y2="390" />
        <line x1="210" y1="420" x2="435" y2="420" />
        <line x1="210" y1="414" x2="210" y2="426" />
        <line x1="435" y1="414" x2="435" y2="426" />
        <line x1="60" y1="420" x2="180" y2="420" />
        <line x1="60" y1="414" x2="60" y2="426" />
        <line x1="180" y1="414" x2="180" y2="426" />
        <line x1="460" y1="420" x2="580" y2="420" />
        <line x1="460" y1="414" x2="460" y2="426" />
        <line x1="580" y1="414" x2="580" y2="426" />
      </g>
      <g className="da-plan-txt" fill="#1E1C19" textAnchor="middle">
        <rect x="262" y="0" width="116" height="24" fill="#F7F4EF" />
        <text x="320" y="19">580</text>
        <rect x="2" y="190" width="18" height="40" fill="#F7F4EF" />
        <text x="10" y="210" transform="rotate(-90 10 210)">360</text>
        <rect x="262" y="426" width="120" height="26" fill="#F7F4EF" />
        <text x="322" y="441">225</text>
        <text x="120" y="441">120</text>
        <text x="520" y="441">120</text>
        <text x="322" y="332">CANAPÉ</text>
        <text x="120" y="332">FAUTEUIL</text>
        <text x="520" y="332">FAUTEUIL</text>
      </g>
      <g stroke="#1E1C19" strokeWidth="1">
        <rect x="30" y="462" width="50" height="7" fill="#1E1C19" />
        <rect x="80" y="462" width="50" height="7" fill="none" />
      </g>
      <g className="da-plan-txt-petit" fill="#1E1C19">
        <text x="30" y="484">0</text>
        <text x="130" y="484" textAnchor="end">100 cm</text>
      </g>
      <g transform="translate(624 60)" className="da-plan-nord" fill="#1E1C19" textAnchor="middle" fontSize="11">
        <path d="M0 22 L6 36 L0 32 L-6 36 Z" />
        <text x="0" y="16">N</text>
      </g>
    </svg>
  );
}
