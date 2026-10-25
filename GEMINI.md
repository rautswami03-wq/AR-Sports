# Additional Agent Rules — Competitive Hardening

## Testing
- Framework: Vitest. Test files live in `src/__tests__/`.
- Every scoring mutation (`addRuns`, `addExtra`, `addWicket`, `undoLastBall`) MUST have tests covering: dot ball, single, four, six, wide, no-ball, bye, leg-bye, wicket, wicket+wide, wicket+no-ball, and undo of each.
- CI must run `npm test` before `npm run build`. A failing test blocks deploy.

## Sync Safety
- No public unauthenticated pub/sub (ntfy, public Firebase topics) in the stack.
- No polling faster than 2 seconds for score state.
- Every cross-tab message must carry `originId` and `seq`.

## Compliance
- Sponsor overlays must log `{ sponsorId, overlayId, onAirAt, offAirAt }` to `localStorage.ar_sports_sponsor_log` and be exportable as signed CSV.