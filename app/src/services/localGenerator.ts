import type { AgentContext, StageOutput } from '../data/types';

function now() {
  return new Date().toISOString();
}

function local(content: string): StageOutput {
  return { content, source: 'local', generatedAt: now() };
}

// ── Scenario selector ──────────────────────────────────────────────────────────

export function generateScenarioSelection(ctx: AgentContext): StageOutput {
  return local(`# Scenario Selection

**Selected scenario:** ${ctx.scenarioTitle}

**Why this scenario fits:**
${ctx.situation
  ? `The situation described — "${ctx.situation}" — maps directly to the ${ctx.scenarioTitle} scenario. The leadership risk here is not the technical content but whether the architect can frame the conversation at the right altitude.`
  : `The ${ctx.scenarioTitle} scenario matches this situation because it exercises the core VALOUR\u2122 promise: helping a leader turn technical complexity into a decision conversation.`
}

**User risk:**
The leader may go too technical, become defensive under challenge, or fail to state the decision clearly before explaining the supporting detail.

**Stakeholder risk:**
The audience may not understand what decision is required, or may see the presentation as unclear or insufficiently governed.

**Desired outcome:**
${ctx.outcome || `The audience understands the recommendation, trade-offs, decision required, risks, and next steps. The leader is seen as clear, calm, and credible.`}

**Prompt path:**
- Preparation: clarify decision, audience, key message, likely questions, tone, and close.
- Rehearsal: simulate the stakeholder group. Ask one question at a time. Give feedback on clarity, cadence, and decision framing.
- Language refinement: rewrite answers as short, executive, empathetic, and decision-oriented versions.
- Review: assess decision clarity, altitude, question handling, and trade-off explanation.
`);
}

// ── Preparation brief ──────────────────────────────────────────────────────────

export function generatePreparationBrief(ctx: AgentContext): StageOutput {
  const role = ctx.role || 'the architect';
  const situation = ctx.situation || `presenting to the ${ctx.scenarioTitle}`;

  return local(`# Preparation Brief: ${ctx.scenarioTitle}

## Situation frame
${role} is ${situation}. The leadership risk is not the technical design — it is whether the conversation can be held at the right altitude, with the decision made clear before the detail is explained.

## Audience

- Decision-makers who need a recommendation, not a technical walkthrough
- Stakeholders who will challenge risk, timeline, standards, or business alignment
- A business sponsor who needs to understand the impact without the implementation detail

## Decision required
The audience must decide whether to **endorse the recommended approach** and allow work to proceed with documented conditions and mitigations.

## Key message
The recommended approach is the most balanced option because it meets the primary objective, keeps the main risks visible and manageable, and avoids unnecessary complexity at this stage.

## Opening frame
> "The decision I am asking for today is conditional endorsement of the recommended approach so we can proceed while we document the remaining open items. I will keep this at the decision level first: recommendation, options considered, trade-off, risk position, and next actions."

## Likely questions and how to handle them

**"What is the risk if this goes wrong?"**
Name the risk clearly, state the mitigation, and explain why the risk is acceptable. Do not minimise it.

**"Why not the alternative option?"**
Explain the trade-off directly. Name what was given up and why that trade-off was made.

**"Is this aligned with our standards?"**
Confirm which standards apply and how the recommendation meets them. If there is a gap, name the exception and the rationale.

**"What does delivery need from us today?"**
State the decision and the conditions. Keep it actionable.

## Risks to avoid
- Do not open with implementation detail before the decision frame
- Do not defend every technical choice as equally important
- Do not allow the conversation to become a technical debate
- Do not leave the decision implicit at the close

## Recommended tone
Calm. Concise. Decision-oriented. Respectful of challenge. Clear on trade-offs.

## Closing statement
> "My recommendation is to proceed under the documented conditions. The trade-off we are accepting is [X] in order to achieve [Y]. If the group agrees, the next action is to record the conditions and confirm the follow-up checkpoints."
`);
}

// ── Rehearsal questions ────────────────────────────────────────────────────────

