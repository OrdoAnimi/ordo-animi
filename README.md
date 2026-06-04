# StudioSix

**Private — ZenCloudAU product studio and publishing layer.**

StudioSix is the product studio for the ZenCloudAU ecosystem. It exists to package architecture-led ideas into usable public assets, digital products, content systems, client-facing materials, and experimental product launches.

StudioSix is not the core advisory business and it is not the Velocity Architecture Framework itself. Its role is to produce, polish, package, publish, and commercialise the work created across the wider ecosystem.

## Purpose

StudioSix provides the creative and product execution layer for ZenCloudAU. It supports brand systems, landing pages, publication assets, product packaging, media-ready content, design artefacts, and go-to-market experiments.

The repository should remain focused on StudioSix as a studio brand and delivery surface. Product-specific material should live in the correct product repository unless it is being deliberately packaged or promoted through StudioSix.

## Ecosystem Role

- **ZenCloud Advisory** — the commercial advisory and consulting front door.
- **Velocity Architecture Framework** — the public architecture method, templates, research, tools, and framework IP.
- **Velocity Academy** — the learning, certification, practitioner pathway, and course layer.
- **StudioSix** — the product studio, publishing system, creative wrapper, and commercial packaging layer.
- **Product applications** — artefact generators, PMO tools, specialist apps, and experiments that may be branded, launched, or packaged through StudioSix.

## What Belongs Here

StudioSix should contain only material that supports the studio identity, publishing layer, product packaging, and public-facing creative/commercial wrapper.

Appropriate content includes:

- StudioSix website source and public pages
- StudioSix brand language and positioning
- Shared studio design tokens and theme decisions
- Product packaging pages and launch assets
- Publishing workflow documentation
- Media, campaign, and content production templates
- Ecosystem showcase pages linking to ZenCloud, Velocity Architecture, Velocity Academy, and selected product tools

## What Does Not Belong Here

The following should not be stored directly in this repository unless there is a deliberate StudioSix packaging reason:

- Core Velocity Architecture Framework source material
- ZenCloud Advisory service pages
- Product application source code for standalone products
- Private Obsidian operating memory
- Client-specific delivery artefacts
- Certification course content that belongs under Velocity Academy
- Experimental apps that should remain in their own repositories

## Theme Centralisation

StudioSix should use a centralised theme model instead of scattering colours, spacing, typography, layout rules, or component styling across individual pages.

The preferred structure is:

```text
src/theme/
  tokens.ts          # brand colours, typography, spacing, radius, shadows
  navigation.ts      # global navigation and ecosystem links
  content.ts         # repeatable page copy and content blocks where appropriate

src/components/
  layout/            # header, footer, shell, page sections
  ui/                # buttons, cards, badges, panels, callouts

src/styles/
  globals.css        # base styles and CSS variables
```

If this repo is implemented as a static HTML site rather than a React/Vite app, the same principle still applies:

```text
assets/css/theme.css
assets/css/components.css
assets/js/navigation.js
partials/header.html
partials/footer.html
```

The rule is simple: one brand system, one navigation system, one source of styling truth.

## Current Governance Position

StudioSix is part of the ZenCloudAU product estate and should be managed as a production-facing brand repository.

Before any major release, confirm:

- StudioSix positioning is distinct from ZenCloud Advisory and Velocity Architecture.
- Shared theme and navigation are centralised.
- Public links route to the correct ecosystem destination.
- No copied README or template content from another repository remains.
- No private product, client, or operating-memory content is exposed.
- Cloudflare DNS, WAF, cache, and production routing are aligned to the active domain.

## Status

Active development. Private repository.

## Licence

Proprietary. © 2026 Phil Myint / ZenCloudAU. All rights reserved.
