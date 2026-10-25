# Broadcast Compliance & Proof-of-Performance Specification

## 1. Compliance-Grade Sponsor Telemetry

Commercial broadcast agreements require verifiable proof-of-performance for paid sponsor graphics displayed on air. AR-Sports enforces automated tracking of every sponsor overlay cycle.

### Data Schema
Sponsor graphic events are logged to `localStorage.ar_sports_sponsor_log` with the following structure:

```ts
interface SponsorLogEntry {
  sponsorId: string;       // Matched from matchDetails.sponsors[].id or 'unlabeled'
  overlayId: string;       // e.g. 'sponsorGraphics'
  onAirAt: number;         // Unix epoch millisecond timestamp of graphic display
  offAirAt?: number;       // Unix epoch millisecond timestamp of graphic removal
  durationSeconds?: number;// Calculated on-air duration in seconds
}
```

### Automation & Lifecycle Rules
1. **Triggering In**: When `toggleOverlay('sponsorGraphics', true)` is invoked, `recordSponsorOnAir()` stamps a new record with the active sponsor ID and `Date.now()`.
2. **Triggering Out**: When the overlay is toggled off or hidden via `hideAllOverlays()`, `recordSponsorOffAir()` locates the latest unclosed entry and writes `offAirAt` and `durationSeconds`.
3. **Unexpected Tab Closure Protection**: A `window.addEventListener('beforeunload')` lifecycle hook intercepts tab closures, crashes, or navigation away from the controller, ensuring any active on-air record is closed with the current timestamp rather than remaining open indefinitely.
4. **Structured ID Fallback**:
   - If `matchDetails.sponsors` provides structured objects with an `id` field (e.g. `{ id: 'sponsor-tata', name: 'Tata' }`), the system records `sponsorId: 'sponsor-tata'`.
   - If unstructured or missing, the system records `sponsorId: 'unlabeled'`.

---

## 2. Export & Audit Trail Generation

### CSV Export Specification
Operators can export compliance records at any time from the **Overlays** tab in `ControlStudio` using the **Export Sponsor Log** action.

The exported CSV conforms to RFC 4180 standards:
```csv
sponsorId,overlayId,onAirAt,offAirAt,durationSeconds
sponsor-redbull,sponsorGraphics,1771694400000,1771694415000,15
sponsor-pepsi,sponsorGraphics,1771694460000,1771694490000,30
```

### Cryptographic Signature & Verification (Recommended Practice)
For Tier-1 commercial certification, exported compliance CSVs should be paired with a SHA-256 integrity hash:
```bash
# Generate SHA-256 checksum for proof-of-performance CSV
sha256sum sponsor_log_1771694490000.csv > sponsor_log_1771694490000.csv.sha256
```

---

## 3. Broadcast Rights & Restrictive Flags

When broadcasting licensed sports content (e.g., ICC, BCCI, ACC tournaments):

| Flag / Property | Description | Default Value | Enforcement |
| :--- | :--- | :--- | :--- |
| `allowPublicSync` | Toggles whether live match payloads are published to external public relays. | `false` | No unauthenticated pub/sub (e.g. `ntfy.sh`) permitted in codebase. Cloud sync requires authenticated Firestore keys. |
| `enforceSponsorMinTime` | Minimum required on-air duration for sponsor graphic to count toward contractual delivery. | `5` seconds | Durations `< 5` seconds are flagged as non-conforming in compliance reports. |
| `geoBlockTelemetry` | Restricts scoreboard telemetry distribution based on region. | `false` | When enabled, Cloud Firestore rules restrict subscriber origins. |

---

## 4. Data Retention & Privacy Policy

1. **Local Storage Retention**:
   - `localStorage.ar_sports_sponsor_log` is retained indefinitely until explicitly cleared by the operator or rotated via archive.
   - Recommended operational cadence: Export sponsor logs at the conclusion of every match or broadcast shift before initiating `archiveAndReset()`.
2. **Personal Data (PII)**:
   - Player rosters contain solely publicly attributable athlete names, jersey numbers, and in-game statistics.
   - No sensitive personally identifiable information (PII) is stored or transmitted.
3. **Telemetry Sanitization**:
   - Monotonic sequence trackers and ephemeral client UUIDs (`originId`) expire upon session termination.