export function generateRehearsalQuestions(ctx: AgentContext): StageOutput {
  return local(`# Rehearsal Questions: ${ctx.scenarioTitle}

Practice your responses to these questions. Aim for answers under 90 seconds each. Lead with the decision frame before the detail.

---

**Question 1 — Risk and governance**
> "How do we know this approach is adequately governed? What happens if it fails?"

*What to avoid:* Listing every control in detail before acknowledging the concern.
*What to aim for:* Acknowledge the concern, state the governance position, name the residual risk and who owns it.

---

**Question 2 — Trade-off and alternatives**
> "Why did you rule out the other options? Have you fully considered [alternative]?"

*What to avoid:* Defending the recommended option as the only possible answer.
*What to aim for:* Name the options, explain the trade-off clearly, confirm the decision criteria that led to the recommendation.

---

**Question 3 — Timeline and delivery pressure**
> "Can we actually deliver this on time? What happens if we hit problems?"

*What to avoid:* Over-promising or becoming defensive about the schedule.
*What to aim for:* Separate what is certain from what is conditional. Name the earliest decision point if something changes.

---

**Question 4 — Business alignment**
> "How does this connect to what the business is trying to achieve?"

*What to avoid:* Technical explanation that misses the business outcome.
*What to aim for:* Connect the recommendation to the business objective in one sentence before explaining how.

---

**Your answer goes here:**
Type your response to any of these questions below. VALOUR\u2122 will help you refine it in the next stage.
`);
}

// ── Language refinement ────────────────────────────────────────────────────────

export function generateLanguageRefinement(ctx: AgentContext): StageOutput {
  const raw = ctx.userInput || ctx.previousOutputs['stage-04-rehearsal'] || '';
  const hasInput = raw.trim().length > 10;

  if (!hasInput) {
    return local(`# Language Refinement

**No answer captured yet.**

Return to the Rehearsal stage, type your answer to one of the practice questions, then come back here to generate refined versions.
`);
  }

  return local(`# Language Refinement

## Original answer
> "${raw.trim()}"

## What was weak or unclear
The answer may be too compressed, too defensive, or not clearly separated into recommendation, condition, trade-off, and next action. The goal is to make it shorter, clearer, and more decision-oriented.

## Short version
*(Under 30 seconds)*

The recommendation is [state it]. The main trade-off is [name it]. The next step is [confirm it].

## Executive version
*(Board-level language)*

The decision today is whether this approach is ready to proceed under documented conditions. My recommendation is yes. It balances [primary objective] with [governance or risk requirement] and avoids [the main downside of the alternative].

## Empathetic version
*(Acknowledges the concern before the answer)*

I understand the concern about [topic of the question]. The recommendation is not to ignore that concern — it is to proceed conditionally, with the open items documented and reviewed at the [next checkpoint].

## Decision version
*(Closes with an explicit next action)*

Approve the proposed approach conditionally. Record the open items. Assign owners. Confirm the follow-up checkpoint before [next milestone].

## Recommended approach
Use the **executive version** as the primary answer and the **decision version** as your close. The empathetic version is useful when you sense resistance before you state the recommendation.
`);
}

// ── After-action review ────────────────────────────────────────────────────────

export function generateAfterActionReview(ctx: AgentContext): StageOutput {
  const prepOutput = ctx.previousOutputs['stage-03-prep'] || '';
  const rehearsalOutput = ctx.previousOutputs['stage-04-rehearsal'] || '';
  const languageOutput = ctx.previousOutputs['stage-05-language'] || '';
  const hasWork = prepOutput.length + rehearsalOutput.length + languageOutput.length > 50;

  return local(`# After-Action Review: ${ctx.scenarioTitle}

## What happened
${hasWork
  ? 'The pilot progressed through preparation, rehearsal, and language refinement. The workflow tested whether the leader could hold the conversation at the right altitude and close with a clear decision.'
  : 'Complete the preparation, rehearsal, and language refinement stages before generating this review for a more personalised output.'
}

## What worked
- The preparation brief forced clarity on audience, decision, and close before entering rehearsal.
- The rehearsal questions exposed where the answer went too technical or too defensive.
- The language refinement turned a compressed answer into a board-ready response.

## What did not work
- The rehearsal stage may need more questions across multiple stakeholder types.
- The answer may still contain too much implementation detail before the decision frame is clear.

## Where clarity improved
Clarity improved when the answer moved from describing the design to framing the decision. "The recommendation is conditional approval" is clearer than "the design is technically sound."

## Where cadence improved
Cadence improved when the answer led with the concern acknowledgement before the recommendation.

## What to change next time
- Start every answer with the decision frame before the supporting detail.
- Practise the closing statement until it feels natural.
- Reduce the number of options presented. One clear recommendation is stronger than three balanced options.

## Confidence after VALOUR\u2122
Record your updated confidence score in the Outcome Record stage.

## Operator note
This review was generated from the available stage outputs. Edit it to reflect what actually happened in the real meeting or simulation.
`);
}

