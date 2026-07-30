import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { readDB, writeDB } from './db.js';

interface ExtendedWebSocket extends WebSocket {
  isAlive?: boolean;
}

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server });

function broadcast(event: { type: string; matchId: string; payload: any }) {
  const message = JSON.stringify(event);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}


const pingInterval = setInterval(() => {
  wss.clients.forEach((client: ExtendedWebSocket) => {
    if (client.isAlive === false) {
      return client.terminate();
    }
    client.isAlive = false;
    client.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(pingInterval);
});


// 1. Health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    system: 'CricScorer Live Broadcast Engine',
    webSocketClients: wss.clients.size,
    timestamp: new Date().toISOString(),
  });
});

// 2. Auth
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const db = readDB();
  const user = db.users.find((u) => u.email === email) || {
    id: `usr_${Date.now()}`,
    email: email || 'user@cricscorer.in',
    name: 'Scorer Operator',
  };
  res.json({ success: true, token: `jwt_token_${user.id}`, user });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email } = req.body;
  const db = readDB();
  const newUser = { id: `usr_${Date.now()}`, email: email || 'user@cricscorer.in', name: name || 'Scorer' };
  db.users.push(newUser);
  writeDB(db);
  res.json({ success: true, user: newUser });
});

// 3. Matches
app.get('/api/matches', (_req: Request, res: Response) => {
  const db = readDB();
  res.json({ success: true, matches: db.matches });
});

app.get('/api/matches/:id', (req: Request, res: Response) => {
  const db = readDB();
  const match = db.matches.find((m) => m.id === req.params.id || m.streamKey === req.params.id);
  if (!match) {
    res.status(404).json({ error: 'Match not found' });
    return;
  }
  res.json({ success: true, match });
});

app.post('/api/matches', (req: Request, res: Response) => {
  const db = readDB();
  const newMatch = {
    id: `match_${Date.now()}`,
    streamKey: `obs_key_${Math.floor(1000000 + Math.random() * 9000000)}`,
    title: req.body.title || 'LIVE CRICKET MATCH',
    tournament: req.body.tournament || 'CRICKET TOURNAMENT',
    teamA: req.body.teamA || { id: 'IND', shortName: 'IND', fullName: 'Team A', score: 0, wickets: 0, overs: 0, balls: 0 },
    teamB: req.body.teamB || { id: 'AUS', shortName: 'AUS', fullName: 'Team B', score: 0, wickets: 0, overs: 0, balls: 0 },
    currentInnings: 1,
    recentBalls: [],
    historyStack: [],
    activeOverlays: { scoreBug: true },
    activeAnimation: null,
    updatedAt: new Date().toISOString(),
  };
  db.matches.push(newMatch);
  writeDB(db);
  res.json({ success: true, match: newMatch });
});

// 4. Score event
app.post('/api/matches/:id/score', (req: Request, res: Response) => {
  const db = readDB();
  const match = db.matches.find((m) => m.id === req.params.id);
  if (!match) {
    res.status(404).json({ error: 'Match not found' });
    return;
  }

  const { action, runs = 0, boundaryType, extraType, battingTeamId } = req.body;

  // Save current state into historyStack before mutation
  if (!match.historyStack) match.historyStack = [];
  match.historyStack.push({
    teamA: JSON.parse(JSON.stringify(match.teamA)),
    teamB: JSON.parse(JSON.stringify(match.teamB)),
    recentBalls: [...match.recentBalls],
    currentInnings: match.currentInnings,
  });
  if (match.historyStack.length > 50) match.historyStack.shift();

  // Dynamically target batting team
  let team = match.teamA;
  if (battingTeamId) {
    team = battingTeamId === match.teamB.id ? match.teamB : match.teamA;
  } else if (match.currentInnings === 2) {
    team = match.teamB;
  }

  if (action === 'ADD_RUNS') {
    let balls = team.balls + 1;
    let overs = team.overs;
    if (balls >= 6) {
      overs += 1;
      balls = 0;
    }
    team.balls = balls;
    team.overs = overs;
    team.score += runs;

    const symbol = boundaryType ? boundaryType.toString() : runs.toString();
    match.recentBalls = [symbol, ...match.recentBalls.slice(0, 5)];

    if (boundaryType === 4) match.activeAnimation = 'FOUR';
    if (boundaryType === 6) match.activeAnimation = 'SIX';
  } else if (action === 'WICKET') {
    team.wickets += 1;
    let balls = team.balls + 1;
    let overs = team.overs;
    if (balls >= 6) {
      overs += 1;
      balls = 0;
    }
    team.balls = balls;
    team.overs = overs;
    match.recentBalls = ['W', ...match.recentBalls.slice(0, 5)];
    match.activeAnimation = 'WICKET';
  } else if (action === 'EXTRA') {
    team.score += runs || 1;
    const symbol = extraType === 'WIDE' ? `${runs || 1}WD` : `${runs || 1}NB`;
    match.recentBalls = [symbol, ...match.recentBalls.slice(0, 5)];
    if (extraType === 'WIDE') match.activeAnimation = 'WIDE';
    if (extraType === 'NO_BALL') match.activeAnimation = 'NO_BALL';
  }

  match.updatedAt = new Date().toISOString();
  writeDB(db);

  broadcast({ type: 'MATCH_UPDATE', matchId: match.id, payload: match });
  res.json({ success: true, match });
});

