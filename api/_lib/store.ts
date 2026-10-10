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
    return null;
  }
  return res.json();
}

/**
 * Load projects from disk or Supabase
 */
export async function getProjects(includeDrafts = false): Promise<ProjectData[]> {
  // 1. Try Supabase if configured
  const sb = getSupabaseConfig();
  if (sb) {
    try {
      const query = includeDrafts
        ? 'projects?select=*&order=order.asc'
        : 'projects?select=*&published=eq.true&order=order.asc';
      const remote = await fetchFromSupabase(query);
      if (Array.isArray(remote) && remote.length > 0) {
        return remote.map((item: any) => ({
          ...item,
          caseStudy: typeof item.caseStudy === 'string' ? JSON.parse(item.caseStudy) : item.caseStudy
        }));
      }
    } catch (e) {
      console.warn('[Store] Supabase fetch failed, falling back to local database:', e);
    }
  }

  // 2. Read from local persistent database file
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
  // Normalize orders
  const normalized = projects.map((p, idx) => ({
    ...p,
    order: p.order !== undefined ? p.order : idx + 1,
    published: p.published !== undefined ? p.published : true
  }));

  // 1. Write to local database paths
  const paths = getDbPaths();
  let savedLocal = false;
  for (const filePath of paths) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2), 'utf8');
      savedLocal = true;
    } catch (err) {
      console.error(`[Store] Error writing to ${filePath}:`, err);
    }
  }

  // 2. Sync to Supabase if configured
  const sb = getSupabaseConfig();
  if (sb) {
    try {
      // Upsert projects into Supabase table
      for (const p of normalized) {
        await fetchFromSupabase('projects', {
          method: 'POST',
          headers: { 'Prefer': 'resolution=merge-duplicates' },
          body: JSON.stringify({
            ...p,
            caseStudy: typeof p.caseStudy === 'object' ? JSON.stringify(p.caseStudy) : p.caseStudy
          })
        });
      }
    } catch (e) {
      console.warn('[Store] Supabase sync error:', e);
    }
  }

  return savedLocal;
}

/**
 * Create a new project
 */
export async function createProject(data: Partial<ProjectData>): Promise<ProjectData> {
  const current = await getProjects(true);

  const slug = (data.title || 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const newProject: ProjectData = {
    id: data.id || `proj-${Date.now()}`,
    slug: slug || `project-${Date.now()}`,
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

  current.push(newProject);
  await saveProjects(current);
  return newProject;
}

/**
 * Update existing project
 */
export async function updateProject(id: string, updates: Partial<ProjectData>): Promise<ProjectData | null> {
  const current = await getProjects(true);
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = current[index];
  const newPublished = (updates as any).status !== undefined
    ? (updates as any).status === 'published'
    : (updates.published !== undefined ? updates.published : existing.published);

  const updated: ProjectData = {
    ...existing,
    ...updates,
    published: newPublished,
    id: existing.id, // Preserve ID
    slug: updates.title ? updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : existing.slug,
    caseStudy: {
      ...existing.caseStudy,
      ...(updates.caseStudy || {})
    }
  };

  current[index] = updated;
  await saveProjects(current);
  return updated;
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<boolean> {
  const current = await getProjects(true);
  const filtered = current.filter((p) => p.id !== id);
  if (filtered.length === current.length) return false;

  await saveProjects(filtered);
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

  // Append any remaining
  for (const remaining of projectMap.values()) {
    remaining.order = reordered.length + 1;
    reordered.push(remaining);
  }

  await saveProjects(reordered);
  return reordered;
}
