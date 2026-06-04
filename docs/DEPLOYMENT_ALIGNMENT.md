# SA Deployment Alignment

## Target

SA Artefact Generator should be deployed to match the EA and PM generator maturity pattern.

Production route:

```text
https://sa.velocityarchitecture.com.au/
```

Cloudflare fallback route:

```text
https://sa-artefact-generator.pages.dev/
```

## Cloudflare Pages settings

Project name:

```text
sa-artefact-generator
```

Repository:

```text
ZenCloudAU/sa-artefact-generator
```

Production branch:

```text
main
```

Framework preset:

```text
React Vite
```

Build command:

```text
npm run build
```

Build output directory:

```text
dist
```

Environment variable:

```text
NODE_VERSION=22
```

## Local validation

```bash
npm install
npm run build
npm run preview
```

## Alignment gate

SA is considered live-aligned when:

- Cloudflare Pages deploy succeeds.
- `sa.velocityarchitecture.com.au` resolves.
- The fallback Pages URL resolves.
- README contains live route and deployment instructions.
- Security note warns against entering confidential client data into unsecured demo environments.
- Artefact lifecycle model is documented.
