# Velocity Architecture Ecosystem — Release Matrix

Version: V0.1 | Date: 2026-06-05 | Built and verified this session

---

## Build Status Summary

All six repos verified against `npm install && npm run build` as of 2026-06-05.

| Repo | Build Result | Modules | Output Size | Notes |
|------|-------------|---------|-------------|-------|
| ordo-animi (app/) | ✅ PASS | 50 | 283 kB / 84 kB gz | vite build clean |
| pmi-portal | ✅ PASS | 1508 | 225 kB / 67 kB gz | tsc + vite, minor non-breaking warnings |
| ea-artefact-generator | ✅ PASS | 23 | 335 kB / 95 kB gz | vite + wrangler clean |
| ba-artefact-generator | ✅ PASS | 19 | 197 kB / 63 kB gz | vite build clean |
| sa-artefact-generator | ✅ PASS | 21 | 226 kB / 70 kB gz | vite build clean |
| pm-artefact-generator | ✅ PASS | 17 | 192 kB / 60 kB gz | vite + cloudflare plugin clean |

---

## Ecosystem Maturity Matrix

### Ordo Animi

| Field | Value |
|-------|-------|
| **Role** | Brain / Command and orchestration layer |
| **Current route** | https://www.ordoanimi.com |
| **Target route** | https://www.ordoanimi.com (internal, not a generator) |
| **Build status** | ✅ PASS |
| **Deployment status** | ✅ Live — Vercel auto-deploy from main |
| **Maturity status** | ✅ Ecosystem baseline docs added this session |
| **Key gaps** | Ordo Animi integration API not yet built; limb orchestration is manual |
| **Next action** | V0.5: smart report/export; V0.6: pilot run management. Integration API future phase. |

---

### PMO Portal (pmi-portal)

| Field | Value |
|-------|-------|
| **Role** | Torso / Governed engagement workspace and artefact lifecycle control |
| **Current route** | Not yet deployed to a named production URL |
| **Target route** | TBD — Cloudflare Pages or equivalent |
| **Build status** | ✅ PASS (TypeScript clean, 1508 modules) |
| **Deployment status** | ⚠️ No confirmed production route. Build works; Cloudflare Pages config to be set up. |
| **Maturity status** | 🟡 Workspace shell functional; lifecycle state machine not yet implemented |
| **Key gaps** | Production URL not set; artefact intake API not built; lifecycle state machine is UI-only |
| **Next action** | Configure Cloudflare Pages project. Confirm production URL. Wire artefact handoff contract. |

---

### EA Artefact Generator

| Field | Value |
|-------|-------|
| **Role** | Enterprise architecture limb — maturity reference baseline |
| **Current route** | https://ea.velocityarchitecture.com.au/ (Cloudflare Worker, custom domain via wrangler.jsonc) |
| **Target route** | https://ea.velocityarchitecture.com.au/ |
| **Build status** | ✅ PASS |
| **Deployment status** | ✅ Cloudflare Worker configured with `npm run deploy`. Custom domain in wrangler.jsonc. Deploy requires `wrangler auth`. |
| **Maturity status** | ✅ Reference baseline — full feature set, artefact catalogue, export, lifecycle language |
| **Key gaps** | PMO Portal handoff not wired; AI generation requires `ANTHROPIC_API_KEY` in Cloudflare env |
| **Next action** | Verify ea.velocityarchitecture.com.au live after next deploy. Run `npm run deploy` when Cloudflare auth available. |

---

### BA Artefact Generator

| Field | Value |
|-------|-------|
| **Role** | Business architecture and business analysis limb |
| **Current route** | https://ba-artefact-generator.phil-448.workers.dev/ |
| **Target route** | https://ba.velocityarchitecture.com.au/ |
| **Build status** | ✅ PASS |
| **Deployment status** | ✅ Cloudflare Worker configured with custom domain in wrangler.jsonc. `npm run deploy` ready. Deploy requires `wrangler auth`. |
| **Maturity status** | ✅ High — comprehensive docs, deployment plan, artefact catalogue, roadmap |
| **Key gaps** | Custom domain DNS must be live on Cloudflare; API key in Cloudflare env required for AI generation |
| **Next action** | Run `npm run deploy` with Cloudflare auth to push to ba.velocityarchitecture.com.au |

