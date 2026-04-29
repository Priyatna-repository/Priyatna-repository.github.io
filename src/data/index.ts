import { LabTool, ResultCard, SuggestionItem, PAA, FilterTab } from '@/types';

export const LAB_TOOLS: LabTool[] = [
  {
    id: 'motion-studio',
    icon: '⬡',
    name: 'Motion Studio',
    desc: 'Timeline editor · Spring physics',
    status: 'live',
    version: 'v1.4.2',
    colorClass: 'lc-red',
  },
  {
    id: 'pattern-forge',
    icon: '◈',
    name: 'Pattern Forge',
    desc: 'Truchet · Penrose · Custom weaves',
    status: 'live',
    version: 'v2.0.1',
    colorClass: 'lc-blue',
  },
  {
    id: 'color-oracle',
    icon: '✦',
    name: 'Color Oracle',
    desc: 'AI palette engine · WCAG',
    status: 'beta',
    version: 'v0.8.0',
    colorClass: 'lc-green',
  },
  {
    id: 'type-foundry',
    icon: '⟐',
    name: 'Type Foundry',
    desc: 'Variable fonts · Optical sizing',
    status: 'live',
    version: 'v1.1.0',
    colorClass: 'lc-yellow',
  },
  {
    id: 'grid-architect',
    icon: '⊕',
    name: 'Grid Architect',
    desc: 'Spatial systems · Baseline grids',
    status: 'beta',
    version: 'v0.5.3',
    colorClass: 'lc-purple',
  },
  {
    id: 'icon-atelier',
    icon: '◎',
    name: 'Icon Atelier',
    desc: 'Custom icon sets · SVG export',
    status: 'soon',
    version: 'v0.1.0',
    colorClass: 'lc-orange',
  },
];

export const LAB_TOOLS_FULL = [
  {
    ...LAB_TOOLS[0],
    fullDesc:
      'Full timeline animation editor with spring physics engine, easing curve library, and keyframe sequencer. Export: Lottie · CSS · GSAP.',
  },
  {
    ...LAB_TOOLS[1],
    fullDesc:
      'Parametric pattern generator. Truchet tiles, Penrose tessellations, Voronoi cells, custom grids. Export: SVG · PNG · JSON.',
  },
  {
    ...LAB_TOOLS[2],
    fullDesc:
      'AI palette architecture engine. Brief → semantic color system with dark mode, WCAG compliance, brand personality, and token output.',
  },
  {
    ...LAB_TOOLS[3],
    fullDesc:
      'Variable typeface builder and type scale generator. Optical size tuning, baseline grid alignment, and specimen export for documentation.',
  },
  {
    ...LAB_TOOLS[4],
    fullDesc:
      'Spatial grid system builder. Define column grids, baseline rhythms, and component spacing tokens. One-click Figma & CSS export.',
  },
  {
    ...LAB_TOOLS[5],
    fullDesc:
      'Bespoke icon set generator. Draw with constraints, auto-generate filled/outlined/duotone variants, and export as icon font or SVG sprite.',
  },
];

export const RESULT_CARDS: ResultCard[] = [
  {
    id: 'verdant',
    iconLetter: 'V',
    iconColorClass: 'rci-b',
    source: 'priyatna.design › ',
    sourceBold: 'verdant-dashboard',
    title: 'VERDANT — ANALYTICS DASHBOARD',
    desc: 'Complex data visualization made intuitive. Custom charting library built from scratch with motion design principles baked in. 40+ component types, WCAG AA compliant.',
    tags: [
      { label: 'Dashboard', colorClass: 'rft-b' },
      { label: 'Data Viz', colorClass: 'rft-y' },
      { label: 'Open Source', colorClass: 'rft-g' },
    ],
    date: 'Mar 2024',
  },
  {
    id: 'motion-studio',
    iconLetter: 'M',
    iconColorClass: 'rci-r',
    source: 'labs.priyatna.design › ',
    sourceBold: 'motion-studio',
    title: 'MOTION STUDIO — LAB TOOL',
    desc: 'Browser-based animation timeline editor. Craft micro-interactions with spring physics, easing curves, and keyframe sequences. Export as Lottie, CSS, or GSAP.',
    tags: [
      { label: 'Lab Tool', colorClass: 'rft-r' },
      { label: 'Live', colorClass: 'rft-g' },
    ],
    date: 'Jun 2024',
  },
  {
    id: 'gilded',
    iconLetter: 'P',
    iconColorClass: 'rci-g',
    source: 'priyatna.design › projects › ',
    sourceBold: 'gilded-ecommerce',
    title: 'GILDED — LUXURY E-COMMERCE',
    desc: 'Headless Shopify storefront with bespoke 3D product renders. Custom WebGL shader for product configurator. 210% conversion rate improvement post-launch.',
    tags: [
      { label: 'E-Commerce', colorClass: 'rft-y' },
      { label: '3D / WebGL', colorClass: 'rft-b' },
      { label: 'Shopify', colorClass: 'rft-r' },
    ],
    date: 'Jan 2024',
  },
  {
    id: 'type-foundry',
    iconLetter: 'S',
    iconColorClass: 'rci-a',
    source: 'priyatna.design › ',
    sourceBold: 'type-foundry',
    title: 'PRIYATNA TYPE FOUNDRY',
    desc: 'Custom variable typeface family with 6 weights and 3 optical sizes. Designed for screen legibility with advanced OpenType features and language support for 40+ scripts.',
    tags: [
      { label: 'Typography', colorClass: 'rft-r' },
      { label: 'Variable Font', colorClass: 'rft-b' },
    ],
    date: 'Nov 2023',
  },
  {
    id: 'color-oracle',
    iconLetter: 'A',
    iconColorClass: 'rci-b',
    source: 'priyatna.design › labs › ',
    sourceBold: 'color-oracle',
    title: 'COLOR ORACLE — AI PALETTE ENGINE',
    desc: 'AI-powered color system generator. Input a brief, image, or emotion — receive a semantic color architecture with WCAG ratios, dark mode variants, and brand personality mapping.',
    tags: [
      { label: 'AI Lab', colorClass: 'rft-g' },
      { label: 'Beta', colorClass: 'rft-r' },
    ],
    date: 'Q2 2024',
  },
];

