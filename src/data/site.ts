/**
 * ============================================================================
 * SITE CONFIGURATION & EDITORIAL METADATA
 * ============================================================================
 * 
 * Centralized site information. You can edit your bio, email, availability,
 * social links, and services directly here in VS Code without touching code.
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
  role: "Motion Designer & Art Director",
  headline: "Motion Designer crafting movement, identity & visual stories.",
  subheadline: "I design motion identities, visual systems, and cinematic experiences for forward-thinking brands, products, and culture.",
  aboutStatement: "I turn ideas into movement.",
  aboutNarrative: [
    "Motion is not decoration — it is behavior, hierarchy, and emotion. Over the past several years, I have collaborated with brands and creators to build visual languages that feel natural, tactile, and mathematically disciplined.",
    "My practice sits at the intersection of graphic design, kinetic typography, and cinema finishing. By prioritizing pacing over speed and intention over flashiness, I craft motion systems that earn and reward human attention."
  ],
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
      subtitle: "Ideas & Inspiration",
      description: "Deconstructing the core thesis. Before moving a single pixel, we dissect the emotional pulse, cadence, and cultural resonance that anchors the visual message.",
      keywords: ["Auditory Analysis", "Visual Archetypes", "Rhythm Studies"]
    },
    {
      step: "02",
      title: "Explore",
      subtitle: "AI & Concepts",
      description: "Rapid visual prototyping combining generative neural tools, styleframes, and typographic stress-testing to unearth unforeseen aesthetic frontiers.",
      keywords: ["Generative Ideation", "Styleframe Architecture", "Typographic Tension"]
    },
    {
      step: "03",
      title: "Build",
      subtitle: "3D & Creative Code",
      description: "Constructing spatial assets, tactile shaders, lighting geometry, and algorithmic motion rules engineered for fidelity across physical and digital formats.",
      keywords: ["Procedural Geometry", "ACES Shading", "Mathematical Curves"]
    },
    {
      step: "04",
      title: "Animate",
      subtitle: "Motion & Interaction",
      description: "Breathing kinematic life into the composition. Choreographing velocity ramps, spring physics, and sound transients into an unbroken, hypnotic narrative.",
      keywords: ["Spring Physics", "Temporal Easing", "Sound Reactivity"]
    },
    {
      step: "05",
      title: "Create",
      subtitle: "Final Experience",
      description: "Master finishing, sub-pixel optical calibration, analog texture blending, and delivery at maximum cinematic fidelity across all viewing canvases.",
      keywords: ["Master Grading", "Film Emulation", "Multi-Canvas Delivery"]
    }
  ],
  experiments: [
    {
      id: "exp-01",
      number: "01",
      category: "AI",
      title: "Neural Temporal Interpolation",
      description: "Exploring recursive latent space transforms and AI frame synthesis driven by ambient frequency pulses.",
      aspectRatio: "16/9",
      mediaType: "image",
      src: "/projects/project-03/poster.jpg",
      tags: ["Latent Diffusion", "Optical Flow", "Generative"]
    },
    {
      id: "exp-02",
      number: "02",
      category: "3D",
      title: "Caustic Glass Refraction Lab",
      description: "Real-time dispersive glass optics and volumetric light caustics calculated through procedural GPU shaders.",
      aspectRatio: "4/3",
      mediaType: "image",
      src: "/projects/project-01/poster.jpg",
      tags: ["Subsurface Optics", "Cinema 4D", "Octane"]
    },
    {
      id: "exp-03",
      number: "03",
      category: "Motion",
      title: "Kinetic Micro-Typography",
      description: "Parametric variable type choreography reacting to cursor velocity and simulated surface friction.",
      aspectRatio: "1/1",
      mediaType: "image",
      src: "/projects/project-02/poster.jpg",
      tags: ["Kinetic Type", "Spring Dynamics", "Creative Code"]
    },
    {
      id: "exp-04",
      number: "04",
      category: "Web",
      title: "Spatial Interactive Viewport",
      description: "WebGL canvas interaction mapping user gaze vectors into subtle 3D rotational parallax.",
      aspectRatio: "16/9",
      mediaType: "image",
      src: "/projects/project-04/poster.jpg",
      tags: ["Three.js", "Spatial Interaction", "Shader Art"]
    }
  ],
  capabilities: [
    {
      number: "01",
      title: "Motion Identity & Design Systems",
      category: "Brand Motion",
      description: "Developing comprehensive motion guidelines, logo choreographies, and kinetic design tokens that anchor a brand's living digital persona.",
      deliverables: ["Motion Guidelines", "Logo Animation", "UI Motion Tokens", "Lottie / Web Assets"]
    },
    {
      number: "02",
      title: "Commercial Film & Editorial Direction",
      category: "Direction & Edit",
      description: "Rhythmically driven editing, sound-reactive pacing, and dynamic multi-layered compositing for promotional campaigns and brand anthems.",
      deliverables: ["Campaign Films", "Trailer Editing", "Retention Pacing", "Sound Design"]
    },
    {
      number: "03",
      title: "3D & Spatial Product Choreography",
      category: "3D & Simulation",
      description: "Photorealistic material shaders, lighting architecture, and graceful physical object interactions built to showcase product precision.",
      deliverables: ["Product Renders", "Spatial Visualisation", "Exploded Assemblies", "4K Loops"]
    },
    {
      number: "04",
      title: "Tactile UI & Interaction Motion",
      category: "Product & Mobile",
      description: "Fluid spring-physics transitions, gestural interfaces, and micro-interactions optimized for frictionless software experiences.",
      deliverables: ["Prototyping", "Design System Motion", "Micro-interactions", "App Sequences"]
    },
    {
      number: "05",
      title: "Title Sequences & Cinema Finishing",
      category: "Finishing & Colour",
      description: "Custom typography design, analog grain textures, and ACES colour grading that imbue stories with cinematic presence.",
      deliverables: ["Title Sequences", "ACES Colour Grading", "Film Emulation", "Master Delivery"]
    }
  ] as Capability[]
};
