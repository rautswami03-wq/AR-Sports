# AR-Sports: NDI Output Bridge Architecture Plan

## Executive Objective
Enable native, low-latency, alpha-channel Network Device Interface (NDI) video output from `AR-Sports` directly into professional production switchers (vMix, TriCaster, OBS Studio with `obs-ndi`, Ross Carbonite, and vFader) without breaking the existing URL-based Browser Source workflow.

---

## 1. Evaluation of Options & Tradeoffs

| Approach | Latency | Alpha Transparency | CPU / GPU Overhead | Cross-Platform | Deployment Complexity | Maintenance Risk |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **A. `grandiose` (Node-API NDI SDK wrapper)** | Low (~1-2 frames) | **Yes** (`NDIlib_FourCC_video_type_BGRA` / `RGBA`) | Moderate (Requires offscreen rendering + memory copy) | Windows / macOS / Linux | High (Node native C++ bindings, MSVC/node-gyp rebuilds) | Medium (Dependent on maintainer tracking NDI SDK 5/6 API changes) |
| **B. `ndi-js`** | High | Partial | High (Emscripten/WASM or pure JS wrapper limitations) | Universal (Node) | Low | High (Inactive, lack of hardware-accelerated color conversion) |
| **C. Headless Chromium + FFmpeg via stdin pipe (`libndi_newtek`)** | Moderate (~3-5 frames) | **Yes** (raw RGBA pipe to FFmpeg) | High (Software pixel encoding + inter-process piping) | Windows / Linux | Very High (FFmpeg must be compiled with `--enable-libndi_newtek` which is non-free) | High (FFmpeg GPL vs NDI non-free license collision prevents binary redistribution) |
| **D. Electron Sidecar with Direct NDI C++ Addon** | **Lowest (~1 frame)** | **Yes** (Direct access to Chromium compositor / Offscreen WebContents) | **Low to Moderate** (Shared memory / GPU readback) | Windows / macOS | Moderate (Single bundled executable) | Low (Self-contained, controlled Node/Chromium versions) |
| **E. Headless OBS Bridge (`obs-ndi`)** | Moderate (~2-4 frames) | **Yes** | Moderate | Windows / macOS / Linux | High (Requires user to install and configure OBS Studio as a background daemon) | High (External dependency on OBS daemon lifecycle) |

### Recommended Path
**Option D (Electron Sidecar with native NDI wrapper)** for production, with **Option A (`grandiose` + Puppeteer)** as a viable CLI-driven interim bridge.

---

## 2. Architecture & System Placement

The bridge must NOT run inside the sandboxed web browser tab. Browsers lack access to raw UDP sockets and native dynamic libraries (`Processing.NDI.Lib.x64.dll`).

### Component Topology
```
[ Control Studio (React Web) ]
         |
         | (BroadcastChannel / LocalStorage / Firebase Firestore)
         v
[ AR-Sports Store State ]
         |
         +------------------------+
         |                        |
         v                        v
[ Web Browser Source ]   [ NDI Bridge Sidecar (Electron / Node) ]
(OBS / vMix via URL)              |
                                  | 1. Spawns headless WebContents @ 1080p60 / transparent
                                  | 2. Subscribes to AR-Sports overlay route
                                  | 3. Hooks `paint` event (raw BGRA pixel buffer)
                                  | 4. Dispatches buffer into NDI SDK sender
                                  v
                         [ NDI Sender Stream ] ("AR-Sports Clean Feed")
                                  |
                                  v (mDNS / NDI Discovery Service)
                         [ Switcher: vMix / TriCaster / OBS ]
```

### Bridge Process Placement in Repo
```
AR-Sports/
├── apps/
│   ├── web/                     # Existing React/Vite app
│   └── ndi-bridge/              # Dedicated sidecar package
│       ├── src/
│       │   ├── main.ts          # Process lifecycle & window management
│       │   ├── capture.ts       # Offscreen WebContents paint hook
│       │   ├── ndi-sender.ts    # NDI SDK session wrapper
│       │   └── ipc.ts           # Tally / status communication
│       ├── package.json
│       └── tsconfig.json
```

