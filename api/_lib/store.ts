import fs from 'node:fs';
import path from 'node:path';

export interface ShowreelConfig {
  title: string;
  eyebrow?: string;
  duration: string;
  description: string;
  video: string;
  poster: string;
  visible: boolean;
  aspectRatio?: string;
}

export const defaultShowreel: ShowreelConfig = {
  title: "SHOWREEL / 2026",
  eyebrow: "02 / SHOWCASE",
  duration: "01:24",
  description: "A curated edit of commercial direction, dynamic motion graphics, kinetic typography, and post-production finishing.",
  video: "/reel/showreel.mp4",
  poster: "/reel/showreel-poster.jpg",
  visible: true,
  aspectRatio: "16/9"
};

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
    mediaType?: string;
    imageDimensions?: { width: number; height: number };
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

function getShowreelPaths(): string[] {
  const cwd = process.cwd();
  return [
    path.join(cwd, 'data', 'showreel.json'),
    path.join(cwd, 'src', 'data', 'showreel.json')
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
 * Normalizes a Supabase project URL to its pure root origin (e.g. https://xyz.supabase.co)
 * regardless of whether the user provided:
 * - https://xyz.supabase.co
 * - https://xyz.supabase.co/
 * - https://xyz.supabase.co/rest/v1
 * - https://xyz.supabase.co/rest/v1/
 * - https://xyz.supabase.co/rest
 * - or included any trailing whitespace or path segments.
 */
export function normalizeSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  // Strip trailing slashes
  url = url.replace(/\/+$/, '');
  // Strip any /rest/v1, /rest, or /storage/v1 suffixes that may have been copied from dashboard
  url = url.replace(/\/(rest(\/v1)?|storage(\/v1)?).*$/i, '');
  return url.replace(/\/+$/, '');
}

/**
 * Optional Supabase client helper using standard fetch
 */
function getSupabaseConfig() {
  const rawUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (rawUrl && key) {
    const url = normalizeSupabaseUrl(rawUrl);
    return { url, key: key.trim() };
  }
  return null;
}

async function fetchFromSupabase(endpoint: string, options: RequestInit = {}): Promise<any> {
  const sb = getSupabaseConfig();
  if (!sb) return null;

  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const targetUrl = `${sb.url}/rest/v1/${cleanEndpoint}`;

  const res = await fetch(targetUrl, {
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
    console.error(`[Supabase Error] HTTP ${res.status} on ${targetUrl}:`, errorText);
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
        ? 'projects?select=*&id=neq.__showreel_config__&order=%22order%22.asc'
        : 'projects?select=*&id=neq.__showreel_config__&published=eq.true&order=%22order%22.asc';
      const remote = await fetchFromSupabase(query);
      if (Array.isArray(remote) && remote.length > 0) {
        return remote
          .filter((r: any) => r.id !== '__showreel_config__')
          .map(fromDbRecord);
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
          let sorted = list
            .filter((p) => p.id !== '__showreel_config__')
            .sort((a, b) => (a.order || 999) - (b.order || 999));
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
  const cleanProjects = projects.filter((p) => p.id !== '__showreel_config__');
  const normalized = cleanProjects.map((p, idx) => ({
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
  if (id === '__showreel_config__') return false;

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
  const cleanOrderedIds = orderedIds.filter((id) => id !== '__showreel_config__');
  const projectMap = new Map(current.filter((p) => p.id !== '__showreel_config__').map((p) => [p.id, p]));

  const reordered: ProjectData[] = [];
  cleanOrderedIds.forEach((id, idx) => {
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

/**
 * Fetch dynamic showreel configuration from Supabase or local file
 */
export async function getShowreel(): Promise<ShowreelConfig> {
  const sb = getSupabaseConfig();
  if (sb) {
    try {
      const records = await fetchFromSupabase('projects?id=eq.__showreel_config__');
      if (Array.isArray(records) && records.length > 0) {
        const r = records[0];
        const caseStudy = typeof r.case_study === 'string'
          ? JSON.parse(r.case_study)
          : (r.case_study || {});
        return {
          title: r.title || defaultShowreel.title,
          eyebrow: r.sub_category || caseStudy.eyebrow || defaultShowreel.eyebrow,
          duration: r.year || caseStudy.duration || defaultShowreel.duration,
          description: r.description || defaultShowreel.description,
          video: r.video || defaultShowreel.video,
          poster: r.poster || defaultShowreel.poster,
          visible: r.published !== false,
          aspectRatio: r.aspect_ratio || defaultShowreel.aspectRatio
        };
      }
    } catch (e) {
      console.warn('[Store] Supabase showreel fetch failed, reading from local fallback:', e);
    }
  }

  const paths = getShowreelPaths();
  for (const filePath of paths) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        return { ...defaultShowreel, ...JSON.parse(raw) };
      }
    } catch (err) {
      console.error(`[Store] Error reading showreel from ${filePath}:`, err);
    }
  }

  return defaultShowreel;
}

/**
 * Save dynamic showreel configuration to Supabase and local file
 */
export async function saveShowreel(updates: Partial<ShowreelConfig>): Promise<ShowreelConfig> {
  const current = await getShowreel();
  const merged: ShowreelConfig = {
    title: (updates.title ?? current.title ?? defaultShowreel.title).trim(),
    eyebrow: (updates.eyebrow ?? current.eyebrow ?? defaultShowreel.eyebrow ?? '02 / SHOWCASE').trim(),
    duration: (updates.duration ?? current.duration ?? defaultShowreel.duration).trim(),
    description: (updates.description ?? current.description ?? defaultShowreel.description).trim(),
    video: (updates.video ?? current.video ?? '').trim(),
    poster: (updates.poster ?? current.poster ?? defaultShowreel.poster).trim(),
    visible: updates.visible !== undefined ? updates.visible : current.visible,
    aspectRatio: updates.aspectRatio || current.aspectRatio || '16/9'
  };

  // 1. Sync to Supabase if configured
  const sb = getSupabaseConfig();
  if (sb) {
    const dbRecord = {
      id: '__showreel_config__',
      slug: 'showreel-config',
      title: merged.title,
      category: 'Showreel',
      sub_category: merged.eyebrow || '02 / SHOWCASE',
      year: merged.duration || '01:24',
      client: 'Showcase',
      description: merged.description,
      video: merged.video,
      poster: merged.poster || defaultShowreel.poster,
      thumbnail: merged.poster || defaultShowreel.poster,
      aspect_ratio: merged.aspectRatio || '16/9',
      published: merged.visible !== false,
      featured: false,
      order: 0,
      tags: ['Showreel'],
      case_study: {
        eyebrow: merged.eyebrow,
        duration: merged.duration,
        visible: merged.visible,
        aspectRatio: merged.aspectRatio
      },
      updated_at: new Date().toISOString()
    };

    await fetchFromSupabase('projects?on_conflict=id', {
      method: 'POST',
      headers: { 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify(dbRecord)
    });
  }

  // 2. Safe local file write
  const paths = getShowreelPaths();
  for (const filePath of paths) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf8');
    } catch {
      // Ignore in read-only serverless environment
    }
  }

  return merged;
}
