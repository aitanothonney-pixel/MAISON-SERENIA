import type { Paragraphe } from '@/lib/a-propos-contenu';

// Affiche un paragraphe dont certains mots sont mis en valeur (gras).
export function Texte({ segments }: { segments: Paragraphe }) {
  return (
    <p>
      {segments.map(([texte, gras], i) =>
        gras ? (
          <strong key={i} className="font-medium text-black">
            {texte}
          </strong>
        ) : (
          <span key={i}>{texte}</span>
        ),
      )}
    </p>
  );
}