// ── Pattern report ─────────────────────────────────────────────────────────────

export function generatePatternReport(ctx: AgentContext): StageOutput {
  const hasOutputs = Object.keys(ctx.previousOutputs).length > 2;

  return local(`# Leadership Pattern Report

**Scenario:** ${ctx.scenarioTitle}
**Role:** ${ctx.role || 'Architecture leader'}
**Generated:** ${new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}

---

## Starting challenge
${ctx.situation
  ? `The leader entered this scenario facing: "${ctx.situation}". The primary risk was not the technical content but whether the conversation could be held at the right leadership altitude.`
  : `The leader risked over-explaining the technical design and failing to make the decision frame explicit before the audience lost attention.`
}

## What VALOUR\u2122 helped prepare
The VALOUR\u2122 loop clarified audience, decision, key message, likely questions, risks to avoid, opening frame, and closing statement — before the real conversation.

## Main improvement observed
${hasOutputs
  ? 'The leader moved from explaining the technical design to framing the board decision as a conditional approval with clear trade-offs and next actions.'
  : 'Complete the full VALOUR loop for a personalised improvement observation.'
}

## Primary pattern detected
**Technical confidence without enough decision framing.**

Strong leaders in technical roles often know the right answer. The gap is in how they frame it for an audience that needs a decision, not a design explanation.

## Primary strength
Strong understanding of technical risk, controls, delivery constraints, and the real trade-offs involved. This is the foundation — the gap is in how it is communicated.

## Primary risk
Answering from implementation detail before establishing the leadership frame. When under pressure, the instinct is to explain more. The discipline is to frame first.

## Recommended next focus
> Start every board-level or executive answer with the decision frame first, then explain the supporting detail only as needed.

Practice this: before your next answer, ask yourself — "What decision am I helping this person make?" State that first.

## Useful language to retain

- "The recommendation is conditional approval, not unconditional approval."
- "The trade-off is [X] in order to achieve [Y]."
- "The decision I am asking for today is..."
- "If the group agrees, the next action is..."

---

*© 2026 ZenCloud Global Consultants. VALOUR\u2122 is a trademark of ZenCloud Global Consultants.*
`);
}

// ── VALLUM handover ────────────────────────────────────────────────────────────

export function generateVallumHandover(ctx: AgentContext): StageOutput {
  return local(`# VALLUM\u2122 Outcome Record

## Pilot complete
The VALOUR\u2122 loop for **${ctx.scenarioTitle}** is complete.

## Confidence summary
Review your confidence before and after the pilot. Record the shift in the evidence panel.

## Decision
Based on the pilot outcomes, what is the product decision?

- **Continue** — the loop proved useful. Run again with the next scenario.
- **Repeat** — run this scenario again before progressing.
- **Revise** — the workflow needs adjustment before the next run.
- **Pause** — gather more user evidence before the next cycle.

## What VALOUR\u2122 helped with
The workflow converted a technical preparation session into a leadership decision conversation. The language refinement step produced immediately usable executive-ready answers.

## Next VALOUR\u2122 scenario
Choose one of the following for the next pilot run:
- Executive Briefing — translate a technical decision into business language for senior stakeholders
- Challenging a Poor Solution — raise a concern without becoming a blocker
- Delivery Conflict — handle tension with a delivery lead under time pressure

## VITA\u2122 handover
Work is closed enough for today. The next professional action is scheduled. Personal mode is active.

> *This outcome was recorded by VALOUR\u2122 Pilot Console v0.2. Pattern data is stored locally in your browser.*
`);
}

// ── Dispatch ───────────────────────────────────────────────────────────────────

export function generateLocal(agent: string, ctx: AgentContext): StageOutput {
  switch (agent) {
    case 'scenarioSelector':   return generateScenarioSelection(ctx);
    case 'preparation':        return generatePreparationBrief(ctx);
    case 'rehearsal':          return generateRehearsalQuestions(ctx);
    case 'languageRefinement': return generateLanguageRefinement(ctx);
    case 'afterActionReview':  return generateAfterActionReview(ctx);
    case 'patternReport':      return generatePatternReport(ctx);
    case 'vallumHandover':     return generateVallumHandover(ctx);
    default:
      return local(`# ${agent}\n\nNo generator defined for this stage.`);
  }
}
