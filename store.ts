import fs from 'fs';
import path from 'path';

type TokenRecord = {
  token: string;
  email: string;

  usage: Record<string, number>;
};

type StoreSchema = {
  tokens: TokenRecord[];
};

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

function ensureStore(): StoreSchema {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(STORE_FILE)) {
    const initial: StoreSchema = { tokens: [] };
    fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  const txt = fs.readFileSync(STORE_FILE, 'utf8') || '{}';
  try {
    return JSON.parse(txt) as StoreSchema;
  } catch {
    const initial: StoreSchema = { tokens: [] };
    fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

function saveStore(store: StoreSchema) {
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
}

export function createTokenRecord(token: string, email: string) {
  const store = ensureStore();
  const rec: TokenRecord = { token, email, usage: {} };
  store.tokens.push(rec);
  saveStore(store);
  return rec;
}

export function findToken(token: string): TokenRecord | null {
  const store = ensureStore();
  return store.tokens.find(t => t.token === token) || null;
}

export function incrementUsage(token: string, date: string, words: number): boolean {
  const store = ensureStore();
  const rec = store.tokens.find(t => t.token === token);
  if (!rec) return false;
  rec.usage[date] = (rec.usage[date] || 0) + words;
  saveStore(store);
  return true;
}

export function getUsageForDate(token: string, date: string): number {
  const rec = findToken(token);
  if (!rec) return 0;
  return rec.usage[date] || 0;
}
