# Design: VALOUR™ Pilot Console — UX & Theme

Date: 2026-06-03
Status: Approved
Author: Phil Myint / The OrdoAnimi Group

---

## Summary

Replace the current single-column stacked layout and warm amber palette with a sidebar-navigator console using an azure intelligence theme. Goal: reduce information density, improve navigation clarity, and establish a visual identity distinct from the Velocity Architecture Framework warm amber palette.

---

## Palette

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#07111e` | Page background |
| `--surface` | `#0e1825` | Shell / card base |
| `--surface-raised` | `#162338` | Elevated cards |
| `--sidebar-bg` | `#0b1520` | Top bar + sidebar |
| `--border` | `rgba(56,189,248,.1)` | Default borders |
| `--border-strong` | `rgba(56,189,248,.25)` | Active / emphasis borders |
| `--accent` | `#38bdf8` | Primary azure — eyebrows, active dots, buttons |
| `--accent-soft` | `rgba(56,189,248,.08)` | Tinted surface backgrounds |
| `--green` | `#34d399` | Evidence captured, Continue decision, confidence-after |
| `--text` | `#e2f0ff` | Primary text |
| `--text-muted` | `#7a9ab8` | Descriptions, secondary |
| `--text-dim` | `#5a7a96` | Labels, metadata, done-stage names |
| `--text-faint` | `#3d5a72` | Section labels, dividers |

Font: Inter (already loaded). No font changes required.

---

## Layout Structure

### Shell

Single `border-radius: 18px` container, max-width 1200px, centered. One `box-shadow` with a faint azure outer glow. No hero panel.

### Top Bar (fixed height ~50px)

```
[ VALOUR™ ] [ | ] [ Pilot name ] ————————— [ Confidence 5→8 ] [ Decision: Continue ] [ pill ]
```

- Logo: azure, 11px, 700, uppercase, wide tracking
- Divider: 1px vertical, faint azure
- Pilot title: text-primary, 13px, 600
- Metrics: label (dim, 10px) + value (text or green)
- Status pill: green or azure variant

### Body (flex row, fixed height ~540px)

**Sidebar (220px fixed)**
- `#0b1520` background, right border faint azure
- Pilot card at top: eyebrow label, pilot name, scenario subtitle
- Section label: "Workflow" (faint, 9px uppercase)
- Stage list: 8 items, each with status dot + number + name
  - `done`: green dot, muted text, 0.65 opacity
  - `active`: azure dot with glow ring, bold name, left azure border strip, `rgba(56,189,248,.08)` bg
  - `pending`: grey dot, dim text

**Main content (flex: 1, scrollable)**

Stage detail card:
- Eyebrow: `Stage 04 of 08 · Rehearsal`
- Title: 20px, 700
- Description: muted, 13px, max-width ~560px
- Badges: `Evidence captured` (green tint) + source filename (monospace, dim)
- Operator note: left-bordered azure strip, muted italic text
- Actions: `Open artefact` (primary azure button) + `← Previous` + `Next →`

Bottom row (2-column grid):
- **Confidence card**: label + large `5 → 8` type (before=dim 28px, arrow=azure, after=green 36px) + description
- **Decision card**: label + decision value (azure 22px bold) + rationale description

---

## Component Tokens

### Buttons
- Primary: `background: #38bdf8`, `color: #0b1520`, bold
- Default: `background: rgba(56,189,248,.08)`, `border: rgba(56,189,248,.2)`, `color: #c8dff0`
- Ghost: transparent background, dim text

### Badges
- Evidence: `rgba(52,211,153,.1)` bg, green border, green text
- Source: `rgba(56,189,248,.06)` bg, faint border, monospace, dim text
- Pill (complete): green tint + border
- Pill (in-progress): azure tint + border

### Stage dots
- Done: `#34d399` solid
- Active: `#38bdf8` + `box-shadow: 0 0 0 3px rgba(56,189,248,.2)`
- Pending: `rgba(255,255,255,.12)` solid

---

## Files to Create / Modify

| File | Action |
|---|---|
| `app/src/styles/app.css` | Full rewrite — new palette, sidebar layout, all tokens |
| `app/src/App.tsx` | Restructure: topbar + sidebar + main layout, active stage state |
| `app/src/components/PilotHeader.tsx` | Replace with `TopBar` component |
| `app/src/components/PilotStageTimeline.tsx` | Replace with `Sidebar` component (stage nav list) |
| `app/src/components/PilotStageCard.tsx` | Replace with `StageDetail` (single-stage focused view) |
| `app/src/components/EvidencePanel.tsx` | Restyle: confidence large-type card |
| `app/src/components/ProductDecisionPanel.tsx` | Restyle: decision value card |
| `app/src/components/ArtifactViewer.tsx` | Keep, restyle to match new palette |
| `app/src/components/OperatorNotes.tsx` | Keep, restyle to match new palette |

---

## State

App needs one piece of local state: `activeStageIndex` (number, default `pilot.stages.length - 1` for complete pilots, or first incomplete for in-progress). Stage list items click to update it. Previous/Next buttons also update it.

No external state library needed — `useState` in `App.tsx` is sufficient.

---

## Responsive

At `< 900px`: sidebar collapses to hidden (or a toggle button). Main goes full width. Not in scope for this sprint — desktop-first for operator console.

---

## Out of Scope

- Animations / transitions (can be added later)
- Dark/light mode toggle
- Mobile layout
- Any new data or business logic
- Additional pages or routes
