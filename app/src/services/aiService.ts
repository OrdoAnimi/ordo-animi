import type { AgentContext, StageOutput } from '../data/types';
import { generateLocal } from './localGenerator';

function now() { return new Date().toISOString(); }

export async function callAgent(agent: string, ctx: AgentContext): Promise<StageOutput> {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent, context: ctx }),
      signal: AbortSignal.timeout(20_000),
    });

    if (res.ok) {
      const data: { source: string; content: string | null; model?: string } = await res.json();
      if (data.content) {
        return {
          content: data.content,
          source: data.source === 'local' ? 'local' : 'ai',
          model: data.model,
          generatedAt: now(),
        };
      }
    }
  } catch {
    // Network error or timeout — fall through to local
  }

  return generateLocal(agent, ctx);
}
