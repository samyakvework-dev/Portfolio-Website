import fs from 'node:fs';
import path from 'node:path';

export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  category: string;
  subCategory?: string;
  year: string;
  client: string;
  description: string;
  video?: string;
  poster: string;
  thumbnail?: string;
  aspectRatio: string;
  featured?: boolean;
  order?: number;
  published?: boolean;
  tags: string[];
  caseStudy: {
    role: string[];
    challenge: string;
    concept: string;
    motionSystem: string;
    results: string;
    stills?: string[];
    credits?: { role: string; name: string }[];
  };
}

// Locate local projects database path (handles root or api execution paths)
function getDbPaths(): string[] {
  const cwd = process.cwd();
  return [
    path.join(cwd, 'data', 'projects.json'),
    path.join(cwd, 'src', 'data', 'projects.json')
  ];
}

/**
 * Maps TypeScript camelCase ProjectData to PostgreSQL snake_case columns
 * as defined in supabase/schema.sql
 */
export function toDbRecord(p: ProjectData): Record<string, any> {
  const slug = p.slug || (p.title || 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  return {
    id: p.id,
    slug: slug || `project-${Date.now()}`,
    title: (p.title || 'Untitled Project').trim(),
    category: p.category || 'Video Editing',
    sub_category: p.subCategory || '',
    year: p.year || new Date().getFullYear().toString(),
    client: p.client || 'Commission',
    description: (p.description || '').trim(),
    video: p.video || '',
    poster: p.poster || p.thumbnail || '/projects/project-01/poster.jpg',
    thumbnail: p.thumbnail || p.poster || '/projects/project-01/poster.jpg',
    aspect_ratio: p.aspectRatio || '16/9',
    featured: Boolean(p.featured),
    order: typeof p.order === 'number' ? p.order : 1,
    published: p.published !== false,
    tags: Array.isArray(p.tags) ? p.tags : [],
    case_study: typeof p.caseStudy === 'object' && p.caseStudy !== null
      ? p.caseStudy
      : {
          role: ['Creative'],
          challenge: '',
          concept: '',
          motionSystem: '',
          results: '',
          credits: []
        },
    updated_at: new Date().toISOString()
  };
}

/**
 * Maps PostgreSQL snake_case records back to TypeScript camelCase ProjectData
 */
export function fromDbRecord(record: any): ProjectData {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    category: record.category,
    subCategory: record.sub_category || record.subCategory || '',
    year: record.year || '',
    client: record.client || '',
    description: record.description || '',
    video: record.video || '',
    poster: record.poster || '',
    thumbnail: record.thumbnail || record.poster || '',
    aspectRatio: record.aspect_ratio || record.aspectRatio || '16/9',
    featured: Boolean(record.featured),
    order: typeof record.order === 'number' ? record.order : 1,
    published: record.published !== false,
    tags: Array.isArray(record.tags) ? record.tags : [],
    caseStudy: typeof record.case_study === 'string'
      ? JSON.parse(record.case_study)
      : (record.case_study || record.caseStudy || {
          role: ['Creative'],
          challenge: '',
          concept: '',
          motionSystem: '',
          results: '',
          credits: []
        })
  };
}

/**
 * Optional Supabase client helper using standard fetch
 */
function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (url && key) {
    return { url: url.replace(/\/$/, ''), key };
  }
  return null;
}

async function fetchFromSupabase(endpoint: string, options: RequestInit = {}): Promise<any> {
  const sb = getSupabaseConfig();
  if (!sb) return null;

  const res = await fetch(`${sb.url}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      'apikey': sb.key,
      'Authorization': `Bearer ${sb.key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('[Supabase Error]', res.status, errorText);
    throw new Error(`Database error (HTTP ${res.status}): ${errorText}`);
  }

  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Load projects from disk or Supabase.
 * If Supabase is connected but has 0 records, gracefully displays bundled placeholder
 * projects on the frontend WITHOUT inserting them into Supabase.
 */
export async function getProjects(includeDrafts = false): Promise<ProjectData[]> {
  const sb = getSupabaseConfig();
  if (sb) {
    try {
      const query = includeDrafts
        ? 'projects?select=*&order=%22order%22.asc'
        : 'projects?select=*&published=eq.true&order=%22order%22.asc';
      const remote = await fetchFromSupabase(query);
      if (Array.isArray(remote) && remote.length > 0) {
        return remote.map(fromDbRecord);
      }
    } catch (e) {
      console.warn('[Store] Supabase fetch failed, falling back to local database:', e);
    }
  }

  // Fallback to local files if Supabase is offline or table is empty
  const paths = getDbPaths();
  for (const filePath of paths) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const list: ProjectData[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          let sorted = list.sort((a, b) => (a.order || 999) - (b.order || 999));
          if (!includeDrafts) {
            sorted = sorted.filter((p) => p.published !== false);
          }
          return sorted;
        }
      }
    } catch (err) {
      console.error(`[Store] Error reading from ${filePath}:`, err);
    }
  }

  return [];
}

/**
 * Save projects list to persistent local files and Supabase
 */
