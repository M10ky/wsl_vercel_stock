// types/index.ts
export type Profile = {
  id: string;
  name: string;
  role: 'Administrateur' | 'Support IT' | 'Responsable Finance' | 'Utilisateur IT' | 'Utilisateur Finance';
  dept: 'IT' | 'Finance' | 'both';
  is_active: boolean;
  color?: string;
};

export type Product = {
  id: string;
  nom: string;
  categorie: string;
  dept: 'IT' | 'Finance';
  stock: number;
  seuil: number;
  prix: number;
  created_at?: string;
  updated_at?: string;
};

export type Mouvement = {
  id: string;
  date: string;
  type: 'Entrée' | 'Sortie';
  produit_id: string;
  produit_nom: string;
  qty: number;
  valeur: number;
  dept: string;
  user_name: string;
  user_id?: string;
  destination?: string;
  observation?: string;
  created_at?: string;
};

export type Demande = {
  id: string;
  date: string;
  demandeur: string;
  demandeur_id?: string;
  produit: string;
  qty: number;
  dest?: string;
  motif: string;
  statut: 'En attente' | 'Validé' | 'Refusé';
  valideur?: string;
  valideur_id?: string;
  dept: string;
  created_at?: string;
  updated_at?: string;
};

export type Parametre = {
  id?: string;
  cle: 'destinations' | 'categoriesIT' | 'categoriesFin';
  valeur: string;
};

export type Params = {
  destinations: string[];
  categoriesIT: string[];
  categoriesFin: string[];
};