/**
 * ============================================================================
 * SITE CONFIGURATION & EDITORIAL METADATA
 * ============================================================================
 * 
 * Accurately represents Samyak Mahajan:
 * - Video Editor
 * - Motion Graphics Designer
 * - Graphic Designer
 * ============================================================================
 */

export interface SocialLink {
  label: string;
  url: string;
  handle: string;
}

export interface Capability {
  number: string;
  title: string;
  category: string;
  description: string;
  deliverables: string[];
}

export const siteConfig = {
  name: "Samyak Mahajan",
  role: "Video Editor · Motion Graphics · Graphic Designer",
  headline: "Crafting movement, identity & visual stories.",
  subheadline: "Commercial editing, dynamic motion graphics, and visual design systems built with rhythmic precision, pacing, and intent.",
  aboutStatement: "I turn ideas into movement.",
  aboutNarrative: [
    "Editing and motion design are not mere decoration — they are rhythm, narrative timing, and visual emotion. Over the past several years, I have collaborated with brands, creators, and directors to build visual languages that feel natural, tactile, and mathematically disciplined.",
    "My practice sits at the intersection of video editing, kinetic typography, and graphic design. By prioritizing pacing over speed and intention over flashiness, I craft motion systems and edits that earn and reward human attention."
  ],
  focus: "Video Editing · Motion Graphics · Graphic Design",
  location: "Worldwide · Remote",
  availability: "Available for Select Commissions",
  contactEmail: "samyakvework@gmail.com",
  socials: [
    {
      label: "Instagram",
      url: "https://www.instagram.com/sam7archives",
      handle: "@sam7archives"
    }
  ] as SocialLink[],
  creativeProcess: [
    {
      step: "01",
      title: "Discover",
      subtitle: "Creative Brief & Sonic Rhythm",
      description: "Deconstructing the core narrative. Before placing a single cut, we dissect the emotional pulse, cadence, and auditory transients that anchor the message.",
      keywords: ["Auditory Analysis", "Narrative Beats", "Rhythm Studies"]
    },
    {
      step: "02",
      title: "Concept",
      subtitle: "Storyboards & Styleframes",
      description: "Visual exploration combining styleframes, typographic tension, and compositional rules to establish the creative trajectory.",
      keywords: ["Styleframe Architecture", "Typographic Direction", "Visual Hierarchy"]
    },
    {
      step: "03",
      title: "Cut",
      subtitle: "Editorial Assembly & Pacing",
      description: "Carving out the story. Cutting on action, calibrating velocity ramps, and structuring retention arcs that keep viewers engaged from opening frame to finish.",
      keywords: ["Retention Pacing", "Speed Ramping", "Action Cutting"]
    },
    {
      step: "04",
      title: "Animate",
      subtitle: "Motion Graphics & Kinetic Polish",
      description: "Breathing kinematic life into the edit. Choreographing 2D kinetic typography, logo animations, and smooth vector transitions.",
      keywords: ["Kinetic Typography", "Temporal Easing", "Vector Choreography"]
    },
    {
      step: "05",
      title: "Finish",
      subtitle: "Color Science & Master Delivery",
      description: "Precision color grading, analog texture blending, sound design balance, and export across widescreen, desktop, and vertical mobile formats.",
      keywords: ["DaVinci Color Grading", "Sound Transient Sync", "Multi-Canvas Delivery"]
    }
  ],
  capabilities: [
    {
      number: "01",
      title: "Video Editing & Post-Production",
      category: "Video Editing",
      description: "Rhythmically driven editing, sound-reactive pacing, and dynamic multi-layered cutting for commercial campaigns, spec ads, sports edits, and high-retention content.",
      deliverables: ["Commercial Films", "High-Retention Edits", "Trailer & Spec Ads", "Color Grading & Audio Sync"]
    },
    {
      number: "02",
      title: "Motion Graphics & Brand Animation",
      category: "Motion Graphics",
      description: "2D kinetic typography, logo choreographies, animated brand assets, and kinetic design tokens that anchor a brand's living identity.",
      deliverables: ["Kinetic Typography", "Logo Animation", "Brand Motion Systems", "Social Motion Assets"]
    },
    {
      number: "03",
      title: "Graphic Design & Visual Identity",
      category: "Graphic Design",
      description: "High-impact editorial posters, typography layouts, album artwork, brand identity systems, and key campaign visuals that command attention.",
      deliverables: ["Key Visuals & Posters", "Brand Identity Systems", "Typographic Layouts", "Editorial Collateral"]
    }
  ] as Capability[]
};
