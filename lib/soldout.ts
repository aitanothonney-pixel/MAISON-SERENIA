// Produits en rupture de stock.
//
// Ils restent visibles (fiche, collections) avec la mention « Rupture de stock », mais ne
// peuvent pas être achetés :
// - fiche produit : bouton d'ajout et bouton « Acheter » désactivés ;
// - panier (lib/useCart) : l'ajout est refusé ;
// - paiement (app/api/checkout) : refusé côté serveur, avant tout appel à Stripe ;
// - données structurées et flux Google Merchant : disponibilité « rupture ».
//
// Pour remettre un produit en vente, le retirer de cette liste.
export const SOLD_OUT_IDS: ReadonlySet<number> = new Set([87]);

export const isSoldOut = (id: number): boolean => SOLD_OUT_IDS.has(id);
