// @ts-ignore
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const dbPath = process.env.DATABASE_PATH || path.resolve(process.cwd(), 'data', 'submissions.db');

const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

export interface ContactSubmission {
  id?: number;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
}

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`);

export function insertSubmission(name: string, email: string, message: string): ContactSubmission {
  const createdAt = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO contact_submissions (name, email, message, createdAt)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(name, email, message, createdAt);
  return {
    id: Number(result.lastInsertRowid),
    name,
    email,
    message,
    createdAt
  };
}

export function getAllSubmissions(): ContactSubmission[] {
  const stmt = db.prepare(`
    SELECT * FROM contact_submissions ORDER BY id DESC
  `);
  return stmt.all() as unknown as ContactSubmission[];
}

export { db };