---

### SA Artefact Generator

| Field | Value |
|-------|-------|
| **Role** | Solution architecture limb (delivery-level) |
| **Current route** | https://sa-artefact-generator.pages.dev/ (Pages fallback, may not be configured) |
| **Target route** | https://sa.velocityarchitecture.com.au/ |
| **Build status** | ✅ PASS |
| **Deployment status** | 🟡 `wrangler.toml` added this session for Cloudflare Pages. GitHub integration to Cloudflare Pages not yet confirmed. Fallback Pages project may not exist yet. |
| **Maturity status** | 🟡 App functional, docs added this session. Thinnest limb — artefact generation exists but narrower than EA/BA/PM. |
| **Key gaps** | Cloudflare Pages project `sa-artefact-generator` needs to be created and connected to GitHub. Custom domain DNS to be configured. |
| **Next action** | Create Cloudflare Pages project, connect `ZenCloudAU/sa-artefact-generator`, set build command `npm run build`, output `dist`. Or run `npx wrangler pages deploy dist --project-name=sa-artefact-generator`. |

---

### PM Artefact Generator

| Field | Value |
|-------|-------|
| **Role** | Project, programme, governance, and executive delivery artefact limb |
| **Current route** | https://pm.velocityarchitecture.com.au/ (confirmed live per README) |
| **Target route** | https://pm.velocityarchitecture.com.au/ |
| **Build status** | ✅ PASS |
| **Deployment status** | ✅ Live on Cloudflare Pages. Fallback: https://pm-artefact-generator.pages.dev/. Auto-deploy on main push. |
| **Maturity status** | 🟡 V0.1.0-uat baseline. Live and functional; docs added this session. Artefact set narrower than EA. |
| **Key gaps** | Artefact catalogue needs expansion; PMO Portal handoff not wired; persistence beyond localStorage |
| **Next action** | Push this session's docs commit to trigger auto-deploy. Expand artefact types in next sprint. |

---

## Deployment Action Summary

| Repo | Action Required | Command |
|------|----------------|---------|
| ordo-animi | Push to trigger Vercel auto-deploy | `git push origin main` |
| pmi-portal | Create Cloudflare Pages project, configure, push | See docs/deployment.md |
| ea-artefact-generator | Run deploy with Cloudflare auth | `npm run deploy` |
| ba-artefact-generator | Run deploy with Cloudflare auth | `npm run deploy` |
| sa-artefact-generator | Create Pages project, connect GitHub | See docs/DEPLOYMENT_ALIGNMENT.md |
| pm-artefact-generator | Push — auto-deploys via Pages | `git push origin main` |

---

## Session Changes (2026-06-05)

**Files added this session:**

| Repo | Files Added |
|------|-------------|
| ordo-animi | docs/ECOSYSTEM_MATURITY_BASELINE.md, docs/ECOSYSTEM_CONTRACT_V0_1.md, docs/ECOSYSTEM_RELEASE_MATRIX.md |
| ea-artefact-generator | docs/ECOSYSTEM_ALIGNMENT.md |
| ba-artefact-generator | docs/ECOSYSTEM_ALIGNMENT.md, docs/DEPLOYMENT_ALIGNMENT.md |
| sa-artefact-generator | docs/ECOSYSTEM_ALIGNMENT.md, docs/DEPLOYMENT_ALIGNMENT.md, docs/SECURITY_AND_DATA.md, wrangler.toml |
| pm-artefact-generator | docs/ECOSYSTEM_ALIGNMENT.md, docs/DEPLOYMENT_ALIGNMENT.md, docs/SECURITY_AND_DATA.md |
| pmi-portal | docs/ECOSYSTEM_ALIGNMENT.md, docs/ARTEFACT_HANDOFF_CONTRACT.md |

No source code was modified. No secrets were committed. All changes are documentation and configuration only.
