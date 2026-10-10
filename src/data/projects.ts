/**
 * ============================================================================
 * SAMYAK MAHAJAN — PORTFOLIO PROJECT ARCHIVE & DATA TYPES
 * ============================================================================
 * 
 * Provides type definitions and initial static projects.
 * Also provides functions to fetch live project data from the persistent backend API.
 * ============================================================================
 */

import initialProjects from './projects.json';

export type AspectRatio = '16/9' | '9/16' | '4/3' | '1/1' | '2.39/1';
export type ProjectCategory = 'Video Editing' | 'Motion Graphics' | 'Graphic Design' | string;

export interface ProjectCaseStudy {
  role: string[];
  challenge: string;
  concept: string;
  motionSystem: string;
  results: string;
  stills?: string[];
  credits?: { role: string; name: string }[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  subCategory?: string;
  year: string;
  client: string;
  description: string;
  video?: string;          // Path in /public or URL
  poster: string;          // Path in /public or URL
  thumbnail?: string;      // Compatibility alias
  aspectRatio: AspectRatio;
  featured?: boolean;
  order?: number;
  published?: boolean;
  status?: string;
  tags: string[];
  caseStudy: ProjectCaseStudy;
}

export const CATEGORIES: { id: string; label: string; ratio?: string }[] = [
  { id: 'All', label: 'All Disciplines' },
  { id: 'Video Editing', label: 'Video Editing', ratio: '16:9 / 9:16' },
  { id: 'Motion Graphics', label: 'Motion Graphics', ratio: '16:9' },
  { id: 'Graphic Design', label: 'Graphic Design', ratio: 'Static / 4:3' }
];

// Initial projects from the persistent database
export const projects: Project[] = initialProjects as Project[];

export const showreelData = {
  title: "SHOWREEL",
  year: "2026",
  duration: "01:24",
  description: "A curated edit of commercial direction, dynamic motion graphics, kinetic typography, and post-production finishing.",
  video: "/reel/showreel.mp4",
  poster: "/reel/showreel-poster.jpg",
  aspectRatio: "16/9" as AspectRatio
};

/**
 * Fetch live projects from the persistent backend API.
 * Falls back gracefully to local bundled projects if offline or during build.
 */
export async function fetchLiveProjects(includeDrafts = false): Promise<Project[]> {
  try {
    const url = `/api/projects${includeDrafts ? '?all=true' : ''}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('samyak_admin_token') : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data.projects)) {
      return data.projects;
    }
  } catch (err) {
    // Graceful fallback to static projects
    console.debug('[Projects] Using static fallback projects:', err);
  }
  return initialProjects as Project[];
}
