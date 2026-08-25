// app.js - CrickPro Broadcast Overlays Logic

// 1. Theme Registry (19 Themes)
const themes = [
    { id: 'nakshatra', name: 'Nakshatra' },
    { id: 'agni', name: 'Agni' },
    { id: 'apex', name: 'Apex (Minimal)' },
    { id: 'aranyaka', name: 'Aranyaka' },
    { id: 'volt', name: 'Volt' },
    { id: 'thunder', name: 'Thunder' },
    { id: 'africa', name: 'Africa' },
    { id: 'elite', name: 'Elite' },
    { id: 'franchise', name: 'Franchise' },
    { id: 'blitz', name: 'Blitz' },
    { id: 'asia2021', name: 'Asia 2021' },
    { id: 'asia2022', name: 'Asia 2022' },
    { id: 'asia', name: 'Asia Standard' },
    { id: 'championship2019', name: 'Championship 2019' },
    { id: 'championship2022', name: 'Championship 2022' },
    { id: 'dharma', name: 'Dharma' },
    { id: 'shakti', name: 'Shakti' },
    { id: 'buzz', name: 'Buzz' },
    { id: 'diamond', name: 'Diamond' }
];

let activeTheme = 'nakshatra';
let simInterval = null;

// Mock squads for Roster view
const squads = {
    IND: [
        { name: "Rohit Sharma", role: "Captain / Batsman", num: 45 },
        { name: "Yashasvi Jaiswal", role: "Batsman", num: 64 },
        { name: "Shubman Gill", role: "Batsman", num: 77 },
        { name: "Virat Kohli", role: "Batsman", num: 18 },
        { name: "Rishabh Pant", role: "Wicketkeeper", num: 17 },
        { name: "Hardik Pandya", role: "All-rounder", num: 33 },
        { name: "Ravindra Jadeja", role: "All-rounder", num: 8 },
        { name: "Axar Patel", role: "All-rounder", num: 20 },
        { name: "Kuldeep Yadav", role: "Bowler", num: 23 },
        { name: "Jasprit Bumrah", role: "Bowler", num: 93 },
        { name: "Mohammed Siraj", role: "Bowler", num: 73 }
    ],
    AUS: [
        { name: "Travis Head", role: "Batsman", num: 62 },
        { name: "David Warner", role: "Batsman", num: 31 },
        { name: "Mitchell Marsh", role: "Captain / All-rounder", num: 8 },
        { name: "Glenn Maxwell", role: "All-rounder", num: 32 },
        { name: "Marcus Stoinis", role: "All-rounder", num: 17 },
        { name: "Tim David", role: "Batsman", num: 85 },
        { name: "Matthew Wade", role: "Wicketkeeper", num: 13 },
        { name: "Pat Cummins", role: "Bowler", num: 30 },
        { name: "Mitchell Starc", role: "Bowler", num: 56 },
        { name: "Adam Zampa", role: "Bowler", num: 88 },
        { name: "Josh Hazlewood", role: "Bowler", num: 38 }
    ]
};

// Track local boundary stats for Info Card
let batsmanStats = {
    bat1: { fours: 6, sixes: 4 },
    bat2: { fours: 3, sixes: 1 }
};

// 2. Initialize DOM Elements
document.addEventListener("DOMContentLoaded", () => {
    buildThemeGrid();
    setupEventListeners();
    updateOverlayDOM();
    populateRoster();
});

// Render theme buttons in sidebar
function buildThemeGrid() {
    const grid = document.getElementById("theme-grid");
    grid.innerHTML = "";
    
    themes.forEach(theme => {
        const btn = document.createElement("button");
        btn.className = `theme-button ${theme.id === activeTheme ? 'active' : ''}`;
        btn.textContent = theme.name;
        btn.onclick = () => selectTheme(theme.id);
        grid.appendChild(btn);
    });
}

function selectTheme(themeId) {
    const container = document.getElementById("overlays-container");
    const activeLabel = document.getElementById("active-theme-label");
    
    // Remove old theme classes
    themes.forEach(t => container.classList.remove(`theme-${t.id}`));
    
    // Set active
    activeTheme = themeId;
    container.classList.add(`theme-${themeId}`);
    activeLabel.textContent = `Theme: ${themes.find(t => t.id === themeId).name}`;
    
    // Highlight button
    document.querySelectorAll(".theme-button").forEach(btn => {
        btn.classList.toggle("active", btn.textContent === themes.find(t => t.id === themeId).name);
    });
}

