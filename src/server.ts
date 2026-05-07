// =============================================
// SERVER PRINCIPAL — Ecos do Andarilho
// Node.js + TypeScript + Express + EJS
// =============================================

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { pagesRouter } from './routes/pages.js';
import { apiRouter } from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ── View Engine ──────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// ── Middleware ────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Servir documentacao.html da raiz do projeto
app.use('/documentacao.html', express.static(path.join(__dirname, '..', 'documentacao.html')));

// Contador de visitas (em memória — reseta ao reiniciar)
let visitCount = 0;

app.use((req, res, next) => {
  if (req.path === '/' && req.method === 'GET') {
    visitCount++;
  }
  res.locals.visitCount = visitCount;
  next();
});

// ── Rotas ────────────────────────────────────
app.use('/', pagesRouter);
app.use('/api', apiRouter);

// ── 404 Handler ──────────────────────────────
app.use((_req, res) => {
  res.status(404).send(`
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:'Press Start 2P',monospace;background:#3B82F6;color:#FFF;text-align:center;flex-direction:column;gap:20px;">
      <h1 style="font-size:48px;">404</h1>
      <p>Página não encontrada!</p>
      <a href="/" style="color:#FDE047;">← Voltar ao início</a>
    </div>
  `);
});

// ── Iniciar Servidor ─────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('🎮 ═══════════════════════════════════════');
  console.log('   ECOS DO ANDARILHO — Servidor Ativo');
  console.log(`   🌐 http://localhost:${PORT}`);
  console.log('   📦 Node.js + TypeScript + Express');
  console.log('🎮 ═══════════════════════════════════════');
  console.log('');
});

export default app;
