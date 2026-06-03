// Vercel serverless function — server-side AI provider proxy.
// Called by the browser client. API keys never leave the server.
// Falls back gracefully to local generation signal if no key is set.

import type { AgentContext } from '../src/data/types';

const VALOUR_SYSTEM = `You are VALOUR™, an AI-assisted architectural leadership copilot.
You help architects and technical leaders prepare for, rehearse, and review high-stakes conversations.
Your outputs are concise, practical, and immediately usable.
Format responses in clear markdown. Use headings, short paragraphs, and bullet points.
Do not use filler, preamble, or unnecessary explanation.`;

function buildPrompt(agent: string, ctx: AgentContext): string {
  const base = `Scenario: ${ctx.scenarioTitle}
Role: ${ctx.role || 'Architecture leader'}
Organisation: ${ctx.organisation || 'Enterprise technology program'}
Situation: ${ctx.situation || ctx.scenarioDescription}
Desired outcome: ${ctx.outcome || 'Audience endorses the recommendation and understands the trade-offs.'}`;

  const prev = Object.entries(ctx.previousOutputs)
    .filter(([, v]) => v.length > 20)
    .map(([k, v]) => `### ${k}\n${v.slice(0, 600)}`)
    .join('\n\n');

  switch (agent) {
    case 'scenarioSelector':
      return `${base}\n\nGenerate a scenario selection rationale for the VALOUR™ pilot. Explain why this scenario fits, the user risk, the stakeholder risk, and the desired outcome. Include the recommended prompt path for preparation, rehearsal, language refinement, and review.`;

    case 'preparation':
      return `${base}\n\nGenerate a VALOUR™ preparation brief. Include: situation frame, audience, decision required, key message, opening frame, 4 likely questions with how to handle each, risks to avoid, recommended tone, and a closing statement.`;

    case 'rehearsal':
      return `${base}\n\nGenerate 4 realistic rehearsal questions for this scenario. For each question, explain what to avoid and what to aim for. End with a prompt for the user to type their answer.`;

    case 'languageRefinement':
      return `${base}\n\nOriginal answer:\n"${ctx.userInput || ''}"\n\nIdentify what was weak. Rewrite as four versions: short (under 30 seconds), executive (board-level), empathetic (acknowledges concern first), decision (closes with next action). Recommend which version to use.`;

    case 'afterActionReview':
      return `${base}\n\nPrevious stage outputs:\n${prev}\n\nGenerate an after-action review. Cover: what worked, what did not work, where clarity improved, where cadence improved, what should change next time.`;

    case 'patternReport':
      return `${base}\n\nPrevious stage outputs:\n${prev}\n\nGenerate a leadership pattern report. Cover: starting challenge, what VALOUR helped prepare, main improvement, primary pattern detected, primary strength, primary risk, recommended next focus, 3-4 useful language phrases to retain.`;

    case 'vallumHandover':
      return `${base}\n\nGenerate a VALLUM™ outcome record. Confirm the pilot is complete. Summarise what VALOUR helped with. Recommend the next scenario. Include a brief VITA™ handover note to close the professional day.`;

    default:
      return `${base}\n\nGenerate a VALOUR™ ${agent} output for this architecture leadership scenario.`;
  }
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body: { agent: string; context: AgentContext };
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { agent, context } = body;

  const provider =
    (process.env.AI_PROVIDER as string | undefined) ??
    (process.env.ANTHROPIC_API_KEY ? 'anthropic' :
     process.env.OPENAI_API_KEY    ? 'openai'    : 'local');

  const prompt = buildPrompt(agent, context);

  try {
    if (provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1500,
          system: VALOUR_SYSTEM,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const d = await r.json() as { content?: { text: string }[] };
      const content = d.content?.[0]?.text ?? null;
      if (content) {
        return Response.json({ source: 'anthropic', model: 'claude-haiku-4-5', content });
      }
    }

    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 1500,
          messages: [
            { role: 'system', content: VALOUR_SYSTEM },
            { role: 'user', content: prompt },
          ],
        }),
      });
      const d = await r.json() as { choices?: { message: { content: string } }[] };
      const content = d.choices?.[0]?.message.content ?? null;
      if (content) {
        return Response.json({ source: 'openai', model: 'gpt-4o-mini', content });
      }
    }
  } catch {
    // Fall through to local signal
  }

  return Response.json({ source: 'local', content: null });
}

export const config = { runtime: 'edge' };