export async function saveProjects(projects: ProjectData[]): Promise<boolean> {
  const normalized = projects.map((p, idx) => ({
    ...p,
    order: p.order !== undefined ? p.order : idx + 1,
    published: p.published !== undefined ? p.published : true
  }));

  // 1. Sync to Supabase if configured (throws if Supabase rejects)
  const sb = getSupabaseConfig();
  if (sb) {
    for (const p of normalized) {
      await fetchFromSupabase('projects?on_conflict=id', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify(toDbRecord(p))
      });
    }
  }

  // 2. Safe local file write (swallows errors in read-only serverless environments)
  saveLocalProjects(normalized);
  return true;
}

function saveLocalProjects(projects: ProjectData[]): void {
  const paths = getDbPaths();
  for (const filePath of paths) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(projects, null, 2), 'utf8');
    } catch {
      // Ignore write errors in read-only serverless environments
    }
  }
}

/**
 * Create a new project
 */
export async function createProject(data: Partial<ProjectData>): Promise<ProjectData> {
  const current = await getProjects(true);

  const rawSlug = (data.title || 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'project';

  let slug = data.slug || rawSlug;
  if (current.some((p) => p.slug === slug)) {
    slug = `${rawSlug}-${Date.now().toString().slice(-4)}`;
  }

  const newProject: ProjectData = {
    id: data.id || `proj-${Date.now()}`,
    slug,
    title: (data.title || 'Untitled Project').trim(),
    category: data.category || 'Video Editing',
    subCategory: data.subCategory || '',
    year: data.year || new Date().getFullYear().toString(),
    client: data.client || 'Commission',
    description: (data.description || '').trim(),
    video: data.video || '',
    poster: data.poster || '/projects/project-01/poster.jpg',
    thumbnail: data.thumbnail || data.poster || '/projects/project-01/poster.jpg',
    aspectRatio: data.aspectRatio || '16/9',
    featured: Boolean(data.featured),
    order: current.length + 1,
    published: (data as any).status === 'draft' ? false : (data.published !== false),
    tags: Array.isArray(data.tags) ? data.tags : [],
    caseStudy: data.caseStudy || {
      role: ['Creative'],
      challenge: '',
      concept: '',
      motionSystem: '',
      results: '',
      credits: []
    }
  };

  const sb = getSupabaseConfig();
  if (sb) {
    // Direct POST to Supabase table
    await fetchFromSupabase('projects', {
      method: 'POST',
      body: JSON.stringify(toDbRecord(newProject))
    });
  }

  current.push(newProject);
  saveLocalProjects(current);
  return newProject;
}

/**
 * Update existing project
 */
export async function updateProject(id: string, updates: Partial<ProjectData>): Promise<ProjectData | null> {
  const current = await getProjects(true);
  const index = current.findIndex((p) => p.id === id);

  const existing = index !== -1
    ? current[index]
    : {
        id,
        slug: `project-${Date.now()}`,
        title: updates.title || 'Untitled Project',
        category: updates.category || 'Video Editing',
        year: updates.year || new Date().getFullYear().toString(),
        client: updates.client || 'Commission',
        description: updates.description || '',
        poster: updates.poster || '/projects/project-01/poster.jpg',
        aspectRatio: updates.aspectRatio || '16/9',
        tags: [],
        caseStudy: { role: ['Creative'], challenge: '', concept: '', motionSystem: '', results: '' }
      } as ProjectData;

  const newPublished = (updates as any).status !== undefined
    ? (updates as any).status === 'published'
    : (updates.published !== undefined ? updates.published : existing.published);

  const updated: ProjectData = {
    ...existing,
    ...updates,
    published: newPublished,
    id: existing.id,
    slug: updates.slug || existing.slug || (updates.title ? updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : existing.id),
    caseStudy: {
      ...existing.caseStudy,
      ...(updates.caseStudy || {})
    }
  };

  const sb = getSupabaseConfig();
  if (sb) {
    // Upsert into Supabase table using merge-duplicates on conflict id
    await fetchFromSupabase('projects?on_conflict=id', {
      method: 'POST',
      headers: { 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify(toDbRecord(updated))
    });
  }

  if (index !== -1) {
    current[index] = updated;
  } else {
    current.push(updated);
  }
  saveLocalProjects(current);
  return updated;
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<boolean> {
  const sb = getSupabaseConfig();
  if (sb) {
    await fetchFromSupabase(`projects?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }

  const current = await getProjects(true);
  const filtered = current.filter((p) => p.id !== id);
  saveLocalProjects(filtered);
  return true;
}

/**
 * Reorder projects
 */
export async function reorderProjects(orderedIds: string[]): Promise<ProjectData[]> {
  const current = await getProjects(true);
  const projectMap = new Map(current.map((p) => [p.id, p]));

  const reordered: ProjectData[] = [];
  orderedIds.forEach((id, idx) => {
    const p = projectMap.get(id);
    if (p) {
      p.order = idx + 1;
      reordered.push(p);
      projectMap.delete(id);
    }
  });

  for (const remaining of projectMap.values()) {
    remaining.order = reordered.length + 1;
    reordered.push(remaining);
  }

  const sb = getSupabaseConfig();
  if (sb) {
    for (const p of reordered) {
      await fetchFromSupabase(`projects?id=eq.${encodeURIComponent(p.id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ order: p.order, updated_at: new Date().toISOString() })
      });
    }
  }

  saveLocalProjects(reordered);
  return reordered;
}
