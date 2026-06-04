# Velocity Architecture Ecosystem — Release Matrix

Version: V0.2 | Date: 2026-06-05 | Updated: CI workflows added

---

## Build and CI Summary

| Repo | Local Build | CI Workflow | Validation Steps |
|------|-------------|-------------|-----------------|
| ordo-animi (app/) | ✅ PASS | ✅ build.yml added | install → build |
| pmi-portal | ✅ PASS | ✅ ci.yml (pre-existing, updated Node→22) | type-check → lint → build |
| ea-artefact-generator | ✅ PASS | ✅ build.yml added | lint → build |
| ba-artefact-generator | ✅ PASS | ✅ build.yml added + package-lock.json committed | lint → build |
| sa-artefact-generator | ✅ PASS | ✅ build.yml added | lint → build |
| pm-artefact-generator | ✅ PASS | ✅ build.yml added + package-lock.json committed | lint → build |

All build checks run on: push to main, pull_request to main.
All workflows use Node 22 and `npm ci` (deterministic installs).

---

## Deployment Status Matrix

### Ordo Animi

| Field | Value |
|-------|-------|
| **Role** | Brain / Command and orchestration layer |
| **Current route** | https://www.ordoanimi.com |
| **Target route** | https://www.ordoanimi.com |
| **CI status** | ✅ build.yml — push/PR gated |
| **Deployment method** | Vercel — GitHub integration auto-deploys on push to main |
| **Deployment status** | ✅ Auto-deploy active. No Actions secrets required. |
| **Platform setup required** | None |
| **Key gaps** | Ordo integration API (future phase) |

---

### PMO Portal (pmi-portal)

| Field | Value |
|-------|-------|
| **Role** | Torso / Governed engagement workspace and artefact lifecycle control |
| **Current route** | Not confirmed — GitHub Pages URL via existing deploy.yml |
| **Target route** | TBD — Cloudflare Pages preferred |
| **CI status** | ✅ ci.yml (pre-existing) — type-check → lint → build, Node 22 |
| **Deployment method** | GitHub Pages (existing deploy.yml). Cloudflare Pages not yet configured. |
| **Deployment status** | ⚠️ Deploys to GitHub Pages. Production URL not confirmed. Cloudflare Pages project not set up. |
| **Platform setup required** | Create Cloudflare Pages project for pmi-portal. Connect to ZenCloudAU/pmi-portal. Confirm production URL. Update docs/deployment.md. |
| **Security note** | Existing ci.yml passes `VITE_ANTHROPIC_API_KEY` at build time. Review before production — prefer server-side secrets. |
| **Key gaps** | Production URL, Cloudflare Pages connection, lifecycle state machine |

---

### EA Artefact Generator

| Field | Value |
|-------|-------|
| **Role** | Enterprise architecture limb — maturity reference baseline |
| **Current route** | https://ea.velocityarchitecture.com.au/ (Cloudflare Worker, custom domain) |
| **Target route** | https://ea.velocityarchitecture.com.au/ |
| **CI status** | ✅ build.yml added — lint → build |
| **Deployment method** | Cloudflare Worker via `wrangler deploy` |
| **Deployment status** | ⚠️ Not deploying from CI. Requires repo secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. |
| **Platform setup required** | Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` to GitHub repo secrets. Location: GitHub → ZenCloudAU/ea-artefact-generator → Settings → Secrets and variables → Actions. |
| **Key gaps** | Wrangler deploy workflow (post-secret setup). PMO Portal handoff. |

---

### BA Artefact Generator

| Field | Value |
|-------|-------|
| **Role** | Business architecture and business analysis limb |
| **Current route** | https://ba-artefact-generator.phil-448.workers.dev/ |
| **Target route** | https://ba.velocityarchitecture.com.au/ |
| **CI status** | ✅ build.yml added — lint → build. package-lock.json committed. |
| **Deployment method** | Cloudflare Worker via `wrangler deploy` (custom domain configured in wrangler.jsonc) |
| **Deployment status** | ⚠️ Not deploying from CI. Requires repo secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. |
| **Platform setup required** | Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` to GitHub repo secrets. Location: GitHub → ZenCloudAU/ba-artefact-generator → Settings → Secrets and variables → Actions. |
| **Key gaps** | Wrangler deploy workflow (post-secret setup). Custom domain DNS confirmation. |

---

### SA Artefact Generator