// Populate pre-match squad
function populateRoster() {
    const rosterList = document.getElementById("ol-roster-list");
    const teamNameInput = document.getElementById("score-team").value;
    const rosterTitle = document.getElementById("ol-roster-team");
    
    rosterTitle.textContent = `${teamNameInput} XI`;
    rosterList.innerHTML = "";
    
    const players = squads[teamNameInput] || squads.IND; // Fallback to IND
    
    players.forEach(p => {
        const row = document.createElement("div");
        row.className = "ol-player-row";
        row.innerHTML = `
            <span class="ol-player-num">#${p.num}</span>
            <span class="ol-player-name">${p.name}</span>
            <span class="ol-player-role">${p.role}</span>
        `;
        rosterList.appendChild(row);
    });
}

// 3. Event Listener Bindings
function setupEventListeners() {
    // Checkboxes toggles
    document.getElementById("show-ticker").addEventListener("change", e => {
        document.getElementById("ol-ticker").style.display = e.target.checked ? "flex" : "none";
    });
    
    document.getElementById("show-card").addEventListener("change", e => {
        document.getElementById("ol-card").classList.toggle("visible", e.target.checked);
        if (e.target.checked) updateInfoCard();
    });
    
    document.getElementById("show-roster").addEventListener("change", e => {
        document.getElementById("ol-roster").classList.toggle("visible", e.target.checked);
    });
    
    // Input modifications
    const inputs = [
        "score-team", "score-runs", "score-wickets", "score-overs", "score-target", "score-bowling-team",
        "bat1-name", "bat1-runs", "bat1-balls", "bat2-name", "bat2-runs", "bat2-balls",
        "bowl-name", "bowl-overs", "bowl-maidens", "bowl-runs", "bowl-wickets"
    ];
    
    inputs.forEach(id => {
        document.getElementById(id).addEventListener("input", () => {
            updateOverlayDOM();
            if (id === "score-team") populateRoster();
        });
    });
    
    document.getElementById("bat1-strike").addEventListener("change", updateOverlayDOM);
    document.getElementById("bat2-strike").addEventListener("change", updateOverlayDOM);

    // Simulator events
    document.getElementById("event-dot").onclick = () => addBall(0);
    document.getElementById("event-one").onclick = () => addBall(1);
    document.getElementById("event-four").onclick = () => addBall(4);
    document.getElementById("event-six").onclick = () => addBall(6);
    document.getElementById("event-wicket").onclick = () => addWicket();
    document.getElementById("event-strike").onclick = () => rotateStrike();
    
    document.getElementById("auto-simulate").onclick = toggleSimulator;
}

// 4. Score Logic Operations
function rotateStrike() {
    const b1 = document.getElementById("bat1-strike");
    const b2 = document.getElementById("bat2-strike");
    if (b1.checked) {
        b2.checked = true;
    } else {
        b1.checked = true;
    }
    updateOverlayDOM();
}

function addBall(runs) {
    // 1. Identify active batsman
    const isBat1 = document.getElementById("bat1-strike").checked;
    const prefix = isBat1 ? "bat1" : "bat2";
    
    const batRunsEl = document.getElementById(`${prefix}-runs`);
    const batBallsEl = document.getElementById(`${prefix}-balls`);
    
    const newBatRuns = parseInt(batRunsEl.value) + runs;
    batRunsEl.value = newBatRuns;
    batBallsEl.value = parseInt(batBallsEl.value) + 1;
    
    // Track boundaries locally
    if (runs === 4) batsmanStats[prefix].fours++;
    if (runs === 6) batsmanStats[prefix].sixes++;
    
    // Check milestones (automatic pop-up on 50/100 runs)
    if ((newBatRuns >= 50 && newBatRuns - runs < 50) || (newBatRuns >= 100 && newBatRuns - runs < 100)) {
        triggerMilestone(isBat1 ? document.getElementById("bat1-name").value : document.getElementById("bat2-name").value, newBatRuns);
    }
    
    // 2. Update team score
    const scoreRunsEl = document.getElementById("score-runs");
    scoreRunsEl.value = parseInt(scoreRunsEl.value) + runs;
    
    // 3. Update bowler figures
    const bowlRunsEl = document.getElementById("bowl-runs");
    bowlRunsEl.value = parseInt(bowlRunsEl.value) + runs;
    
    incrementBowlerOvers();
    incrementOvers();
    
    // 4. Auto Rotate Strike on 1, 3, 5 runs or end of over
    const oversText = document.getElementById("score-overs").value;
    const isOverEnd = oversText.endsWith(".0");
    if ((runs % 2 === 1 && !isOverEnd) || (runs % 2 === 0 && isOverEnd)) {
        rotateStrike();
    } else if (isOverEnd) {
        // Change bowler input automatically if over ends during simulation
        rotateBowler();
    }
    
    updateOverlayDOM();
}

