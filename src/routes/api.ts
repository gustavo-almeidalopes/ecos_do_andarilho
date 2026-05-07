// =============================================
// ROTAS DE API — REST Endpoints
// =============================================

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Avaliacao, ScoreEntry } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const DATA_DIR = path.join(__dirname, '..', '..', 'data');

// Score em memória (easter egg das moedas)
let totalCoinsCollected = 0;
let totalScore = 0;

/**
 * Gera um ID único simples
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

/**
 * Lê um arquivo JSON do diretório data/
 */
function readJSON<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return [] as unknown as T;
  }
}

/**
 * Escreve dados num arquivo JSON no diretório data/
 */
function writeJSON<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ─────────────────────────────────────────────
// POST /api/avaliacoes — Submeter avaliação
// ─────────────────────────────────────────────
router.post('/avaliacoes', (req: Request, res: Response) => {
  const { feedback } = req.body as { feedback?: string };

  if (!feedback || typeof feedback !== 'string' || feedback.trim().length === 0) {
    res.status(400).json({
      success: false,
      message: 'O campo "feedback" é obrigatório e não pode estar vazio.',
    });
    return;
  }

  if (feedback.trim().length > 5000) {
    res.status(400).json({
      success: false,
      message: 'O feedback não pode exceder 5000 caracteres.',
    });
    return;
  }

  const avaliacoes = readJSON<Avaliacao[]>('avaliacoes.json');

  const novaAvaliacao: Avaliacao = {
    id: generateId(),
    feedback: feedback.trim(),
    createdAt: new Date().toISOString(),
  };

  avaliacoes.push(novaAvaliacao);
  writeJSON('avaliacoes.json', avaliacoes);

  console.log(`✅ Nova avaliação recebida (ID: ${novaAvaliacao.id})`);

  res.status(201).json({
    success: true,
    message: 'Avaliação enviada com sucesso! Muito obrigado pelo feedback.',
    avaliacao: novaAvaliacao,
  });
});

// ─────────────────────────────────────────────
// GET /api/avaliacoes — Listar avaliações
// ─────────────────────────────────────────────
router.get('/avaliacoes', (_req: Request, res: Response) => {
  const avaliacoes = readJSON<Avaliacao[]>('avaliacoes.json');
  res.json({
    success: true,
    count: avaliacoes.length,
    avaliacoes,
  });
});

// ─────────────────────────────────────────────
// POST /api/score — Registrar pontuação (Easter Egg)
// ─────────────────────────────────────────────
router.post('/score', (req: Request, res: Response) => {
  const { score } = req.body as { score?: number };

  if (typeof score !== 'number' || score <= 0) {
    res.status(400).json({
      success: false,
      message: 'Pontuação inválida.',
    });
    return;
  }

  totalCoinsCollected++;
  totalScore += score;

  console.log(`🪙 Moeda coletada! Total: ${totalCoinsCollected} | Score: ${totalScore}`);

  res.json({
    success: true,
    totalCoins: totalCoinsCollected,
    totalScore,
  });
});

// ─────────────────────────────────────────────
// GET /api/stats — Estatísticas do site
// ─────────────────────────────────────────────
router.get('/stats', (_req: Request, res: Response) => {
  const avaliacoes = readJSON<Avaliacao[]>('avaliacoes.json');

  res.json({
    success: true,
    stats: {
      coinsCollected: totalCoinsCollected,
      totalScore,
      avaliacoes: avaliacoes.length,
    },
  });
});

export { router as apiRouter };