| Field | Value |
|-------|-------|
| **Role** | Solution architecture limb (delivery-level) |
| **Current route** | Not confirmed live |
| **Target route** | https://sa.velocityarchitecture.com.au/ |
| **CI status** | ✅ build.yml added — lint → build |
| **Deployment method** | Cloudflare Pages via GitHub integration (preferred — no Actions secrets needed) |
| **Deployment status** | ⚠️ Cloudflare Pages project not yet created. wrangler.toml committed. |
| **Platform setup required** | 1. Create Cloudflare Pages project `sa-artefact-generator`. 2. Connect to ZenCloudAU/sa-artefact-generator. 3. Set build command: `npm run build`, output dir: `dist`, Node: 22. 4. Add custom domain `sa.velocityarchitecture.com.au`. Location: Cloudflare Dashboard → Pages → Create project. |
| **Key gaps** | Pages project creation (one-time dashboard setup) |

---

### PM Artefact Generator

| Field | Value |
|-------|-------|
| **Role** | Project, programme, governance, and executive delivery artefact limb |
| **Current route** | https://pm.velocityarchitecture.com.au/ |
| **Target route** | https://pm.velocityarchitecture.com.au/ |
| **CI status** | ✅ build.yml added — lint → build. package-lock.json committed. |
| **Deployment method** | Cloudflare Pages via GitHub integration (auto-deploys on push to main) |
| **Deployment status** | ✅ Live. Push to main triggers Cloudflare Pages auto-deploy. No Actions secrets needed. |
| **Platform setup required** | None — already connected |
| **Key gaps** | Artefact catalogue expansion. PMO Portal handoff. |

---

## GitHub Actions Secret Requirements

For Cloudflare Worker deployments (EA and BA), the following secrets must be added to each repo:

| Secret | Description | Where to add |
|--------|-------------|--------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Worker edit permissions | GitHub → ZenCloudAU/{repo} → Settings → Secrets and variables → Actions → New repository secret |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | Same location |

**EA:** GitHub → ZenCloudAU/ea-artefact-generator → Settings → Secrets
**BA:** GitHub → ZenCloudAU/ba-artefact-generator → Settings → Secrets

**Cloudflare API token creation:** Cloudflare Dashboard → My Profile → API Tokens → Create Token → Edit Cloudflare Workers template.

Once secrets are added, a `deploy.yml` workflow using `wrangler deploy` can be added to each repo for automated deployment on push to main.

---

## Deployment Action Summary

| Repo | Deployment Trigger | Status | Action Required |
|------|-------------------|--------|----------------|
| ordo-animi | Vercel GitHub integration | ✅ Active | None |
| pm-artefact-generator | CF Pages GitHub integration | ✅ Active | None |
| pmi-portal | GitHub Pages (existing deploy.yml) | ⚠️ Route not confirmed | Create CF Pages project, confirm URL |
| ea-artefact-generator | Manual `wrangler deploy` / future Actions | ⚠️ Blocked by missing secrets | Add `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` to repo secrets |
| ba-artefact-generator | Manual `wrangler deploy` / future Actions | ⚠️ Blocked by missing secrets | Add `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` to repo secrets |
| sa-artefact-generator | CF Pages GitHub integration (not yet set up) | ⚠️ Pages project missing | Create `sa-artefact-generator` CF Pages project |

---

## Session Changes (2026-06-05 — CI Pass)

**Workflows added or updated:**

| Repo | Action | Checks |
|------|--------|--------|
| ordo-animi | Added `.github/workflows/build.yml` | install → build |
| ea-artefact-generator | Added `.github/workflows/build.yml` | lint → build |
| ba-artefact-generator | Added `.github/workflows/build.yml` + committed `package-lock.json` | lint → build |
| sa-artefact-generator | Added `.github/workflows/build.yml` | lint → build |
| pm-artefact-generator | Added `.github/workflows/build.yml` + committed `package-lock.json` | lint → build |
| pmi-portal | Updated Node 20 → 22 in existing `ci.yml` | type-check → lint → build |

---

## Ecosystem Docs (Previous Session)

| Repo | Files Added |
|------|-------------|
| ordo-animi | ECOSYSTEM_MATURITY_BASELINE.md, ECOSYSTEM_CONTRACT_V0_1.md |
| ea-artefact-generator | docs/ECOSYSTEM_ALIGNMENT.md |
| ba-artefact-generator | docs/ECOSYSTEM_ALIGNMENT.md, docs/DEPLOYMENT_ALIGNMENT.md |
| sa-artefact-generator | docs/ECOSYSTEM_ALIGNMENT.md, docs/DEPLOYMENT_ALIGNMENT.md, docs/SECURITY_AND_DATA.md, wrangler.toml |
| pm-artefact-generator | docs/ECOSYSTEM_ALIGNMENT.md, docs/DEPLOYMENT_ALIGNMENT.md, docs/SECURITY_AND_DATA.md |
| pmi-portal | docs/ECOSYSTEM_ALIGNMENT.md, docs/ARTEFACT_HANDOFF_CONTRACT.md |
