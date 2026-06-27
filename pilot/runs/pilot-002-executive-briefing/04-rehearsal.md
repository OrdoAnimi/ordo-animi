# Stage 04 — Rehearsal

## Pilot ID

PILOT-002

## User ID

SIM-002

## Practice question used

"What is the single biggest risk with the migration and what are you doing about it?"

## First answer (raw)

The re-platform path introduces a 14-month dependency chain across the middleware layer. We have identified six critical integration points that need to be refactored before we can cut over. The lift-and-shift path avoids most of that complexity but leaves us with a 36-month technical debt position that will cost more to unwind later. We have the capability to do the re-platform but the timeline is the risk.

## Why this answer is insufficient

- Leads with architecture language (dependency chain, middleware layer, integration points, lift-and-shift, re-platform).
- Quantifies complexity (14-month, six integration points, 36-month) without translating those numbers into business consequence.
- Does not name the risk in terms the CFO or CIO can act on.
- Does not state the mitigation clearly.
- No closing position — the answer trails off rather than landing on a recommendation.

## Improved answer

The biggest risk is timeline. If the migration runs longer than planned, we carry the cost of two environments and delay the capability benefits by up to one quarter. We are managing that risk through a phased delivery model with a hard gate at month six. If the programme is not on track at that gate, we have a defined decision point to pause or adjust scope — without having committed the full investment. The recommendation is to proceed on that basis.

## Key learning

The improved answer leads with the risk in business terms (timeline, dual environment cost, capability delay) rather than architecture terms. It names the mitigation as a business control (phased delivery model, hard gate) rather than a technical control. It ends with a recommendation rather than a trailing explanation.

## Operator note

Key learning: first answer defaulted to architecture-layer language (dependency chains, re-platform complexity). Improved answer led with financial risk framing and business consequence before technical detail. The pattern is clear: the user's instinct is to explain the architecture. The VALOUR loop redirects that instinct toward executive consequence framing.


---

*© 2026 The OrdoAnimi Group. Proprietary and confidential. All rights reserved.*