### Video Pipeline Specification
1. **Resolution & Framerate**: 1920x1080 at 59.94p or 60.00p (configurable in UI).
2. **Color Space & Pixel Format**: `NDIlib_FourCC_type_BGRA` (32-bit with premultiplied alpha).
3. **Keying Mode**: Straight alpha or Premultiplied alpha selectable to support switchers with downstream keyers (DSK).
4. **Framing Sync**: Frame drop/repeat clock synchronized to wall-clock time (`NDIlib_send_send_video_v2`).

---

## 3. Coexistence with Browser-Source Path

The NDI output operates as a parallel sink, not an alternative:
1. **State Isolation**: The overlay component (`/overlay`) remains 100% agnostic to the consumer. It renders HTML/CSS/Canvas inside Chromium whether accessed via Chrome, OBS Browser Source, or the NDI Bridge's offscreen WebContents.
2. **Dual-Path Operation**:
   - Operator can run OBS Browser Source on a remote operator machine via HTTP URL.
   - Broadcaster can simultaneously run the NDI Bridge on the broadcast production network to feed hardware switchers.
3. **Bandwidth Optimization**: When NDI bridge is inactive, zero NDI overhead exists on the network.

---

## 4. Implementation Timeline & Effort Estimate

### Phase 1: Prototype / Weekend Build (16–24 Engineer Hours)
*Scope: Working proof-of-concept CLI utility transmitting 1080p60 alpha overlay to vMix / OBS-NDI.*
- Scaffold `packages/ndi-bridge` or `apps/ndi-bridge`.
- Implement Puppeteer or basic Electron offscreen window rendering `http://localhost:5173/#/overlay`.
- Integrate `grandiose` or precompiled NDI native addon.
- Capture `paint` event buffer and push into NDI video frame structure (`NDIlib_video_frame_v2_t`).
- Verify stream appears in NDI Studio Monitor with intact transparency.

### Phase 2: Production Hardening / 1-Month Build (120–160 Engineer Hours)
*Scope: Commercial-grade, packaged, self-healing desktop companion app.*
- **Zero-Copy / Hardware Acceleration**: Investigate Direct3D 11 / OpenGL shared texture handles to bypass CPU memory round-trips for the paint buffer.
- **NDI Tally & Metadata Support**:
  - Receive Program/Preview tally packets from vMix/TriCaster over NDI.
  - Expose tally status (Red = On Air, Amber = Preview) back to `ControlStudio` UI.
- **Audio Routing**: Optional mix-minus or sound effects (wickets, boundaries, crowd cheers) injected into `NDIlib_audio_frame_v2_t` (floating-point planar).
- **GUI & Configuration Panel**:
  - NDI Channel Name customization (e.g., `AR-SPORTS-MAIN`, `AR-SPORTS-LOWER-THIRD`).
  - Output format toggle: 720p50, 720p60, 1080i50, 1080i59.94, 1080p50, 1080p60.
  - Failover color: Transparent black vs Black.
- **Packaging & CI/CD**: Electron Forge / NSIS Windows installer bundling runtime dependencies.

---

## 5. Licensing & Legal Constraints (Vizrt NDI SDK)

### The NDI SDK License Model
1. **Proprietary Software**: NDI is proprietary intellectual property owned by Vizrt Group. It is NOT open-source.
2. **Royalty-Free vs. Commercial Agreements**:
   - The NDI Advanced SDK is free to download and use for development.
   - Distributing commercial software that embeds NDI binaries requires compliance with the **NDI License Agreement** and **NDI Trademark Guidelines** (branding badges, "NDI® is a registered trademark of Vizrt").
3. **FFmpeg Conflict (GPL Violation Risk)**:
   - FFmpeg code is licensed under LGPL/GPL.
   - NDI SDK contains terms incompatible with the GPL (restrictions on reverse engineering, indemnity requirements).
   - **Crucial Rule**: You cannot distribute a pre-compiled FFmpeg binary with `--enable-libndi_newtek`. Doing so violates FFmpeg's license.
4. **Distribution Strategy for AR-Sports**:
   - **Do not bundle the raw NDI DLLs inside git**.
   - Dynamically link to the system-installed NDI Runtime (`Processing.NDI.Lib.x64.dll`).
   - If the runtime is missing, prompt the user with a download link to the official, free **NDI 6 Runtime installer** provided by Vizrt. This isolates `AR-Sports` from binary redistribution liability.