// Out and Bowler logic
function addWicket() {
    const isBat1 = document.getElementById("bat1-strike").checked;
    const prefix = isBat1 ? "bat1" : "bat2";
    
    // Add wicket to bowler and team
    document.getElementById("score-wickets").value = parseInt(document.getElementById("score-wickets").value) + 1;
    document.getElementById("bowl-wickets").value = parseInt(document.getElementById("bowl-wickets").value) + 1;
    
    // Trigger out card display
    triggerOutCard(document.getElementById(`${prefix}-name`).value, document.getElementById(`${prefix}-runs`).value, document.getElementById(`${prefix}-balls`).value);
    
    // Reset batsman name and stats
    document.getElementById(`${prefix}-name`).value = getRandomNextBatsman();
    document.getElementById(`${prefix}-runs`).value = 0;
    document.getElementById(`${prefix}-balls`).value = 0;
    batsmanStats[prefix] = { fours: 0, sixes: 0 };
    
    incrementBowlerOvers();
    incrementOvers();
    updateOverlayDOM();
}

function incrementOvers() {
    const oversEl = document.getElementById("score-overs");
    let current = parseFloat(oversEl.value);
    let overs = Math.floor(current);
    let balls = Math.round((current - overs) * 10) + 1;
    if (balls >= 6) {
        overs += 1;
        balls = 0;
    }
    oversEl.value = `${overs}.${balls}`;
}

function incrementBowlerOvers() {
    const oversEl = document.getElementById("bowl-overs");
    let current = parseFloat(oversEl.value);
    let overs = Math.floor(current);
    let balls = Math.round((current - overs) * 10) + 1;
    if (balls >= 6) {
        overs += 1;
        balls = 0;
    }
    oversEl.value = `${overs}.${balls}`;
}

// 5. DOM Updates & Render Loop
function updateOverlayDOM() {
    // Fetch values
    const team = document.getElementById("score-team").value;
    const runs = document.getElementById("score-runs").value;
    const wickets = document.getElementById("score-wickets").value;
    const overs = document.getElementById("score-overs").value;
    
    const bat1Name = document.getElementById("bat1-name").value;
    const bat1Runs = document.getElementById("bat1-runs").value;
    const bat1Balls = document.getElementById("bat1-balls").value;
    const bat1Strike = document.getElementById("bat1-strike").checked;
    
    const bat2Name = document.getElementById("bat2-name").value;
    const bat2Runs = document.getElementById("bat2-runs").value;
    const bat2Balls = document.getElementById("bat2-balls").value;
    const bat2Strike = document.getElementById("bat2-strike").checked;
    
    const bowlName = document.getElementById("bowl-name").value;
    const bowlRuns = document.getElementById("bowl-runs").value;
    const bowlWickets = document.getElementById("bowl-wickets").value;
    const bowlOvers = document.getElementById("bowl-overs").value;

    // Set DOM elements
    document.getElementById("ol-ticker-tag").textContent = team;
    document.getElementById("ol-score-val").textContent = `${runs}-${wickets}`;
    document.getElementById("ol-overs-val").textContent = `Ovs ${overs}`;
    
    document.getElementById("ol-bat1-name").textContent = bat1Name;
    document.getElementById("ol-bat1-score").textContent = `${bat1Runs}* (${bat1Balls})`;
    document.getElementById("ol-bat1-container").className = `ol-batsman ${bat1Strike ? 'active' : ''}`;
    
    document.getElementById("ol-bat2-name").textContent = bat2Name;
    document.getElementById("ol-bat2-score").textContent = `${bat2Runs}* (${bat2Balls})`;
    document.getElementById("ol-bat2-container").className = `ol-batsman ${bat2Strike ? 'active' : ''}`;
    
    // Remove the trailing star from non-striker in overlay text to look clean
    if (!bat1Strike) document.getElementById("ol-bat1-score").textContent = `${bat1Runs} (${bat1Balls})`;
    if (!bat2Strike) document.getElementById("ol-bat2-score").textContent = `${bat2Runs} (${bat2Balls})`;

    document.getElementById("ol-bowl-name").textContent = bowlName;
    document.getElementById("ol-bowl-figs").textContent = `${bowlWickets}-${bowlRuns}`;
    document.getElementById("ol-bowl-overs").textContent = `${bowlOvers} Ov`;
}

