# Samyak Mahajan — Motion Designer & Art Director

A personal portfolio website designed for a senior motion designer and art director. Built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**, guided by the design principles of **Apple.com**: extreme visual cleanliness, generous whitespace, confident typography, cinematic media frames, content-first layouts, and zero unnecessary interface chrome.

---

## 🏛️ Design Philosophy

* **"Less interface. More content."**: The work itself is the hero. The UI is designed around the media rather than forcing media into template cards.
* **Light-Mode Base with Strategic Cinematic Theatre**: Primary atmosphere is a warm off-white (`#F5F5F7`) with near-black typography (`#1D1D1F`), subtly balanced by dark cinematic moments (e.g. **SHOWREEL / 2026** in `#000000`).
* **Zero AI Clutter**: No generic floating cards, no neon glows, no synthetic particle swarms, no star ratings, and no skill percentage bars.
* **Typographic Hierarchy**: Tight modern grotesk hierarchy (Hero 72–120px, Section 48–72px, Project Title 32–48px) with mathematical letter spacing.

---

## 🚀 Quick Start (Running Locally in VS Code)

1. Open this project directory in VS Code:
   ```bash
   C:\Users\sam\.gemini\antigravity-ide\scratch\samyak-portfolio
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser to: **`http://localhost:5173`**.

3. Production bundle check:
   ```bash
   npm run build
   ```

---

## 📁 Centralized Content System (No AI Lock-in)

All website content and projects can be edited directly in VS Code without touching complex component code:

```
samyak-portfolio/
├── src/
│   ├── data/
│   │   ├── site.ts          <-- ⭐️ Edit your bio, services, email, and social links
│   │   └── projects.ts      <-- ⭐️ Edit all projects, case studies, videos, and tags
│   ├── components/
│   │   ├── Navbar.tsx       <-- Minimal sticky header
│   │   ├── Hero.tsx         <-- Confident editorial statement & calm ambient motion
│   │   ├── VideoFrame.tsx   <-- Reusable cinematic media component (16:9, 9:16, 2.39:1)
│   │   ├── SelectedWork.tsx <-- Editorial asymmetrical project grid
│   │   ├── ReelSection.tsx  <-- Dedicated dark cinematic showreel
│   │   ├── ProjectIndex.tsx <-- Interactive catalogue with hover previews
│   │   ├── AboutSection.tsx <-- Editorial perspective, principles, & clean portrait
│   │   ├── ServicesSection.tsx <-- Numbered capabilities list
│   │   ├── ContactSection.tsx  <-- Massive finale typography & direct inquiry
│   │   ├── CaseStudyModal.tsx  <-- Full-page Apple product story case studies
│   │   └── Footer.tsx       <-- Minimal signature & availability
├── public/
│   ├── projects/
│   │   ├── project-01/      <-- video.mp4, poster.jpg (Spotify Motion System)
│   │   ├── project-02/      <-- video.mp4, poster.jpg (Nike Kinetic Energy)
│   │   ├── project-03/      <-- video.mp4, poster.jpg (Apple Music Spatial)
│   │   ├── project-04/      <-- video.mp4, poster.jpg (Meta Tactile UI — 9:16)
│   │   ├── project-05/      <-- video.mp4, poster.jpg (A24 Title Sequence — 2.39:1)
│   │   └── project-06/      <-- video.mp4, poster.jpg (Polestar Electric)
│   ├── reel/
│   │   ├── showreel.mp4     <-- Your full showreel video
│   │   └── showreel-poster.jpg
│   └── images/
│       └── profile.png      <-- Clean, high-resolution portrait
```

---

## 🎬 How to Add or Replace Projects

### Step 1: Place Your Media
Place your video (`.mp4` / `.webm`) and high-resolution thumbnail (`.jpg` / `.png`) in `public/projects/your-project-id/`.

### Step 2: Update `src/data/projects.ts`
Add or update the project entry:
```typescript
{
  id: "your-project-id",
  slug: "your-project-slug",
  title: "Client — Project Name",
  category: "Brand Motion & Design System",
  year: "2026",
  client: "Client Name",
  description: "Short project summary.",
  video: "/projects/your-project-id/video.mp4",
  poster: "/projects/your-project-id/poster.jpg",
  aspectRatio: "16/9", // Supports: "16/9", "9/16", "4/3", "1/1", "2.39/1"
  featured: false,
  tags: ["Motion Design", "3D"],
  caseStudy: {
    role: ["Motion Director", "Animator"],
    challenge: "Project background and creative problem.",
    concept: "Core conceptual idea.",
    motionSystem: "Velocity curves, kinetic choreography, and pacing.",
    results: "Impact and delivery."
  }
}
```

> **Zero Broken States:** If a video file is pending upload, the reusable `<VideoFrame />` component gracefully displays your high-resolution poster with clean, subtle controls. The site will never appear broken.

---

## ⚡ Technical Highlights

* **Multi-Aspect Ratio Engine**: Native support for widescreen `2.39:1`, television `16:9`, vertical `9:16` (reels/mobile choreography), `4:3`, and square `1:1`.
* **Deep Case Study Route Sync**: Clean hash routing (`#work/spotify-motion-system`) with full browser history support (Back/Forward buttons work seamlessly).
* **Intersection Observer Lazy Loading**: Videos only load and play when scrolled into the viewport, preserving bandwidth and 60fps responsiveness.
* **Prefers-Reduced-Motion**: Automatically honors accessibility settings to disable large transforms and video autoplays.
