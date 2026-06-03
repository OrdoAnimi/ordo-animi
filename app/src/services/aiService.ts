import type { AgentContext, StageOutput } from '../data/types';
import { generateLocal } from './localGenerator';

// ── Provider status (cached) ───────────────────────────────────────────────────

export type ProviderInfo = { provider: string; model: string };
let _providerCache: ProviderInfo | null = null;

export async function getProviderInfo(): Promise<ProviderInfo> {
  if (_providerCache) return _providerCache;
  try {
    const res = await fetch('/api/ai', { method: 'GET', signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const d = await res.json() as ProviderInfo;
      _providerCache = d;
      return d;
    }
  } catch { /* ignore */ }
  _providerCache = { provider: 'local', model: 'local-fallback' };
  return _providerCache;
}

// ── Agent call ─────────────────────────────────────────────────────────────────

export type AgentResult = StageOutput & { logProvider: string };

export async function callAgent(agent: string, ctx: AgentContext): Promise<AgentResult> {
  const t0 = performance.now();

  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent, context: ctx }),
      signal: AbortSignal.timeout(30_000),
    });

    if (res.ok) {
      const data = await res.json() as {
        source: string;
        content: string | null;
        model?: string;
        provider?: string;
        durationMs?: number;
        error?: string;
      };

      if (data.content) {
        const durationMs = Math.round(performance.now() - t0);
        const out: AgentResult = {
          content: data.content,
          source: 'ai',
          model: data.model,
          provider: data.provider ?? 'unknown',
          durationMs,
          generatedAt: new Date().toISOString(),
          logProvider: data.provider ?? 'unknown',
        };
        // Update cache if provider info returned
        if (data.provider) {
          _providerCache = { provider: data.provider, model: data.model ?? data.provider };
        }
        return out;
      }
      // Server returned source: 'local' — use local generator
    }
  } catch { /* timeout or network — fall through */ }

  const local = generateLocal(agent, ctx);
  return { ...local, logProvider: 'local' };
}
