import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'crypto';
import { createTokenRecord, findToken, incrementUsage, getUsageForDate } from './store';
import { justifyText } from './justify';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) :8080;
const WORDS_LIMIT_PER_DAY = 80000;

app.use(helmet());

app.use(rateLimit({
    windowMs: 5* 60 * 1000,// Config Minutes // 5 minutes 
    max: 100,
    handler: (req, res) => {
        res.status(429).json({
            error: 'limite de requêtes atteint :  100 requests max'
        });
    }
}));


app.use(express.json());
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send('connexion à l\'API');
});

app.post('/api/token', (req, res) => {
  const body = req.body;
  if (!body || typeof body.email !== 'string') {
    return res.status(400).json({ error: 'body must be JSON with an "email" field' });
  }
  const token = randomUUID();
  createTokenRecord(token, body.email);
  return res.json({ token });
});

function extractToken(req: express.Request): string | null {
  const auth = req.header('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7);
  }
  const key = req.header('x-api-key');
  if (key) return key;
  return null;
}

app.post('/api/justify', express.text({ type: 'text/plain', limit: '1mb' }), (req, res) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'erreur de token (Authorization: Bearer <token> or x-api-key)' });

  const rec = findToken(token);
  if (!rec) return res.status(401).json({ error: 'token Invalide' });

  const bodyText = req.body as string | undefined;
  if (typeof bodyText !== 'string') {
    return res.status(400).json({ error: 'mauvaise requête: le corps doit être un texte brut' });
  }

  // Config du nombre de mots
  const words = bodyText.trim().split(/\s+/).filter(Boolean);
  const incomingWords = words.length;

  // Config de la date
  const now = new Date();
  const dateKey = now.toISOString().slice(0, 10); 

  const usedToday = getUsageForDate(token, dateKey);
  if (usedToday + incomingWords > WORDS_LIMIT_PER_DAY) {

    // depassement de la limite
    return res.status(402).json({
      error: 'Payement requise: depassement de la limite quotidienne de mots justifiés',
      limit: WORDS_LIMIT_PER_DAY,
      usedToday,
      incomingWords
    });
  }

  //incrementation de l'utilisation du token 
  incrementUsage(token, dateKey, incomingWords);

  const justified = justifyText(bodyText, 80);
  res.setHeader('Content-Type', 'text/plain');
  return res.status(200).send(justified);
});

app.post('/', (_req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send('Hello bienvenue sur mon serveur');
});

app.listen(PORT, () => {
  console.log(`Bienvenue sur le server !Hop attention, il vous écoute sur le port ${PORT}
  `);
});
