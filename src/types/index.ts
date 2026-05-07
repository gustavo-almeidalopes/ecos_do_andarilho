// =============================================
// TIPOS DO PROJETO — Ecos do Andarilho
// =============================================

export interface Character {
  id: string;
  name: string;
  className: string;
  quote: string;
  lore: string;
  color: string;
  borderColor: string;
  image: string;
  parallaxSpeed: string;
}

export interface Milestone {
  phase: string;
  title: string;
  description: string;
  active: boolean;
  parallaxSpeed: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  defaultActive?: boolean;
}

export interface Developer {
  name: string;
  role: string;
  description: string;
  image: string;
  github: string;
}

export interface GalleryWorld {
  title: string;
  description: string;
  bgClass: string;
  parallaxSpeed: string;
}

export interface Avaliacao {
  id: string;
  feedback: string;
  createdAt: string;
}

export interface ScoreEntry {
  id: string;
  score: number;
  createdAt: string;
}

export interface SiteStats {
  visits: number;
  coinsCollected: number;
  totalScore: number;
  avaliacoes: number;
}

// Tipo para os dados passados ao template EJS
export interface PageData {
  characters: Character[];
  roadmap: Milestone[];
  faq: FaqItem[];
  devs: Developer[];
  gallery: GalleryWorld[];
  avaliacoes: Avaliacao[];
  visitCount: number;
  stats: SiteStats;
}
