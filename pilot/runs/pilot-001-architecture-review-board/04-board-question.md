# Pilot 001 Board Question

## User story

As a VALOUR pilot user, I want to practise one board question so that I can improve my answer before the meeting.

## Acceptance criteria

The question, first answer, improved answer, and learning point are recorded.

## Success criteria

This step is complete when the user has one improved answer they would use in the meeting.

## Scenario

Architecture review board for a cloud integration design.

## Question

A board member asks how the design will remain auditable and controlled while still meeting the delivery timeline.

## First answer

The design uses centralised logging, controlled service identities, and documented checkpoints. The trade-off is that we avoid the heaviest pattern for the first release so delivery can continue without unnecessary complexity.

## Improved answer

That is the right question. I am asking for conditional approval, not unconditional approval. The design keeps auditability through centralised logging, controlled identities, and a required checkpoint before the next release gate. The trade-off is speed with controlled governance, not speed without governance.

## Learning point

Start with the decision frame before explaining implementation detail.

## Next focus

Practise answering a question about future platform debt in under ninety seconds.
