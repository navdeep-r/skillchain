import fs from 'fs/promises';
import path from 'path';
import { Credential } from '../types';

// In a production environment, use PostgreSQL or MongoDB.
// For this MVP, we use a local JSON file to persist data across server restarts.

const DB_PATH = path.join((process as any).cwd(), 'data', 'db.json');

// Ensure data directory exists
async function ensureDB() {
  try {
    await fs.access(DB_PATH);
  } catch {
    const dir = path.dirname(DB_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify({ credentials: [] }, null, 2));
  }
}

export async function getCredentials(studentAddress?: string): Promise<Credential[]> {
  await ensureDB();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  if (studentAddress) {
    return db.credentials.filter((c: Credential) => 
      c.studentAddress.toLowerCase() === studentAddress.toLowerCase()
    );
  }
  return db.credentials;
}

export async function addCredential(credential: Credential): Promise<void> {
  await ensureDB();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  db.credentials.push(credential);
  
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}