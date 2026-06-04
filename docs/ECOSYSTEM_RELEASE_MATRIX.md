# Velocity Architecture Ecosystem — Release Matrix

Version: V0.3 | Date: 2026-06-05 | Updated: platform setup completed, deployment workflows added

---

## Build and CI Summary

| Repo | Build | CI Workflow | Validation Steps |
|------|-------|-------------|-----------------|
| ordo-animi (app/) | ✅ PASS | ✅ build.yml | install → build |
| pmi-portal | ✅ PASS | ✅ ci.yml | type-check → lint → build |
| ea-artefact-generator | ✅ PASS | ✅ build.yml + deploy.yml | lint → build → deploy |
| ba-artefact-generator | ✅ PASS | ✅ build.yml + deploy.yml | lint → build → deploy |
| sa-artefact-generator | ✅ PASS | ✅ build.yml | lint → build |
| pm-artefact-generator | ✅ PASS | ✅ build.yml | lint → build |

All build checks run on push to main and pull_request to main. Deploy workflows run on push to main and workflow_dispatch where configured.

---

## Deployment Status Matrix

### Ordo Animi

| Field | Value |
|-------|-------|
| **Role** | Brain / command and orchestration layer |
| **Current route** | https://www.ordoanimi.com |
| **Target route** | https://www.ordoanimi.com |
| **CI status** | ✅ GitHub Actions build workflow active |
| **Deployment method** | Vercel GitHub integration |
| **Deployment status** | ✅ Live / auto-deploy active |
| **Platform setup required** | None |
| **Key gaps** | Ordo-to-limb orchestration API design |

---

### PMO Portal (pmi-portal)

| Field | Value |
|-------|-------|
| **Role** | Torso / governed engagement workspace and artefact lifecycle control |
| **Current route** | https://pmo.velocityarchitecture.com.au/ |
| **Target route** | https://pmo.velocityarchitecture.com.au/ |
| **CI status** | ✅ GitHub Actions CI workflow active |
| **Deployment method** | Cloudflare Pages via GitHub integration |
| **Deployment status** | ✅ Platform setup completed by operator; deployment verification pending |
| **Platform setup required** | None reported |
| **Security note** | Review any `VITE_ANTHROPIC_API_KEY` usage before production AI enablement. Production model-provider keys must be server-side only. |
| **Key gaps** | Lifecycle state machine implementation; artefact intake contract UI; provider secret hardening |

---

### EA Artefact Generator

| Field | Value |
|-------|-------|
| **Role** | Enterprise architecture limb — maturity reference baseline |
| **Current route** | https://ea.velocityarchitecture.com.au/ |
| **Target route** | https://ea.velocityarchitecture.com.au/ |
| **CI status** | ✅ GitHub Actions build workflow active |
| **Deployment method** | Cloudflare Worker via GitHub Actions deploy workflow using repo secrets |
| **Deployment status** | ✅ Deploy workflow added; platform secrets reported complete; deployment verification pending |
| **Platform setup required** | None reported |
| **Key gaps** | PMO Portal handoff implementation |

---

### BA Artefact Generator

| Field | Value |
|-------|-------|
| **Role** | Business architecture and business analysis limb |
| **Current route** | https://ba.velocityarchitecture.com.au/ |
| **Target route** | https://ba.velocityarchitecture.com.au/ |
| **CI status** | ✅ GitHub Actions build workflow active |
| **Deployment method** | Cloudflare Worker via GitHub Actions deploy workflow using repo secrets |
| **Deployment status** | ✅ Deploy workflow added; platform secrets reported complete; deployment verification pending |
| **Platform setup required** | None reported |
| **Key gaps** | BA-to-EA/SA/PMO handoff implementation; traceability panel |

---

### SA Artefact Generator

