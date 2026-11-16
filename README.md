# ResearchOS TECT — Undersea & Seabed Technologies
Independent research foundation for sensing, acoustic communications, autonomous systems and seabed infrastructure architectures.

## Implemented foundation
Browser app and CLI for synthetic monitoring-network scenarios: straight-path acoustic loss, declared noise bounds, directed link margins, propagation delay, relay outages and gateway reachability. Includes node position plots, JSON editing/import/export, CSV/Markdown reports, source notes, human review and browser-local storage.

Sensor detection, environmental propagation, vehicle autonomy and real infrastructure performance remain future work. Read the [model contract and roadmap](docs/MODEL.md).

## Run
Node 22+, no npm dependencies:
```sh
npm test
npm run build
python -m http.server 8000 --directory dist
```
Open http://localhost:8000. Or serve the repository root directly. ES modules and demo JSON require localhost or HTTPS; file:// is unsupported.

## CLI
```sh
node cli.mjs example.json
node cli.mjs example.json results.json
node cli.mjs example.json results.csv
```
Existing output files are refused. Export browser studies regularly; no telemetry or account synchronization is configured.

## Verification and distribution
Eight tests cover range, link arithmetic, asymmetry, outages, validation and exports. Node 22/24 CI checks syntax, tests, CLI and static builds, then uploads downloadable app artifacts. Consult actual CI results: local execution and interactive browser testing were unavailable during implementation. Hosting is not configured.

Synthetic research prototype, not an operationally validated tool. No DARPA affiliation or novelty claim. Apache-2.0 license retained.
