// Contenu de la page « Notre histoire ». Le texte est repris à l'identique de la page actuelle (/a-propos).
// Il sert aux versions d'aperçu (app/a-propos/versions/*) ; la page /a-propos n'est pas modifiée.

// Un segment est un morceau de texte ; [texte, true] = mis en valeur (gras).
export type Segment = [string, boolean?];
export type Paragraphe = Segment[];

const histoireParagraphes: Paragraphe[] = [
  [["MAISON SERENIA voit le jour en 2024, à Genève, d'une frustration simple : les plus belles pièces de design — celles qui transforment une pièce en un lieu où l'on se sent bien — restaient trop souvent inaccessibles, réservées à quelques intérieurs d'exception."]],
  [
    ['Nous avons voulu changer cela. Non pas en produisant toujours plus, mais en '],
    ['choisissant mieux', true],
    ['. Nous parcourons les ateliers, les tendances et les savoir-faire pour composer une sélection resserrée : des pièces sculpturales, au caractère affirmé, pensées pour traverser les années plutôt que les saisons.'],
  ],
  [
    ["Notre nom dit déjà l'essentiel. "],
    ['SERENIA', true],
    [", c'est la sérénité — cette sensation rare d'un intérieur juste, apaisé, qui vous ressemble. Et "],
    ['MAISON', true],
    [', parce que nous ne vendons pas des objets : nous aidons à bâtir un foyer.'],
  ],
];

export const APROPOS = {
  retour: "Retour à l'accueil",
  accroche: 'Genève · Depuis 2024',
  titre: "L'art de vivre, en toute sérénité.",
  intro: "MAISON SERENIA est née d'une conviction : un intérieur au design fort ne devrait pas être un privilège. Voici notre histoire.",

  histoire: {
    kicker: 'Notre histoire',
    titre: 'Tout commence à Genève',
    paragraphes: histoireParagraphes,
  },

  citation: "« Un bel objet ne se contente pas de remplir une pièce. Il la rend vivante, et un peu plus sereine chaque jour. »",
  citationAuteur: 'La maison Serenia',

  signature: {
    kicker: 'Notre signature',
    titre: 'La collection Bubble',
    paragraphes: [
      "Si une pièce devait résumer notre maison, ce serait elle. Avec ses formes rondes et enveloppantes, la collection Bubble incarne tout ce que nous aimons : l'audace du design, le confort absolu, et cette présence sculpturale qui attire le regard dès qu'on entre dans la pièce.",
      "Déclinée en une palette de couleurs franches, elle est devenue l'emblème de MAISON SERENIA — la preuve qu'un meuble peut être une œuvre.",
    ],
    lien: 'Découvrir la collection',
    lienHref: '/collections/bubble',
    image: '/catalog/j9h5SNVC.jpg',
    alt: 'Collection Bubble — MAISON SERENIA',
  },

  valeursKicker: 'Ce qui nous guide',
  valeursTitre: 'Nos valeurs',
  valeurs: [
    {
      titre: 'Qualité exigeante',
      texte: "Chaque pièce est sélectionnée selon des critères stricts de matière, de finition et de durabilité. Jamais de compromis sur l'essentiel.",
    },
    {
      titre: 'Design affirmé',
      texte: 'Des formes qui durent plutôt que des modes qui passent. Nous choisissons le caractère, l’allure et l’émotion.',
    },
    {
      titre: 'Service attentionné',
      texte: 'De la sélection à la livraison, chaque détail est pensé pour vous. Une équipe disponible, à l’écoute, humaine.',
    },
  ],

  engagementsTitre: 'Nos engagements',
  engagements: [
    { titre: 'Sélection responsable', texte: 'Des pièces pensées pour durer, à contre-courant du mobilier jetable.' },
    { titre: 'Transparence totale', texte: 'Tarifs clairs, fiches détaillées, conditions de retour explicites. Aucune surprise.' },
    { titre: 'Satisfaction garantie', texte: 'Service client réactif, remboursement rapide.' },
    { titre: 'Des pièces qui durent', texte: 'Des designs intemporels pour un intérieur qui évolue avec vous.' },
  ],

  ctaTitre: "Composez l'intérieur qui vous ressemble",
  ctaTexte: 'Parcourez notre sélection et laissez entrer la sérénité chez vous.',
  ctaPrincipal: { texte: "Retourner à l'accueil", href: '/' },
  ctaSecondaire: { texte: 'Contactez-nous', href: '/contact' },
};
