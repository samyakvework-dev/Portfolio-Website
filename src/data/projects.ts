/**
 * ============================================================================
 * SAMYAK MAHAJAN — PORTFOLIO PROJECT ARCHIVE
 * ============================================================================
 * 
 * Centralized data source for all projects and case studies.
 * 
 * HOW TO ADD OR REPLACE PROJECTS IN VS CODE:
 * 1. Place your video and poster files in:
 *      public/projects/your-project-id/video.mp4
 *      public/projects/your-project-id/poster.jpg
 * 
 * 2. Add or modify the project object below.
 *    - aspectRatio can be: "16/9", "9/16", "4/3", "1/1", or "2.39/1"
 *    - All case study narrative sections (concept, system, process, result)
 *      render dynamically on the project detail page.
 * 
 * If a video file is awaiting upload, the site smoothly displays the
 * high-resolution poster with clean, unobtrusive media indicators.
 * ============================================================================
 */

export type AspectRatio = '16/9' | '9/16' | '4/3' | '1/1' | '2.39/1';
export type ProjectCategory = string;

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
  year: string;
  client: string;
  description: string;
  video?: string;          // Path in /public, e.g. "/projects/project-01/video.mp4"
  poster: string;          // Path in /public, e.g. "/projects/project-01/poster.jpg"
  thumbnail?: string;      // Compatibility alias
  aspectRatio: AspectRatio;
  featured?: boolean;
  tags: string[];
  status?: string;
  caseStudy: ProjectCaseStudy;
}

export const CATEGORIES: { id: string; label: string; ratio?: string }[] = [
  { id: 'All', label: 'All Work' },
  { id: 'Brand Motion & Design System', label: 'Brand Motion', ratio: '16:9' },
  { id: 'Commercial Film & Editorial', label: 'Commercial', ratio: '16:9' },
  { id: 'Audio Visualisation & 3D', label: '3D & Spatial', ratio: '16:9' },
  { id: 'Product & Interaction Motion', label: 'Product & UI', ratio: '9:16' },
  { id: 'Cinematic Title Sequence', label: 'Title Sequences', ratio: '2.39:1' }
];

