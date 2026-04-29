import type { LabItem } from '@/types'

export const LAB_ITEMS: LabItem[] = [
  {
    id: 'motion-studio',
    name: 'Motion Studio',
    slug: 'motion-studio',
    description: 'Timeline editor · Spring physics',
    fullDescription:
      'Full timeline animation editor with spring physics engine, easing curve library, and keyframe sequencer. Export: Lottie · CSS · GSAP.',
    icon: '⬡',
    colorTheme: 'red',
    version: 'v1.4.2',
    status: 'live',
    features: ['Spring physics engine', 'Easing curve library', 'Keyframe sequencer', 'Export: Lottie · CSS · GSAP'],
    order: 1,
  },
  {
    id: 'pattern-forge',
    name: 'Pattern Forge',
    slug: 'pattern-forge',
    description: 'Truchet · Penrose · Custom weaves',
    fullDescription:
      'Parametric pattern generator. Truchet tiles, Penrose tessellations, Voronoi cells, custom grids. Export: SVG · PNG · JSON.',
    icon: '◈',
    colorTheme: 'blue',
    version: 'v2.0.1',
    status: 'live',
    features: ['Truchet tiles', 'Penrose tessellations', 'Voronoi cells', 'Export: SVG · PNG · JSON'],
    order: 2,
  },
  {
    id: 'color-oracle',
    name: 'Color Oracle',
    slug: 'color-oracle',
    description: 'AI palette engine · WCAG',
    fullDescription:
      'AI palette architecture engine. Brief → semantic color system with dark mode, WCAG compliance, brand personality, and token output.',
    icon: '✦',
    colorTheme: 'green',
    version: 'v0.8.0',
    status: 'beta',
    features: ['AI-driven palette generation', 'WCAG compliance checks', 'Dark mode variants', 'Token output'],
    order: 3,
  },
  {
    id: 'type-foundry',
    name: 'Type Foundry',
    slug: 'type-foundry',
    description: 'Variable fonts · Optical sizing',
    fullDescription:
      'Variable typeface builder and type scale generator. Optical size tuning, baseline grid alignment, and specimen export for documentation.',
    icon: '⟐',
    colorTheme: 'yellow',
    version: 'v1.1.0',
    status: 'live',
    features: ['Variable font builder', 'Optical size tuning', 'Baseline grid alignment', 'Specimen export'],
    order: 4,
  },
  {
    id: 'grid-architect',
    name: 'Grid Architect',
    slug: 'grid-architect',
    description: 'Spatial systems · Baseline grids',
    fullDescription:
      'Spatial grid system builder. Define column grids, baseline rhythms, and component spacing tokens. One-click Figma & CSS export.',
    icon: '⊕',
    colorTheme: 'purple',
    version: 'v0.5.3',
    status: 'beta',
    features: ['Column grid builder', 'Baseline rhythms', 'Spacing tokens', 'Figma & CSS export'],
    order: 5,
  },
  {
    id: 'icon-atelier',
    name: 'Icon Atelier',
    slug: 'icon-atelier',
    description: 'Custom icon sets · SVG export',
    fullDescription:
      'Bespoke icon set generator. Draw with constraints, auto-generate filled/outlined/duotone variants, and export as icon font or SVG sprite.',
    icon: '◎',
    colorTheme: 'orange',
    version: 'v0.1.0',
    status: 'soon',
    estimatedRelease: 'Q4 2025',
    features: ['Constraint-based drawing', 'Auto-generate variants', 'Icon font export', 'SVG sprite export'],
    order: 6,
  },
]

// Helper functions — interface matches the future API shape (Phase 3)
export function getAllLabs(): LabItem[] {
  return [...LAB_ITEMS].sort((a, b) => a.order - b.order)
}

export function getActiveLabs(): LabItem[] {
  return LAB_ITEMS.filter((l) => l.status === 'live' || l.status === 'beta').sort(
    (a, b) => a.order - b.order
  )
}

export function getLabBySlug(slug: string): LabItem | undefined {
  return LAB_ITEMS.find((l) => l.slug === slug)
}
