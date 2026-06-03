# VALOUR Pilot Data Model

Version: 0.1
Status: Private data model
Release: Pilot Ready

## Purpose

This document defines the information VALOUR needs during the first manual pilot.

The goal is to collect enough data to run the pilot, measure usefulness, and prepare for later architecture design without collecting unnecessary sensitive material.

## Data principle

Capture the minimum useful data.

Do not collect confidential client names, proprietary architecture detail, or sensitive commercial information unless there is a clear reason and permission.

Use anonymised examples wherever possible.

## Core records

The pilot data model has seven core records:

1. Pilot user
2. Organisation context
3. Scenario
4. Preparation brief
5. Rehearsal record
6. After-action review
7. Pattern report

## Pilot user record

User ID:

Name:

Role:

Seniority level:

Architecture background:

Primary leadership challenge:

Communication pattern:

Confidence baseline:

Participation note:

## Organisation context record

Organisation type:

Industry:

Team type:

Stakeholder environment:

Confidentiality level:

Notes:

Avoid capturing the organisation name if anonymisation is preferred.

## Scenario record

Scenario ID:

Scenario name:

Scenario category:

Real-world date:

Audience:

Decision or outcome required:

Key risk:

Likely questions:

Desired outcome:

The scenario is the centre of the pilot. Every pilot should have one clear scenario.

## Preparation brief record

Opening frame:

Key message:

Decision required:

Questions to ask:

Likely pushback:

Risks to avoid:

Recommended tone:

Closing statement:

The preparation brief should be short enough to use before a real meeting.

## Rehearsal record

Prompt used:

User answer:

Feedback:

Improved answer:

Short version:

Executive version:

Empathetic version:

Decision version:

The rehearsal record captures learning. It does not need to capture everything said.

## After-action review record

What happened:

Outcome:

Stakeholder response:

What worked:

What did not work:

Where clarity improved:

Where cadence improved:

Where empathy was shown:

Where authority was shown:

What should change next time:

Confidence after support:

The after-action review is the evidence bridge between preparation and real-world usefulness.

## Pattern report record

Primary pattern detected:

Primary strength:

Primary risk:

Best language improvement:

Next development focus:

Pilot usefulness score:

Recommendation candidate:

Recommended next step:

The pattern report is the user-facing summary at the end of the pilot.

## Measurement fields

Minimum measurement fields:

- Confidence before
- Confidence after
- Scenario completed
- Rehearsal completed
- Real-world use completed
- After-action review completed
- User usefulness score
- Would recommend
- Would pay or sponsor
- Best scenario fit

## Data storage for manual pilot

For the first manual pilot, Markdown files are enough.

Suggested folder structure:

`pilot-data/users/`

`pilot-data/scenarios/`

`pilot-data/rehearsals/`

`pilot-data/reviews/`

`pilot-data/reports/`

These folders should remain private.

## Future architecture implications

The later product architecture should support user profile, scenario records, prompt history, rehearsal notes, reviews, pattern reports, exportable summaries, anonymised analytics, permission controls, and data retention rules.

## Data risk

The biggest data risk is capturing too much sensitive organisational detail too early.

Keep the manual pilot lean.

The product is testing leadership preparation, not storing enterprise architecture secrets.


---

*© 2026 ZenCloud Global Consultants. Proprietary and confidential. All rights reserved.*