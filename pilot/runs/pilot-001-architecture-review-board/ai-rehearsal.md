# AI Rehearsal

Pilot: Pilot 001 - Architecture Review Board

Status: Complete

## Role-Play Setup

The AI plays the architecture review board. The user plays the senior solution architect presenting the cloud integration design.

Rehearsal objective:

Keep the conversation at decision level, answer challenge calmly, and close with clear approval conditions.

## Opening Prompt

"You have two minutes to frame the recommendation for the board. State the decision required, the recommendation, the trade-off, and the risk position."

## User Draft Answer

"The design uses a governed integration pattern with cloud-hosted services, event handling, validation, monitoring, and security controls. We looked at a few different integration options and this one gives us the best balance. The data flows through controlled interfaces and we have logging in place. There are some open items around audit evidence and control mapping, but those are manageable. I can walk through the architecture if that helps."

## VALOUR Feedback

The answer is technically credible but too broad. The decision is not stated early enough. The board may hear that the design is complicated before they hear what they are being asked to approve.

Improve by:

- leading with the requested decision
- naming the recommendation
- stating the trade-off plainly
- separating approval from implementation detail
- offering detail only after the board has the frame

## Improved Opening

"The decision I am asking for today is conditional endorsement of the proposed cloud integration pattern. My recommendation is to proceed because it gives us the best balance of delivery timing, auditability, and platform fit. The trade-off is that we accept some managed integration complexity now rather than delay delivery for a broader platform redesign. The residual risk is control evidence, which I recommend we handle through a recorded security checkpoint before go-live."

## Board Challenge Questions

### Challenge 1: Security

"You are saying the controls are manageable, but what exactly remains open?"

User draft answer:

"There are a few control mappings still to finalise. The design supports the logging and audit requirements, and we have mechanisms to capture the right events. The implementation team will need to make sure these are configured correctly."

VALOUR feedback:

This answer sounds vague and shifts responsibility to implementation. Be explicit about what is open and how it will be governed.

Improved answer:

"The open item is evidence mapping, not the control pattern itself. The design supports the required logging and ownership model. My recommendation is that approval includes a condition that security signs off the evidence mapping before production readiness."

### Challenge 2: Platform Debt

"Are we creating another integration pattern the platform team has to support?"

User draft answer:

"Not really. It is aligned with the direction we have been discussing, and there are reasons why the other options were not suitable. The platform team has been involved, and we can make sure the design is supportable."

VALOUR feedback:

The answer is defensive and imprecise. Acknowledge the trade-off, then explain why it is acceptable.

Improved answer:

"There is some support impact, and I want to be clear about that. The reason I still recommend this path is that it stays within the target direction while avoiding a larger redesign that would delay the programme. I would record supportability as an architecture checkpoint rather than treat it as a blocker today."

### Challenge 3: Delivery Pressure

"If we add conditions, does that put the timeline at risk?"

User draft answer:

"It depends how quickly we can get through the actions. They should not be too difficult, and the team is already aware of most of them."

VALOUR feedback:

This sounds uncertain. Give a firmer boundary.

Improved answer:

"The conditions protect the timeline rather than threaten it. They allow delivery to proceed while making the assurance work explicit. Without those conditions, we risk a later stop point when the cost of correction is higher."

### Challenge 4: Business Impact

"What is the business consequence if we do not approve today?"

User draft answer:

"The team would need to revisit options and there would likely be some delay while we confirm the design direction."

VALOUR feedback:

Good start, but make the implication clearer.

Improved answer:

"If we do not approve today, the programme loses decision clarity and the team will either pause or proceed without a recorded governance position. My recommendation avoids both outcomes: proceed, but with explicit conditions."

## Rehearsal Outcome

The improved answers are shorter, calmer, and more decision-oriented. The user can now respond to challenge without adding excessive technical detail or sounding defensive.

## Operator Notes

The strongest improvement is the security response. It converts a vague technical defence into a clear approval condition.