| Field | Value |
|-------|-------|
| **Role** | Solution architecture limb — delivery-level solution design and handoff |
| **Current route** | https://sa.velocityarchitecture.com.au/ |
| **Target route** | https://sa.velocityarchitecture.com.au/ |
| **CI status** | ✅ GitHub Actions build workflow active |
| **Deployment method** | Cloudflare Pages via GitHub integration |
| **Deployment status** | ✅ Platform setup completed by operator; deployment verification pending |
| **Platform setup required** | None reported |
| **Key gaps** | Artefact breadth uplift; lifecycle/output-management maturity |

---

### PM Artefact Generator

| Field | Value |
|-------|-------|
| **Role** | Project, programme, governance, and executive delivery artefact limb |
| **Current route** | https://pm.velocityarchitecture.com.au/ |
| **Target route** | https://pm.velocityarchitecture.com.au/ |
| **CI status** | ✅ GitHub Actions build workflow active |
| **Deployment method** | Cloudflare Pages via GitHub integration |
| **Deployment status** | ✅ Live / auto-deploy active |
| **Platform setup required** | None |
| **Key gaps** | Artefact catalogue expansion; PMO Portal handoff implementation |

---

## Deployment Action Summary

| Repo | Deployment Trigger | Status | Remaining Action |
|------|-------------------|--------|------------------|
| ordo-animi | Vercel GitHub integration | ✅ Active | None |
| pmi-portal | Cloudflare Pages GitHub integration | ✅ Platform setup complete | Verify route and security posture |
| ea-artefact-generator | GitHub Actions deploy workflow | ✅ Added | Verify first deploy run |
| ba-artefact-generator | GitHub Actions deploy workflow | ✅ Added | Verify first deploy run |
| sa-artefact-generator | Cloudflare Pages GitHub integration | ✅ Platform setup complete | Verify route |
| pm-artefact-generator | Cloudflare Pages GitHub integration | ✅ Active | None |

---

## Security Gate

PMO Portal must not use production model-provider secrets through browser-exposed `VITE_` variables. Any Anthropic, OpenAI, Gemini, Workers AI, or similar provider key must be handled through a server-side function, Worker, or approved backend path before production AI enablement.

---

## Next Implementation Queue

1. Verify all deployment runs and live URLs.
2. PMO Portal lifecycle state machine.
3. PMO Portal artefact intake contract UI.
4. BA / EA / SA / PM JSON handoff export paths.
5. SA artefact catalogue expansion.
6. PM artefact catalogue expansion.
7. Ordo-to-limb orchestration API design.

---

## Session Changes (2026-06-05 — Platform Setup Follow-up)

| Repo | Action |
|------|--------|
| ea-artefact-generator | Added `.github/workflows/deploy.yml` for Cloudflare Worker deployment |
| ba-artefact-generator | Added `.github/workflows/deploy.yml` for Cloudflare Worker deployment |
| ordo-animi | Updated release matrix to V0.3 |

---

## Ecosystem Docs

| Repo | Files Added |
|------|-------------|
| ordo-animi | `ECOSYSTEM_MATURITY_BASELINE.md`, `ECOSYSTEM_CONTRACT_V0_1.md`, `ECOSYSTEM_RELEASE_MATRIX.md` |
| ea-artefact-generator | `docs/ECOSYSTEM_ALIGNMENT.md`, `.github/workflows/deploy.yml` |
| ba-artefact-generator | `docs/ECOSYSTEM_ALIGNMENT.md`, `docs/DEPLOYMENT_ALIGNMENT.md`, `.github/workflows/deploy.yml` |
| sa-artefact-generator | `docs/ECOSYSTEM_ALIGNMENT.md`, `docs/DEPLOYMENT_ALIGNMENT.md`, `docs/SECURITY_AND_DATA.md`, `wrangler.toml` |
| pm-artefact-generator | `docs/ECOSYSTEM_ALIGNMENT.md`, `docs/DEPLOYMENT_ALIGNMENT.md`, `docs/SECURITY_AND_DATA.md` |
| pmi-portal | `docs/ECOSYSTEM_ALIGNMENT.md`, `docs/ARTEFACT_HANDOFF_CONTRACT.md` |
