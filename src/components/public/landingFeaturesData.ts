export interface FeatureItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  icon: string;
  color: 'cyan' | 'indigo' | 'purple' | 'amber' | 'emerald' | 'red';
}

export interface FeatureCategory {
  id: string;
  title: string;
  badge: string;
  description: string;
  headerColor: string;
  borderColor: string;
  features: FeatureItem[];
}

export const FEATURE_CATEGORIES_DATA: FeatureCategory[] = [
  {
    id: 'broadcast-overlays',
    title: '⚡ Live Broadcast & Overlay Capabilities (OBS / vMix Studio)',
    badge: 'Broadcast Engine',
    description:
      'Broadcast-grade overlay panels, real-time event-driven automation, and multi-platform streaming tools engineered for professional live cricket production.',
    headerColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
    features: [
      {
        id: 'panels-library',
        badge: 'OBS & vMix Ready',
        title: '50+ Broadcast Overlay Panels',
        description:
          'Comprehensive library covering every phase of the cricket broadcast from pre-toss preview to post-match awards. Renders transparent 1080p/60fps graphics directly into OBS Studio, vMix, and Streamlabs with sub-frame synchronization.',
        bullets: [
          'Always-on score ticker with active batsman strike indicator, bowler figures, over dots, and run rates.',
          'Full-screen batting and bowling scorecards with fall-of-wickets timeline and partnership meters.',
          'Dynamic Manhattan charts, run-rate worms, boundary counter ribbons, and tournament leaderboards.',
          'Squad rosters, Playing XI cards with player photos, match officials, and Player of the Match awards.'
        ],
        icon: 'Layers',
        color: 'cyan'
      },
      {
        id: 'auto-display-engine',
        badge: 'Zero-Touch Automation',
        title: 'Auto Display Engine (Event-Driven)',
        description:
          'Intelligent state-machine that triggers graphical overlays automatically based on scoring events. Broadcasters never need to manually swap panels while scoring — the overlay detects boundaries, dismissals, and milestones instantly.',
        bullets: [
          'Automatic boundary animations: instant full-screen celebration graphics and lower-third banners for Fours and Sixes.',
          'Dynamic dismissal sequence: Out alert, outgoing batsman score summary card, and incoming batsman profile card.',
          'Automatic milestone popups triggered when batsmen hit 50/100 or when bowlers claim 3+ wickets.',
          'Automated innings break recaps, target set sequences, and live required run rate calculations.'
        ],
        icon: 'Sparkles',
        color: 'indigo'
      },
      {
        id: 'theme-system',
        badge: '22+ Themes',
        title: '22+ Hand-Crafted Overlay Themes',
        description:
          'Broadcast-quality theme engine inspired by premier global tournaments (IPL, ICC World Cup, BBL, PSL). Switch visual identities instantly without reconfiguring your streaming software or restarting browser sources.',
        bullets: [
          'Handcrafted themes including Lumen, Roar, Vayu, Thunder, Apex, Volt, Blitz, and Franchise styles.',
          'Distinct typography, custom neon accents, smooth motion curves, and metallic textures tailored per theme.',
          'Custom team primary & secondary jersey color mapping with automated readability contrast tuning.',
          'Channel watermarks, tournament logo badges, and custom sponsor placements seamlessly integrated.'
        ],
        icon: 'Palette',
        color: 'purple'
      },
      {
        id: 'producer-control',
        badge: 'Mobile & Web Remote',
        title: 'Producer Studio & Mobile Remote',
        description:
          'Dedicated web-based producer control console accessible from any smartphone, tablet, or secondary monitor. Control graphics, queue animations, and preview live feeds with sub-50ms synchronization.',
        bullets: [
          'Single-tap triggers for scorecards, sponsor takeovers, DRS reviews, and boundary counters.',
          'Live broadcast canvas monitor displaying real-time visual output exactly as seen on stream.',
          'On-the-fly score correction and manual graphic override without interrupting animation loops.',
          'Multi-operator workflow allowing dedicated scorers and production directors to operate simultaneously.'
        ],
        icon: 'Sliders',
        color: 'amber'
      },
      {
        id: 'multi-streaming',
        badge: 'Multi-Destination RTMP',
        title: 'Simulcast Live Streaming',
        description:
          'Stream your live match feeds simultaneously to YouTube, Facebook Live, Twitch, and custom private RTMP/SRT servers. Distribute high-bitrate live video to thousands of concurrent viewers with ultra-low latency.',
        bullets: [
          'Simultaneous broadcasting to up to 3 streaming destinations simultaneously with zero CPU bottleneck.',
          'Support for YouTube Live API, Facebook Live Graph, and standard secure RTMPS / SRT protocols.',
          'Adaptive stream bitrate throttling preventing buffer stutter during unstable cellular network conditions.',
          'Automated stream reconnection logic with live audio-video synchronization preservation.'
        ],
        icon: 'Radio',
        color: 'red'
      },
      {
        id: 'instant-replay',
        badge: '60s Circular Buffer',
        title: 'Instant Replay & Slow-Motion DRS',
        description:
          'Integrated high-speed replay pipeline recording a continuous 60-second rolling circular buffer in memory. Clip wickets, close run-outs, and boundaries instantly to replay them with smooth variable-speed slow motion.',
        bullets: [
          'Single-tap replay bookmarking automatically tied to ball events and umpire review calls.',
          'Variable slow-motion playback speeds (0.25x, 0.5x, 0.75x) with smooth frame interpolation.',
          'Customizable branded replay wipe stingers with tournament sponsor sound effects.',
          'DRS review graphic overlays complete with decision pending timers and official umpire verdict badges.'
        ],
        icon: 'RotateCcw',
        color: 'emerald'
      },
      {
        id: 'auto-highlights',
        badge: 'AI Highlight Reel',
        title: 'Auto Highlights & Social Clips',
        description:
          'AI-assisted highlight assembly system that creates shareable video clips automatically. The engine bookmarks key match moments as they happen and compiles cinematic match packages ready for instant upload.',
        bullets: [
          'Filter highlights dynamically: All Wickets, All Sixes, Boundary Fours, or Century Milestones.',
          'Automated broadcast intros and outros rendered with final scores, team logos, and match summaries.',
          'Dual-aspect export: 16:9 widescreen for YouTube and 9:16 vertical shorts for Instagram & TikTok.',
          'Automated video timestamp generation for YouTube chapter markers and archived match VODs.'
        ],
        icon: 'Video',
        color: 'cyan'
      },
      {
        id: 'camera-support',
        badge: 'Multi-Angle Studio',
        title: 'Multi-Camera Switching & NDI',
        description:
          'Connect USB capture cards, HDMI camcorders, smartphones via NDI, and PTZ cameras into a unified multi-angle switching interface. Switch camera perspectives seamlessly with zero video delay.',
        bullets: [
          'Multi-angle live preview grid supporting main pitch, bowler run-up, and spectator crowd cameras.',
          'Smooth cut, cross-dissolve, and branded graphic transitions between camera inputs.',
          'Digital pan-tilt-zoom (PTZ) presets for close-up batsman focus and wide ground views.',
          'Screen & window capture capture modes for external scoreboard software and live radar guns.'
        ],
        icon: 'Camera',
        color: 'indigo'
      },
      {
        id: 'hardware-encoding',
        badge: '4K/60fps Hardware Pipeline',
        title: 'Broadcast-Grade Video Quality',
        description:
          'Hardware-accelerated video rendering powered by modern GPU pipelines (NVIDIA NVENC, Intel QuickSync, Apple VideoToolbox). Delivers pristine 1080p and 4K UHD video encoding with rock-solid stability.',
        bullets: [
          'Hardware-assisted H.264 / HEVC / AV1 encoding maximizing visual clarity at lower bitrates.',
          'Constant Frame Rate (CFR) 60fps output guaranteeing buttery smooth ball tracking.',
          'Low GPU & CPU overhead leaving ample headroom for complex live graphics compositing.',
          'Custom bitrate profiles tailored for both cellular 4G/5G mobile uplinks and dedicated fiber.'
        ],
        icon: 'Zap',
        color: 'purple'
      },
      {
        id: 'audio-capture',
        badge: 'Studio Hi-Fi Sound',
        title: '48kHz Stereo Audio & Commentary',
        description:
          'Professional dual-channel audio mixing engine built specifically for sports broadcasting. Capture crystal-clear field sound, umpire calls, and commentators while isolating background crowd distortion.',
        bullets: [
          'Studio-grade 48kHz / 24-bit stereo audio capture with low-latency DSP filtering.',
          'Built-in noise suppression, acoustic echo cancellation, and dynamic auto-gain control.',
          'Independent audio channels for lead commentator, co-commentator, and ambient stump mic.',
          'Visual stereo VU meters and peak clip warning indicators for real-time monitoring.'
        ],
        icon: 'Mic',
        color: 'amber'
      },
      {
        id: 'local-recording',
        badge: 'Lossless Archive',
        title: 'Local Master Recording & Bookmarks',
        description:
          'High-bitrate master recording saved directly to your local SSD independent of live streaming bandwidth. Ensures you retain an uncompressed archive of the entire match for TV syndication and post-production.',
        bullets: [
          'Lossless MP4/MKV container recording with multi-track audio stream isolation.',
          'Automated segmented file splitting preventing corrupted footage in case of power failure.',
          'Metadata-stamped timeline bookmarks corresponding to every ball, wicket, and milestone.',
          'Instant background remuxing for rapid upload into Adobe Premiere or DaVinci Resolve.'
        ],
        icon: 'HardDrive',
        color: 'red'
      },
      {
        id: 'format-engine',
        badge: 'Universal Formats',
        title: 'All Cricket Formats Engine',
        description:
          'Comprehensive rules engine supporting every recognized standard and grassroots cricket variant. The scoring math, overs calculation, run rates, and Duckworth-Lewis-Stern targets adjust automatically.',
        bullets: [
          'Native support for T5, T10, T20, 40-over, 50-over ODI, Multi-Day Test, and The Hundred.',
          'Grassroots formats: Box Cricket, Tape-Ball, Super Over, and custom limited-over sets.',
          'Automated Duckworth-Lewis-Stern (DLS) method calculations for rain-interrupted fixtures.',
          'Dynamic powerplay indicator banners and free-hit notification alerts.'
        ],
        icon: 'Activity',
        color: 'emerald'
      }
    ]
  },
  {
    id: 'league-website-builder',
    title: '🌐 League Website Builder Platform (No-Code Sports CMS)',
    badge: 'Website Builder',
    description:
      'Launch an enterprise-grade official league website in minutes with automated standings, ball-by-ball match centers, and player profile archives.',
    headerColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/20',
    features: [
      {
        id: 'page-builder',
        badge: 'No-Code CMS',
        title: 'Drag-and-Drop Page Builder',
        description:
          'Visual page construction engine tailored exclusively for cricket organizations. Assemble modern, responsive league portals using pre-built sports blocks without writing a single line of code.',
        bullets: [
          '25+ specialized sports widgets: live match carousels, leaderboards, countdowns, and sponsor grids.',
          'Real-time mobile, tablet, and desktop responsive preview with live breakpoint toggling.',
          'Customizable hero banners, photo galleries, video showcases, and custom text callouts.',
          'Instant publish pipeline updating your public-facing site globally in under 2 seconds.'
        ],
        icon: 'Palette',
        color: 'cyan'
      },
      {
        id: 'standings-hub',
        badge: 'Auto-Calculated Engine',
        title: 'Tournament Standings & Automated Tables',
        description:
          'Self-updating tournament management portal that calculates points tables, net run rates (NRR), and standings automatically the moment a scorer concludes a match.',
        bullets: [
          'Automatic Net Run Rate (NRR) computation factoring all overs, runs conceded, and balls faced.',
          'Multi-group tournament bracket support: Pool A/B, Super 8s, Playoffs, and Championship Finals.',
          'Live schedule tables with team logos, match time countdowns, and ground location tags.',
          'Interactive squad rosters listing captain, wicket-keeper, bat/bowl styles, and jersey numbers.'
        ],
        icon: 'Globe',
        color: 'indigo'
      },
      {
        id: 'match-center',
        badge: 'Live Match Hub',
        title: 'Live Match Center & Commentary Pages',
        description:
          'Television-grade match center giving remote fans live ball-by-ball commentary, real-time scorecards, and interactive analytics charts identical to major sports news websites.',
        bullets: [
          'Ball-by-ball live textual commentary with boundary tags, dismissal details, and bowler notes.',
          'Interactive Manhattan and Worm comparative run-rate progression charts.',
          'Complete innings scorecards with batting strike rates, bowling economies, and fall of wickets.',
          'Embedded live video stream player synchronizing the broadcast directly above the scorecard.'
        ],
        icon: 'Tv',
        color: 'purple'
      },
      {
        id: 'player-profiles',
        badge: 'Player Analytics',
        title: 'Team & Player Profile Portals',
        description:
          'Comprehensive player and team career dossiers preserving complete historical records, seasonal statistics, and verified performance achievements across all tournaments.',
        bullets: [
          'Detailed player career stats: total runs, batting average, strike rate, 50s/100s, wickets, and best bowling.',
          'Interactive Wagon Wheels and pitch heatmaps showing scoring zones and bowling lengths.',
          'Head-to-head team comparison matrices showcasing historical win/loss ratios.',
          'Player milestone badge showcase highlighting Player of the Match honors and tournament awards.'
        ],
        icon: 'Users',
        color: 'amber'
      },
      {
        id: 'theme-customization',
        badge: 'Custom Identity',
        title: 'Theme Customization & White-Labeling',
        description:
          'Total control over the look and feel of your league’s online presence. Brand your site with your official tournament colors, typography, header styling, and navigation links.',
        bullets: [
          '6 curated professional theme presets ranging from sleek dark mode to vibrant athletic aesthetics.',
          'Customizable primary, secondary, and accent color palettes with real-time preview.',
          'Custom navigation menu builders, sticky headers, and fully branded footer directories.',
          'Zero vendor branding: your league name, domain, and sponsors take center stage.'
        ],
        icon: 'Sliders',
        color: 'red'
      },
      {
        id: 'custom-domains',
        badge: 'Enterprise Infrastructure',
        title: 'Custom Domain & Automated SSL',
        description:
          'Host your cricket portal on your own domain (e.g., league.com or tournament.org) with zero maintenance. We manage DNS routing, worldwide edge CDN caching, and automated SSL cert renewals.',
        bullets: [
          'One-click custom domain mapping with automated CNAME and A-record verification.',
          'Automated Let’s Encrypt TLS/SSL certificates provisioned and renewed automatically.',
          'Global edge caching via Cloudflare CDN delivering sub-100ms page load speeds worldwide.',
          'Automatic canonical URL redirection, WWW normalization, and HTTPS enforcement.'
        ],
        icon: 'Sparkles',
        color: 'emerald'
      },
      {
        id: 'seo-social',
        badge: 'Search & Social Ready',
        title: 'SEO Optimization & Open Graph Cards',
        description:
          'Built-in search engine optimization engineered to rank your league matches, teams, and tournament news at the top of Google. Dynamic social sharing cards generate automatically.',
        bullets: [
          'Automated JSON-LD structured data schema for sports events, teams, and athlete profiles.',
          'Dynamic Open Graph (OG) image generation producing live score preview cards on WhatsApp & Twitter.',
          'Incremental Static Regeneration (ISR) ensuring instant page delivery with 60-second fresh data.',
          'XML sitemaps and robots.txt generated automatically on every tournament fixture update.'
        ],
        icon: 'Cloud',
        color: 'cyan'
      },
      {
        id: 'multi-tenancy',
        badge: 'Tenant Architecture',
        title: 'Multi-Tenant Subdomain Isolation',
        description:
          'Scalable multi-tenant architecture providing dedicated digital environments for multiple independent clubs, leagues, or academy divisions under a unified master organization.',
        bullets: [
          'Dedicated isolated subdomains (division1.league.com, youth.league.com) per branch.',
          'Independent database tenant partitioning ensuring strict data security and compliance.',
          'Branch-level administration settings, isolated tournament archives, and independent team rosters.',
          'Centralized super-admin dashboard for overarching league oversight and billing management.'
        ],
        icon: 'Layers',
        color: 'indigo'
      },
      {
        id: 'waivers-signatures',
        badge: 'Compliance & Legal',
        title: 'Digital Waivers & E-Signature Hub',
        description:
          'Eliminate paper registration forms and liability headaches with integrated digital waivers. Players and parents can read, agree, and sign liability waivers directly from their phones.',
        bullets: [
          'Mobile-friendly digital signature canvas supporting touch and stylus inputs.',
          'Automated PDF generation attaching player timestamps, IP addresses, and legal consent terms.',
          'Instant verification status linked to team registration rosters before players take the field.',
          'Secure encrypted cloud archive with one-click export for insurance and audit compliance.'
        ],
        icon: 'FileCheck',
        color: 'purple'
      }
    ]
  },
  {
    id: 'tournament-dashboard',
    title: '🛠️ Tournament Operations & Management Web Dashboard',
    badge: 'Operations Hub',
    description:
      'All-in-one command center for tournament directors, team managers, and official scorers to coordinate fixtures, venue logistics, and live broadcast graphics.',
    headerColor: 'text-purple-400',
    borderColor: 'border-purple-500/20',
    features: [
      {
        id: 'command-center',
        badge: 'Operations Hub',
        title: 'Tournament Command Center',
        description:
          'Mission control for league organizers. Effortlessly configure multi-stage tournaments, schedule fixtures, allocate venues, track match progression, and generate tournament draw brackets.',
        bullets: [
          'Automated fixture generation supporting round-robin leagues, knockout ladders, and split pools.',
          'Conflict detection engine preventing team double-booking, ground clashes, and umpire overlaps.',
          'Live tournament progress dashboard displaying upcoming, live, and concluded matches.',
          'One-click match rescheduling with automated notification alerts dispatched to affected teams.'
        ],
        icon: 'Settings',
        color: 'cyan'
      },
      {
        id: 'overlay-studio',
        badge: 'Live Production Panel',
        title: 'Real-Time Overlay Control Studio',
        description:
          'Comprehensive control cockpit that synchronizes directly with the active live broadcast overlay. Swap graphic themes, update sponsor assets, push player profiles, and trigger animations on the fly.',
        bullets: [
          'Panel queue manager to sequence upcoming graphics before bringing them live on air.',
          'Real-time sponsor carousel controls to showcase tier-one sponsors during drink breaks.',
          'Custom lower-third text banner authoring for breaking announcements and weather alerts.',
          'Emergency overlay reset toggle to instantly clear graphics in case of broadcast anomalies.'
        ],
        icon: 'Sliders',
        color: 'indigo'
      },
      {
        id: 'notification-center',
        badge: 'Omnichannel Blasts',
        title: 'Automated Email & SMS Alerts',
        description:
          'Keep captains, players, officials, and registered spectators informed with automated communication pipelines. Dispatch schedule announcements, match reminders, and venue changes in seconds.',
        bullets: [
          'Automated match day notifications: toss reminders, venue pin links, and delayed start alerts.',
          'Segmented communication groups: League Admins, Team Captains, Umpires, and Players.',
          'Rich HTML newsletter templates for weekly roundups, tournament draws, and leaderboard digests.',
          'Delivery tracking analytics monitoring open rates, delivery statuses, and bounced addresses.'
        ],
        icon: 'Mail',
        color: 'purple'
      },
      {
        id: 'rbac-security',
        badge: 'Enterprise Security',
        title: 'Role-Based Access Control (RBAC)',
        description:
          'Granular permissions architecture safeguarding sensitive organizational controls. Assign specialized administrative roles to match officials, scorers, team managers, and umpires.',
        bullets: [
          'Multi-tier roles: Super Admin, Tournament Director, Official Scorer, Team Manager, and Umpire.',
          'Scorer-only restricted mode preventing unauthorized tampering with tournament configurations.',
          'Team Manager portals limited to squad line-up declarations, player numbers, and waivers.',
          'Comprehensive audit logs tracking every score modification, match edit, and administrative login.'
        ],
        icon: 'Shield',
        color: 'amber'
      },
      {
        id: 'sponsor-ads',
        badge: 'Monetization Suite',
        title: 'Sponsor Asset & Dynamic Ad Engine',
        description:
          'Unlock significant sponsorship revenue for your league. Manage partner brand logos, set tier priorities, and program automated on-screen banner placements triggered by match events.',
        bullets: [
          'Multi-tier sponsor management: Title Sponsors, Powered-By Partners, and Associate Brands.',
          'Event-driven ad takeovers: trigger specific sponsor logos during 6s, 4s, or strategic timeouts.',
          'Dynamic rotation frequency controls ensuring equal on-screen exposure across all paid partners.',
          'Detailed impression metrics and proof-of-play reports ready for sponsor invoicing.'
        ],
        icon: 'Sparkles',
        color: 'red'
      },
      {
        id: 'ground-logistics',
        badge: 'Facility Logistics',
        title: 'Ground & Venue Scheduling Engine',
        description:
          'Master calendar system for managing sports complexes, multiple cricket grounds, and turf wickets. Optimize pitch availability, floodlight operating hours, and net session bookings.',
        bullets: [
          'Multi-venue calendar grid visualizing all pitch slots, maintenance windows, and game times.',
          'Integrated ground maps and driving directions automatically linked in team fixture notices.',
          'Weather alert integration monitoring local precipitation and pitch condition updates.',
          'Ground fee accounting tracking venue rental costs and umpire compensation records.'
        ],
        icon: 'MapPin',
        color: 'emerald'
      },
      {
        id: 'document-center',
        badge: 'Document Archive',
        title: 'Official League Document Repository',
        description:
          'Centralized cloud filing system for all official tournament literature, playing conditions, code of conduct policies, registration guidelines, and disciplinary committee findings.',
        bullets: [
          'Secure cloud storage with organized folders for rulebooks, constitution bylaws, and handbooks.',
          'Version-controlled documents ensuring participants always access the latest official revisions.',
          'Role-based download permissions with public vs. private document access restrictions.',
          'Integrated PDF viewer enabling players to read playing conditions on any mobile device.'
        ],
        icon: 'FolderOpen',
        color: 'cyan'
      },
      {
        id: 'cms-news',
        badge: 'Sports Journalism',
        title: 'Cricket CMS & Match News Publisher',
        description:
          'Built-in editorial publishing platform designed for sports journalists and media managers. Publish match review articles, player interviews, photo galleries, and video summaries.',
        bullets: [
          'Modern block-based rich text editor supporting embedded scorecards, stats tables, and quotes.',
          'High-resolution image galleries with lightbox zoom and responsive mobile carousels.',
          'Automated match report generation synthesizing key batting and bowling highlights into draft text.',
          'Tagging system categorizing stories by tournament, team, award category, and season.'
        ],
        icon: 'Layers',
        color: 'indigo'
      },
      {
        id: 'onboarding-wizard',
        badge: 'Fast Onboarding',
        title: 'Guided Tournament Setup Wizard',
        description:
          'Interactive, step-by-step setup assistant that takes a brand-new league organizer from zero to a fully configured tournament ready for live scoring in under 15 minutes.',
        bullets: [
          'CSV & Excel bulk import tools for rapid team, squad, and player roster ingestion.',
          'Intuitive wizard guiding tournament format, overs, bonus point rules, and tiebreaker criteria.',
          'Pre-configured tournament templates modeled after ICC, IPL, and premier league rulebooks.',
          'Live validation checks ensuring zero missing roster info or unassigned team captains before launch.'
        ],
        icon: 'Check',
        color: 'purple'
      }
    ]
  }
];
