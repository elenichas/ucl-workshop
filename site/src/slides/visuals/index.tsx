import type { ComponentType } from 'react'
import type { VisualId } from '../types'
import { AgentLoop, ChatVsAgent, ClaudeCodeSteps, ContextWindow, KnowledgeFiles, SkillLoading, TokenCompare, Tokens } from './ai'
import { Breakpoints, DeployFlow, FirstLoop, RepoTimeline, SlopVsDesigned, StackLayers, TestLevels, TypeSystem, WebRequest } from './web'
import { Algorithm, AxisSwap, CSG, FabPath, FiveStarts, IPO, MeshResolution, Overhang, PlanLoop, PrintCompare, SystemMapFlow, SystemMapVisual, WaysToStart, WhoDoesWhat, Winding } from './making'

/** Every animated diagram, by id. Each takes the current reveal step. */
export const VISUALS: Record<VisualId, ComponentType<{ step: number }>> = {
  tokens: Tokens,
  'chat-vs-agent': ChatVsAgent,
  'agent-loop': AgentLoop,
  'web-request': WebRequest,
  'repo-timeline': RepoTimeline,
  'stack-layers': StackLayers,
  'claude-code-steps': ClaudeCodeSteps,
  'knowledge-files': KnowledgeFiles,
  'skill-loading': SkillLoading,
  'context-window': ContextWindow,
  'token-compare': TokenCompare,
  'plan-loop': PlanLoop,
  'five-starts': FiveStarts,
  'ways-to-start': WaysToStart,
  'system-map': SystemMapVisual,
  'system-map-flow': SystemMapFlow,
  ipo: IPO,
  algorithm: Algorithm,
  winding: Winding,
  csg: CSG,
  'mesh-resolution': MeshResolution,
  'print-compare': PrintCompare,
  overhang: Overhang,
  'axis-swap': AxisSwap,
  'fab-path': FabPath,
  'type-system': TypeSystem,
  breakpoints: Breakpoints,
  'slop-vs-designed': SlopVsDesigned,
  'test-levels': TestLevels,
  'deploy-flow': DeployFlow,
  'first-loop': FirstLoop,
  'who-does-what': WhoDoesWhat,
}
