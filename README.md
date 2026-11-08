# TravelPack website

The landing site for TravelPack for iPhone. The old web app (accounts, trips, lists) has been retired; the app lives in the private `travelpack-ios` repo.

## Pages
- `/`: landing page
- `/features`: everything the app does
- `/templates`: curated packing templates, each downloadable as a `.travelpack` file the iOS app imports
- `/privacy`, `/support`: required for the App Store listing

Every page is static. There's no database, no accounts and no environment variables.

## Templates
Templates live in `src/lib/templates.ts` and are served from `/templates/download/<slug>.travelpack` as `.travelpack` schema v1 (see `docs/travelpack-schema.md` in the iOS repo). The iOS decoder rejects unknown keys, and `src/lib/templates.test.ts` checks the generated files against it.

## Before launch
Set `appStoreUrl` and `supportEmail` in `src/lib/site.ts`. Until then the pages say "Coming soon".

## Development
Needs Node 20.9 or later.

```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm build
```