export const SUGGESTIONS: SuggestionItem[] = [
  { query: 'brand identity systems', label: 'brand identity systems', tagClass: 'st-design', tagText: 'Design' },
  { query: 'motion design principles', label: 'motion design principles', tagClass: 'st-motion', tagText: 'Motion' },
  { query: 'design system components', label: 'design system components', tagClass: 'st-design', tagText: 'Design' },
  { query: 'pattern forge lab tool', label: 'pattern forge lab tool', tagClass: 'st-lab', tagText: 'Lab' },
  { query: 'visual branding portfolio', label: 'visual branding portfolio', tagClass: 'st-brand', tagText: 'Brand' },
  { query: 'priyatna color oracle ai', label: 'priyatna color oracle AI', tagClass: 'st-lab', tagText: 'Lab' },
];

export const TICKER_ITEMS = [
  { text: 'PRIYATNA DESIGN SYSTEM v4.2', dotClass: 'td-r' },
  { text: '247 PROJECTS · 34 COUNTRIES', dotClass: 'td-b' },
  { text: 'ADDON LABS NOW OPEN · 6 TOOLS ACTIVE', dotClass: 'td-g' },
  { text: 'MOTION STUDIO BETA → TRY IT NOW', dotClass: 'td-y' },
  { text: 'AWWWARDS SITE OF THE DAY 2024', dotClass: 'td-r' },
  { text: 'NEW: COLOR ORACLE AI PALETTE GEN', dotClass: 'td-b' },
];

export const FILTER_TABS: FilterTab[] = [
  { label: 'ALL', count: 247 },
  { label: 'PROJECTS', count: 84 },
  { label: 'LAB TOOLS', count: 6 },
  { label: 'MOTION', count: 41 },
  { label: 'BRANDING', count: 63 },
  { label: 'TYPOGRAPHY', count: 33 },
  { label: 'ARCHIVE', count: 20 },
];

export const PAA_ITEMS: PAA[] = [
  {
    question: 'What is the Priyatna Design System?',
    answer:
      'A comprehensive, token-based design system covering typography, color, spacing, motion, and component architecture. Fully documented, Figma-first, and open for licensed teams.',
  },
  {
    question: 'How do the Addon Labs work?',
    answer:
      'Labs are browser-based creative tools built on top of the Priyatna core. Each addon is standalone — no install required. Open a tool, create, and export to your format of choice.',
  },
  {
    question: 'Can I use Motion Studio for production?',
    answer:
      'Yes. Motion Studio exports to Lottie JSON, CSS keyframes, and GSAP timelines. Production-ready output with easing presets tuned for real interfaces.',
  },
  {
    question: 'Is Color Oracle AI-powered?',
    answer:
      'Yes — Color Oracle uses a fine-tuned model trained on design systems, brand psychology, and WCAG compliance data to generate semantic color architectures from natural language briefs.',
  },
];

export const RELATED_SEARCHES = [
  'brand identity design 2024',
  'design system tokens figma',
  'motion design principles ui',
  'gsap animation tools 2024',
  'generative pattern design tools',
  'ai color palette generator',
  'variable font design system',
];

export const QUICK_CHIPS = [
  { label: 'Brand Identity', query: 'brand identity', color: 'var(--accent)' },
  { label: 'Motion Design', query: 'motion design', color: 'var(--accent2)' },
  { label: 'Design Systems', query: 'design systems', color: 'var(--accent3)' },
  { label: 'Lab Tools', query: 'lab tools', color: 'var(--accent4)' },
  { label: 'Typography', query: 'typography', color: '#a855f7' },
];

export const SHORTCUTS = [
  { icon: '◆', label: 'Projects', query: 'selected projects' },
  { icon: '⬡', label: 'Labs', query: null },
  { icon: '▶', label: 'Motion', query: 'motion studio' },
  { icon: '⊞', label: 'System', query: 'design system' },
  { icon: '✉', label: 'Contact', query: 'contact priyatna' },
];