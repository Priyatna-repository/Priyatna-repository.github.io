import type { PageStatusConfig, SitePageStatuses } from '@/types'

export const PAGE_STATUSES: SitePageStatuses = {
  home: {
    status: 'active',
  } satisfies PageStatusConfig,
  blog: {
    status: 'upcoming',
    message: 'Blog is coming in Phase 2.',
    estimate: 'Q2 2026',
  } satisfies PageStatusConfig,
  showcase: {
    status: 'upcoming',
    message: 'Project showcase is coming in Phase 2.',
    estimate: 'Q2 2026',
  } satisfies PageStatusConfig,
  labs: {
    status: 'active',
  } satisfies PageStatusConfig,
  about: {
    status: 'upcoming',
    message: 'About page is coming soon.',
    estimate: 'Q3 2026',
  } satisfies PageStatusConfig,
}