export const projects: Project[] = [
  // ==========================================================================
  // 01 — SPOTIFY: MOTION SYSTEM (Featured / Hero Project)
  // ==========================================================================
  {
    id: "spotify-motion-system",
    slug: "spotify-motion-system",
    title: "Spotify — Kinetic Motion Identity",
    category: "Brand Motion & Design System",
    year: "2026",
    client: "Spotify Design",
    description: "A mathematical motion system choreographing soundwaves, fluid typography, and acoustic energy into living digital tokens.",
    video: "/projects/project-01/video.mp4",
    poster: "/projects/project-01/poster.jpg",
    aspectRatio: "16/9",
    featured: true,
    tags: ["Motion Design", "Design System", "After Effects", "Kinetic Type"],
    caseStudy: {
      role: ["Motion Direction", "System Architecture", "Animation"],
      challenge: "Streaming interfaces often treat animation as an afterthought. Spotify needed an authoritative, proprietary motion vernacular that connects listeners' auditory sensations directly with tactile, fluid interface physics across mobile, desktop, and live event displays.",
      concept: "Audio is pressure waves propagating through space. We translated acoustic waveforms into elastic typography and directional momentum, ensuring every UI expansion, playlist transition, and artist reveal honors the frequency of modern music.",
      motionSystem: "Established standardized easing curves based on rhythmic subdivisions: quarter-note springs for macro view transitions, and 16th-note snaps for micro-interactions. Every visual asset follows a unified velocity ramp with zero visual jitter.",
      results: "Adopted across global marketing touchpoints, achieving unified brand presence and a 42% lift in social retention for interactive audio announcements.",
      credits: [
        { role: "Creative Direction", name: "Samyak Mahajan" },
        { role: "Sound Design", name: "Resonance Audio Lab" },
        { role: "Type Choreography", name: "Studio Archive" }
      ]
    }
  },

  // ==========================================================================
  // 02 — NIKE: KINETIC ENERGY CAMPAIGN
  // ==========================================================================
  {
    id: "nike-kinetic-energy",
    slug: "nike-kinetic-energy",
    title: "Nike — Kinetic Energy Campaign",
    category: "Commercial Film & Editorial",
    year: "2026",
    client: "Nike Running",
    description: "High-velocity editorial pacing, speed ramp transitions, and sound-reactive typographics celebrating human momentum.",
    video: "/projects/project-02/video.mp4",
    poster: "/projects/project-02/poster.jpg",
    aspectRatio: "16/9",
    featured: false,
    tags: ["Editorial Pacing", "Premiere Pro", "Colour Science", "Commercial"],
    caseStudy: {
      role: ["Lead Video Editor", "Motion Graphics", "Sound Sync"],
      challenge: "Capturing the breathless intensity of marathon runners at mile 20 without relying on clichés. The edit needed to feel physically demanding yet effortless in rhythm.",
      concept: "We cut precisely on athlete footsteps and respiratory cadence, allowing sound transients to drive frame transitions and graphic displacement.",
      motionSystem: "Custom speed-ramp curves matching biomechanical deceleration and explosive acceleration, paired with typographic kinetic flashes.",
      results: "Global hero campaign broadcast across Olympic qualifying tournaments with over 18 million collective impressions.",
      credits: [
        { role: "Lead Editor", name: "Samyak Mahajan" },
        { role: "Colourist", name: "DaVinci Lab" }
      ]
    }
  },

  // ==========================================================================
  // 03 — APPLE MUSIC: SPATIAL AUDIO IDENTITY
  // ==========================================================================
  {
    id: "apple-music-spatial",
    slug: "apple-music-spatial",
    title: "Apple Music — Spatial Audio",
    category: "Audio Visualisation & 3D",
    year: "2025",
    client: "Spatial Lab",
    description: "Volumetric light rings, optical glass refractance, and procedural particles visualizing multi-dimensional acoustic depth.",
    video: "/projects/project-03/video.mp4",
    poster: "/projects/project-03/poster.jpg",
    aspectRatio: "16/9",
    featured: false,
    tags: ["3D Motion", "Spatial Audio", "Cinema 4D", "Optical Shaders"],
    caseStudy: {
      role: ["Art Direction", "3D Animation", "Lighting Design"],
      challenge: "Visualizing Dolby Atmos spatial sound without falling back on generic equalizer bars or noisy particle clouds.",
      concept: "Light passing through pure optical glass prisms. Sound isn't just waves—it has dimension, gravity, and warmth. We constructed translucent glass toruses that resonate when hit by audio frequencies.",
      motionSystem: "Physically simulated harmonic oscillations with custom damping curves to evoke weightlessness and surgical acoustic clarity.",
      results: "Featured across spatial album rollouts and worldwide digital billboard takeovers in Tokyo, London, and New York.",
      credits: [
        { role: "3D & Motion Direction", name: "Samyak Mahajan" },
        { role: "Acoustic Engineering", name: "Spatial Spec" }
      ]
    }
  },

  // ==========================================================================
  // 04 — META: TACTILE UI CHOREOGRAPHY (Vertical 9:16)
  // ==========================================================================
  {
    id: "meta-tactile-ui",
    slug: "meta-tactile-ui",
    title: "Meta — Tactile UI Choreography",
    category: "Product & Interaction Motion",
    year: "2025",
    client: "Product Experience Group",
    description: "Vertical mobile choreography highlighting spring physics, fluid gestures, and sub-pixel tactile haptic response.",
    video: "/projects/project-04/video.mp4",
    poster: "/projects/project-04/poster.jpg",
    aspectRatio: "9/16",
    featured: false,
    tags: ["9:16 Vertical", "Interaction Design", "Spring Physics", "Mobile"],
    caseStudy: {
      role: ["Interaction Choreographer", "Motion Prototyper"],
      challenge: "Demonstrating next-generation gesture interactions where interfaces deform subtly to touch velocity and finger momentum.",
      concept: "Glass and liquid mercury. Surfaces anticipate human touch before contact occurs, creating an uncanny sense of responsiveness and digital intimacy.",
      motionSystem: "Spring physics with tension=180, friction=14. Micro-scale elastic bounds preventing dead stops.",
      results: "Integrated into the core interaction specification for mobile gesture navigation across 2+ billion daily active interfaces.",
      credits: [
        { role: "Motion Engineer", name: "Samyak Mahajan" }
      ]
    }
  },

  // ==========================================================================
  // 05 — A24: FILM TITLE SEQUENCE SPEC (Widescreen 2.39:1)
  // ==========================================================================
  {
    id: "a24-title-sequence",
    slug: "a24-title-sequence",
    title: "A24 — Film Title Sequence Spec",
    category: "Cinematic Title Sequence",
    year: "2025",
    client: "Independent Cinema Studio",
    description: "Subtle analog chromatic aberration, 35mm film halation, and austere modernist typography set in widescreen anamorphic 2.39:1.",
    video: "/projects/project-05/video.mp4",
    poster: "/projects/project-05/poster.jpg",
    aspectRatio: "2.39/1",
    featured: false,
    tags: ["2.39:1 Anamorphic", "Title Sequence", "Film Emulation", "Type Design"],
    caseStudy: {
      role: ["Title Designer", "Typographer", "Colour Grading"],
      challenge: "Creating opening credits for a psychological thriller that establishes dread without revealing a single narrative element.",
      concept: "Negative space as suspense. Letters appear from darkness like photographic prints developing in slow chemical solution.",
      motionSystem: "Sub-perceptual drift: type moves at 0.4 pixels per second, barely perceptible to conscious vision but instilling subconscious unease.",
      results: "Premiered at independent festivals and nominated for Best Title Design at the 2025 International Motion Awards.",
      credits: [
        { role: "Title Designer", name: "Samyak Mahajan" }
      ]
    }
  },

  // ==========================================================================
  // 06 — POLESTAR: ELECTRIC VELOCITY
  // ==========================================================================
  {
    id: "polestar-electric-velocity",
    slug: "polestar-electric-velocity",
    title: "Polestar — Electric Velocity",
    category: "Automotive Direction & Grade",
    year: "2024",
    client: "Polestar Automotive",
    description: "Minimalist Scandinavian lighting, controlled highlight roll-off, and low-frequency motor hum synchronized cuts.",
    video: "/projects/project-06/video.mp4",
    poster: "/projects/project-06/poster.jpg",
    aspectRatio: "16/9",
    featured: false,
    tags: ["DaVinci Resolve", "ACES", "Automotive", "Minimalism"],
    caseStudy: {
      role: ["Editorial Finishing", "Colour Grading", "Motion Branding"],
      challenge: "Expressing pure electric acceleration without the roaring sound and fire effects traditional muscle cars rely on.",
      concept: "Silence as power. Clean monolithic geometry cutting through cold Nordic mist, highlighting Scandinavian reductionism.",
      motionSystem: "Zero abrupt jump cuts. Everything resolves through spatial continuity and matched vehicular vectors.",
      results: "Anchored the launch film for Polestar's electric GT tourer with over 8 million organic views across Northern Europe.",
      credits: [
        { role: "Editor & Colourist", name: "Samyak Mahajan" }
      ]
    }
  }
];

export const showreelData = {
  title: "SHOWREEL",
  year: "2026",
  duration: "01:24",
  description: "A curated edit of commercial direction, brand motion systems, kinetic typography, and finishing from the past 24 months.",
  video: "/reel/showreel.mp4",
  poster: "/reel/showreel-poster.jpg",
  aspectRatio: "2.39/1" as AspectRatio
};
