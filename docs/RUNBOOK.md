# AR-Sports Operational Runbook

This runbook documents emergency mitigation procedures for live match operators and broadcast technicians.

---

## Incident 1: Overlay Frozen on Screen

### Symptoms
- Controller updates scores, but OBS/vMix browser source does not update.
- Controller header displays red pulsing badge: `⚠ NO OVERLAY DATA (Xs)`.

### Root Causes
1. Browser Source background throttling or suspended process.
2. Network disconnection between controller and overlay machine.
3. Desynchronized monotonic sequence (`seq`).

### Resolution Procedure
1. **Refresh Browser Source in OBS/vMix**:
   - In OBS: Select the overlay source -> Click **Refresh** in properties or press the assigned hotkey.
   - In vMix: Right-click the Web Browser input -> Click **Reload**.
2. **Verify Single-Machine vs Remote Connection**:
   - If running on the same PC: Ensure the overlay URL is using `localhost` or exact local port so `BroadcastChannel` can bridge without network overhead.
   - If running across network: Check that both PCs have internet access and outbound HTTPS access to Firebase (`firestore.googleapis.com`).
3. **Trigger Manual Heartbeat Sync**:
   - In the Controller, click the **Sync** or **Publish** button to force a high-seq payload push.

---

## Incident 2: Controller Tab Crashed or Accidentally Closed

### Symptoms
- Scorer closed the tab, browser crashed, or OS restarted mid-over.

### Resolution Procedure
1. **Relaunch Controller**:
   - Open browser and navigate to `http://localhost:5173/` or production domain.
2. **Automatic State Hydration**:
   - The store automatically re-hydrates the active match state, teams, current batters, bowler, ball log, and match ID from `localStorage.ar_sports_broadcast_v1`.
3. **Verify Integrity**:
   - Check the score bar in Scorer tab.
   - Review the last 6 entries in the Ball Log tab to ensure the last bowled ball is recorded.
   - Resume scoring immediately.

---

## Incident 3: Network Connection Lost During Match

### Symptoms
- Header shows `Sync Error: [Count > 0]`.
- Cloud sync fails.

### Resolution Procedure
1. **Keep Controller Open**:
   - **Do NOT clear browser data or force-refresh.**
   - All state mutations are committed locally to Zustand and `localStorage` synchronously.
2. **Single-PC Workaround (Broadcast Continuity)**:
   - If OBS is on the same machine as the Scorer, local `BroadcastChannel` continues to sync instantaneously even with zero internet. The overlay will not miss a single frame.
3. **Restoring Cloud Connectivity**:
   - Switch operator laptop to mobile hotspot if venue WAN fails.
   - Once network is restored, the next scoring click automatically synchronizes the full compact payload to Firestore.

---

## Incident 4: Firebase Quota Exceeded or Outage

### Symptoms
- Repeated sync failures in console: `Quota exceeded` or `ResourceExhausted (429)`.
- Red error counter in header increases rapidly.

### Resolution Procedure
1. **Switch to Local Air-Gap Mode**:
   - Point the OBS / vMix browser source to the Controller's local IP or localhost:
     `http://<controller-ip>:5173/#/overlay`
   - All tabs communicate via `BroadcastChannel` with 0 requests to Firebase.
2. **Prevent Polling Floods**:
   - AR-Sports enforces a hard limit: no polling faster than 2000ms.
   - If multiple non-essential tabs are open (e.g. spectator tabs), close them to conserve Firestore read quotas.

---

## Incident 5: Mid-Match State Corruption or Desync Recovery

### Symptoms
- Score discrepancy between on-field umpires and digital scoreboard.
- Incorrect batter on strike or wrong bowler assigned.

### Resolution Procedure
1. **Non-Destructive Correction**:
   - If an error occurred 1-2 balls ago: Use **Undo Last Ball**. This restores:
     - Exact previous score, balls, overs, wickets.
     - Batter and bowler individual stats.
     - Strike orientation.
     - Pops the last entry from the auditable `ballLog`.
2. **Roster / Striker Realignment**:
   - Use the **Active Striker**, **Non-Striker**, and **Active Bowler** dropdowns in the Scorer tab to swap players directly without modifying score history.
3. **Hard Resync from Archive**:
   - Navigate to the **Archives** tab in Control Studio.
   - Review past match snapshots or export CSV ledger to verify historical balls.

---

## Incident 6: Undo Across Innings Boundary

### Symptoms
- 1st innings was ended prematurely by pressing "End Innings", but umpires reversed a decision or play continues.

### Resolution Procedure
1. The store pushes an `{ event: 'INNINGS_END' }` marker row to `ballLog`.
2. When performing an undo across the innings boundary:
   - Press **Undo Last Ball**.
   - The store will revert the active innings index back to `1st Innings`, restore the previous fielding/batting team rotation, and restore the previous bowler/batter pair.
3. Verify target score clears or resets according to 1st innings total.
