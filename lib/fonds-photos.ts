// Couleurs du fond haut et bas de la première photo des canapés en paysage (affichage « contain »).
// Dans les cartes de collection, elles prolongent le fond autour du canapé : le canapé est entier,
// sans bande blanche. À régénérer si la première photo d'un de ces produits change.
// zoom : agrandissement de la première photo dans la carte, pour les photos où le canapé est petit dans le cadre.
export const FONDS_PHOTOS: Record<number, { haut: string; bas: string; zoom?: number }> = {
  89: { haut: '#ebd2be', bas: '#ecd3c0' },
  90: { haut: '#dfcec0', bas: '#e4d2c3' },
  91: { haut: '#e9ceba', bas: '#ecd2be' },
  92: { haut: '#c9b2a1', bas: '#d6c2b4' },
  93: { haut: '#d2c5b7', bas: '#d4c6b9' },
  95: { haut: '#d4b7a2', bas: '#d8baa4' },
  96: { haut: '#ddc8b7', bas: '#e2cebe' },
  98: { haut: '#d8c5b4', bas: '#e0d2c5' },
  99: { haut: '#e2d4c9', bas: '#e5d7cd' },
  113: { haut: '#fefefe', bas: '#fefefe', zoom: 1.2 },
  114: { haut: '#dfd6ce', bas: '#ded3cb' },
};
