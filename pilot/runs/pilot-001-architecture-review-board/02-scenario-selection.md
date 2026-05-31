# Pilot 001 Scenario Selection

## User story

As a VALOUR pilot operator, I want to map the user's situation to the best-fit scenario so that preparation and rehearsal use the right operating path.

## Acceptance criteria

- One primary scenario is selected.
- Scenario fit is explained.
- Scenario variant is noted if needed.
- User risk and stakeholder risk are captured.

## Success criteria

Scenario selection is successful when the operator can proceed to preparation without debating the scenario category.

## Selected scenario

Scenario ID: VALOUR-S01

Scenario name: Architecture Review Board

Scenario category: Architecture leadership

Scenario variant: Cloud integration design under delivery pressure

## Why this scenario fits

The user is preparing to present a design recommendation to an architecture review board and needs endorsement to proceed. The leadership risk is not the technical design itself. The leadership risk is whether the architect can frame the decision, explain the trade-off, handle risk questions, and close the discussion without becoming too technical or defensive.

## User risk

The architect may over-explain the implementation detail, respond defensively to security or governance questions, and fail to hold the conversation at the right altitude.

## Stakeholder risk

The board may not understand what decision is required, may see the recommendation as under-governed, or may defer the decision because the trade-off is unclear.

## Desired outcome

The board endorses the direction or gives a clear conditional approval with documented risks, mitigations, and next actions.

## Scenario prompt path

Preparation prompt: Clarify decision required, recommendation, options, trade-offs, risks, standards alignment, likely questions, and closing statement for an architecture review board.

Rehearsal prompt: Simulate an architecture review board. Ask questions about risk, standards, business alignment, implementation feasibility, decision quality, and clarity. Ask one question at a time and provide feedback after each answer.

Language refinement prompt: Improve the architect's answer into short, executive, empathetic, and decision-oriented versions.

Review prompt: Review whether the architect made the decision clear, stayed at the right altitude, handled questions cleanly, and explained trade-offs well.

## Operator notes

This is the cleanest first simulated pilot scenario because it exercises the core VALOUR promise: helping an architect turn a technical design into a leadership decision conversation.
