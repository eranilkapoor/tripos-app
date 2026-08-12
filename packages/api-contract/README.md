# API Contract Package

Shared TripOS OpenAPI snapshot and generated TypeScript client contracts.

```text
packages/api-contract/
  openapi.json     generated snapshot, do not hand-edit
  src/
    generated.ts   generated TypeScript types, do not hand-edit
```

Both files are build output. Regenerate them from the repository root:

```bash
npm run contracts:snapshot   # boots tripos-api-server and writes openapi.json
npm run contracts:generate   # generates src/generated.ts from openapi.json
npm run contracts:check      # regenerates and fails if the checked-in output is stale
```

`contracts:snapshot` requires a working local `tripos-api-server` environment (MongoDB reachable, `.env.development` configured) since it boots the full Nest application context to read route/DTO metadata.