// Update milestone card parameters
function updateInfoCard() {
    const isBat1 = document.getElementById("bat1-strike").checked;
    const prefix = isBat1 ? "bat1" : "bat2";
    
    const name = document.getElementById(`${prefix}-name`).value;
    const runs = parseInt(document.getElementById(`${prefix}-runs`).value);
    const balls = parseInt(document.getElementById(`${prefix}-balls`).value);
    const fours = batsmanStats[prefix].fours;
    const sixes = batsmanStats[prefix].sixes;
    
    const sr = balls > 0 ? ((runs / balls) * 100).toFixed(1) : "0.0";
    
    document.getElementById("ol-card-title").textContent = name;
    document.getElementById("ol-card-subtitle").textContent = "Innings Statistics";
    document.getElementById("ol-card-stat-runs").textContent = runs;
    document.getElementById("ol-card-stat-balls").textContent = balls;
    document.getElementById("ol-card-stat-boundaries").textContent = `${fours} / ${sixes}`;
    document.getElementById("ol-card-stat-sr").textContent = sr;
}

// 6. Dynamic Card Triggers
function triggerMilestone(name, runs) {
    const card = document.getElementById("ol-card");
    const isBat1 = document.getElementById("bat1-strike").checked;
    const prefix = isBat1 ? "bat1" : "bat2";
    
    document.getElementById("ol-card").querySelector(".ol-card-header").textContent = "BATSMAN MILESTONE";
    document.getElementById("ol-card-title").textContent = name;
    document.getElementById("ol-card-subtitle").textContent = `${runs} Runs Completed!`;
    document.getElementById("ol-card-stat-runs").textContent = runs;
    document.getElementById("ol-card-stat-balls").textContent = document.getElementById(`${prefix}-balls`).value;
    document.getElementById("ol-card-stat-boundaries").textContent = `${batsmanStats[prefix].fours} / ${batsmanStats[prefix].sixes}`;
    
    const sr = parseInt(document.getElementById(`${prefix}-balls`).value) > 0 ? 
        ((runs / parseInt(document.getElementById(`${prefix}-balls`).value)) * 100).toFixed(1) : "0.0";
    document.getElementById("ol-card-stat-sr").textContent = sr;
    
    card.classList.add("visible");
    
    setTimeout(() => {
        if (!document.getElementById("show-card").checked) {
            card.classList.remove("visible");
        } else {
            updateInfoCard();
        }
    }, 6000);
}

function triggerOutCard(name, runs, balls) {
    const card = document.getElementById("ol-card");
    
    document.getElementById("ol-card").querySelector(".ol-card-header").textContent = "WICKET FALLEN";
    document.getElementById("ol-card-title").textContent = name;
    document.getElementById("ol-card-subtitle").textContent = "OUT - Heading to Pavilion";
    document.getElementById("ol-card-stat-runs").textContent = runs;
    document.getElementById("ol-card-stat-balls").textContent = balls;
    
    const sr = parseInt(balls) > 0 ? ((parseInt(runs) / parseInt(balls)) * 100).toFixed(1) : "0.0";
    document.getElementById("ol-card-stat-sr").textContent = sr;
    
    card.classList.add("visible");
    
    setTimeout(() => {
        if (!document.getElementById("show-card").checked) {
            card.classList.remove("visible");
        } else {
            updateInfoCard();
        }
    }, 6000);
}

// Helper generators
const reserveBatsmen = [
    "S. Samson", "S. Iyer", "K.L. Rahul", "R. Jadeja", "R. Ashwin", "R. Gaikwad", "S. Gill", "R. Singh"
];
function getRandomNextBatsman() {
    return reserveBatsmen[Math.floor(Math.random() * reserveBatsmen.length)];
}

const reserveBowlers = [
    "P. Cummins", "J. Hazlewood", "A. Zampa", "C. Green", "N. Lyon", "M. Marsh"
];
function rotateBowler() {
    document.getElementById("bowl-name").value = reserveBowlers[Math.floor(Math.random() * reserveBowlers.length)];
    document.getElementById("bowl-overs").value = "0.0";
    document.getElementById("bowl-runs").value = 0;
    document.getElementById("bowl-wickets").value = 0;
    document.getElementById("bowl-maidens").value = 0;
}

// 7. Auto Simulation Mode
function toggleSimulator(e) {
    if (e.target.checked) {
        simInterval = setInterval(() => {
            const roll = Math.random();
            if (roll < 0.65) {
                // Scoring shot
                const runRoll = Math.random();
                if (runRoll < 0.5) addBall(0); // Dot
                else if (runRoll < 0.8) addBall(1); // Single
                else addBall(2); // Two
            } else if (roll < 0.90) {
                // Boundary
                const boundaryRoll = Math.random();
                if (boundaryRoll < 0.7) addBall(4);
                else addBall(6);
            } else {
                // Wicket!
                addWicket();
            }
        }, 2500);
    } else {
        clearInterval(simInterval);
        simInterval = null;
    }
}
