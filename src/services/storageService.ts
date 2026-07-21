import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface ReportInputs {
  country?: string;
  techDomain?: string;
  depth?: string;
  focusLens?: string;
  prompt?: string;
}

export interface ReportVersion {
  id: string;
  versionNumber: number;
  createdAt: number;
  content: any; // Mocked content
  comments?: Record<string, string[]>; // Maps block IDs/offsets to an array of comment text
  rating?: number;
  flagged?: boolean;
}

export interface ReportThread {
  id: string;
  title: string;
  typeId: string; // e.g. techLandscape
  inputs: ReportInputs;
  versions: ReportVersion[];
  createdAt: number;
  updatedAt: number;
  status: "completed" | "generating" | "failed" | "partial";
  isPinned?: boolean;
}

interface M42DB extends DBSchema {
  threads: {
    key: string;
    value: ReportThread;
    indexes: { 'by-date': number };
  };
}

let dbPromise: Promise<IDBPDatabase<M42DB>> | null = null;

if (typeof window !== 'undefined') {
  dbPromise = openDB<M42DB>('m42-reports-db', 1, {
    upgrade(db) {
      const store = db.createObjectStore('threads', { keyPath: 'id' });
      store.createIndex('by-date', 'updatedAt');
    },
  });
}

export const storageService = {
  async getThreads(): Promise<ReportThread[]> {
    if (!dbPromise) return [];
    const db = await dbPromise;
    const threads = await db.getAllFromIndex('threads', 'by-date');
    return threads.sort((a, b) => b.updatedAt - a.updatedAt);
  },
  async getThread(id: string): Promise<ReportThread | undefined> {
    if (!dbPromise) return undefined;
    const db = await dbPromise;
    return db.get('threads', id);
  },
  async saveThread(thread: ReportThread): Promise<void> {
    if (!dbPromise) return;
    const db = await dbPromise;
    await db.put('threads', thread);
  },
  async deleteThread(id: string): Promise<void> {
    if (!dbPromise) return;
    const db = await dbPromise;
    await db.delete('threads', id);
  }
};