// 5. Undo
app.post('/api/matches/:id/undo', (req: Request, res: Response) => {
  const db = readDB();
  const match = db.matches.find((m) => m.id === req.params.id);
  if (!match) {
    res.status(404).json({ error: 'Match not found' });
    return;
  }

  if (!match.historyStack || match.historyStack.length === 0) {
    res.status(400).json({ error: 'No score history to undo' });
    return;
  }

  const lastState = match.historyStack.pop();
  if (lastState) {
    match.teamA = lastState.teamA;
    match.teamB = lastState.teamB;
    match.recentBalls = lastState.recentBalls;
    match.currentInnings = lastState.currentInnings;
    match.activeAnimation = null;
    match.updatedAt = new Date().toISOString();
    writeDB(db);
    broadcast({ type: 'MATCH_UPDATE', matchId: match.id, payload: match });
    res.json({ success: true, match, remainingHistory: match.historyStack.length });
    return;
  }

  res.status(400).json({ error: 'Failed to restore undo state' });
});

// 6. Stream key
app.post('/api/matches/:id/stream-key', (req: Request, res: Response) => {
  const db = readDB();
  const match = db.matches.find((m) => m.id === req.params.id);
  if (!match) {
    res.status(404).json({ error: 'Match not found' });
    return;
  }
  match.streamKey = `obs_key_${Math.floor(1000000 + Math.random() * 9000000)}`;
  writeDB(db);
  res.json({ success: true, streamKey: match.streamKey, obsUrl: `http://localhost:5173/#/overlay?streamKey=${match.streamKey}` });
});

// 7. Tournaments
app.get('/api/tournaments', (_req: Request, res: Response) => {
  const db = readDB();
  res.json({ success: true, tournaments: db.tournaments });
});

// WS handler
wss.on('connection', (ws: ExtendedWebSocket) => {
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });

  console.log('ws: client connected');
  const db = readDB();
  const currentMatch = db.matches[0];
  if (currentMatch) {
    ws.send(JSON.stringify({ type: 'INITIAL_STATE', matchId: currentMatch.id, payload: currentMatch }));
  }

  ws.on('message', (rawMessage: string) => {
    try {
      const data = JSON.parse(rawMessage.toString());
      if (data.type === 'TOGGLE_OVERLAY') {
        const db = readDB();
        const match = db.matches.find((m) => m.id === data.matchId) || db.matches[0];
        if (match) {
          match.activeOverlays[data.payload.overlayId] = data.payload.visible;
          writeDB(db);
          broadcast({ type: 'OVERLAY_TOGGLE', matchId: match.id, payload: data.payload });
        }
      } else if (data.type === 'TRIGGER_ANIMATION') {
        broadcast({ type: 'ANIMATION_TRIGGER', matchId: data.matchId, payload: data.payload });
      } else if (data.type === 'STATE_SYNC') {
        // full state relay from control to overlays
        broadcast({ type: 'STATE_SYNC', matchId: data.matchId || 'match_live_001', payload: data.payload });
      }
    } catch (err) {
      console.error('WebSocket Error parsing message:', err);
    }
  });

  ws.on('close', () => {
    console.log('ws: client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`listening on :${PORT}`);
  console.log(`ws available at ws://localhost:${PORT}`);
});
