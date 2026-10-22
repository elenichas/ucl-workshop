import type { Design } from '@/design/design'

/**
 * A SLIDE is data, not a picture. The same data drives:
 * - the in-browser presentation (with animation and step-by-step reveals), and
 * - the PowerPoint export (native text, visuals as images, notes in the notes field).
 */
export type VisualId =
  | 'tokens' | 'chat-vs-agent' | 'agent-loop' | 'web-request' | 'repo-timeline' | 'stack-layers'
  | 'claude-code-steps' | 'knowledge-files' | 'skill-loading' | 'context-window' | 'token-compare'
  | 'plan-loop' | 'five-starts' | 'ways-to-start' | 'system-map' | 'system-map-flow' | 'ipo' | 'algorithm' | 'winding' | 'csg'
  | 'mesh-resolution' | 'print-compare' | 'overhang' | 'axis-swap' | 'fab-path' | 'type-system'
  | 'breakpoints' | 'slop-vs-designed' | 'test-levels' | 'deploy-flow' | 'first-loop' | 'who-does-what' | 'localhost' | 'build-steps' | 'a11y-basics' | 'test-ways' | 'hosting'

interface Base {
  /** Speaker notes — shown in the notes window and copied into PowerPoint */
  notes?: string
  /** Chapter slug this slide belongs to (set automatically) */
  chapter?: string
}

export type Slide = Base &
  (
    | { kind: 'title'; title: string; subtitle: string; meta?: string }
    | { kind: 'chapter'; number: string; title: string; part: string; summary: string }
    | { kind: 'part'; number: number; title: string; question: string; chapters: { number: string; title: string }[] }
    | { kind: 'statement'; text: string; sub?: string }
    | { kind: 'bullets'; title: string; points: string[]; reveal?: boolean; aside?: string }
    | { kind: 'visual'; title: string; visual: VisualId; steps?: number; caption?: string }
    | { kind: 'compare'; title: string; left: { label: string; points: string[] }; right: { label: string; points: string[] }; reveal?: boolean }
    | { kind: 'table'; title: string; head: string[]; rows: string[][]; reveal?: boolean }
    | { kind: 'code'; title: string; code: string; caption?: string; lang?: 'prompt' | 'code' | 'shell' }
    | { kind: 'vase'; title: string; caption?: string; designs: { label: string; design: Design }[] }
    | { kind: 'images'; title: string; images: { src: string; label: string }[]; caption?: string }
  )

/** How many clicks a slide takes before moving on (0 = none). */
export function stepsOf(s: Slide): number {
  switch (s.kind) {
    case 'bullets': return s.reveal ? s.points.length - 1 : 0
    case 'compare': return s.reveal ? 1 : 0
    case 'table': return s.reveal ? s.rows.length - 1 : 0
    case 'visual': return s.steps ?? 0
    case 'vase': return s.designs.length - 1
    case 'images': return 0
    default: return 0
  }
}

export function titleOf(s: Slide): string {
  switch (s.kind) {
    case 'statement': return s.text
    case 'chapter': return `${s.number} · ${s.title}`
    case 'part': return `Part ${s.number} · ${s.title}`
    default: return s.title
  }
}
