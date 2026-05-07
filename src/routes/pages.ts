// =============================================
// ROTAS DE PÁGINAS — Renderização EJS
// =============================================

import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Character, Milestone, FaqItem, Developer, GalleryWorld, Avaliacao, SiteStats } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Caminho base para os dados
const DATA_DIR = path.join(__dirname, '..', '..', 'data');

/**
 * Carrega um arquivo JSON tipado do diretório data/
 */
function loadJSON<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`❌ Erro ao carregar ${filename}:`, error);
    return [] as unknown as T;
  }
}

/**
 * GET / — Página principal com todos os dados dinâmicos
 */
router.get('/', (req, res) => {
  const characters = loadJSON<Character[]>('characters.json');
  const roadmap = loadJSON<Milestone[]>('roadmap.json');
  const faq = loadJSON<FaqItem[]>('faq.json');
  const devs = loadJSON<Developer[]>('devs.json');
  const gallery = loadJSON<GalleryWorld[]>('gallery.json');
  const avaliacoes = loadJSON<Avaliacao[]>('avaliacoes.json');

  const stats: SiteStats = {
    visits: res.locals.visitCount as number,
    coinsCollected: 0,
    totalScore: 0,
    avaliacoes: avaliacoes.length,
  };

  res.render('index', {
    characters,
    roadmap,
    faq,
    devs,
    gallery,
    avaliacoes,
    visitCount: res.locals.visitCount,
    stats,
  });
});

export { router as pagesRouter };
