import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { initDatabase, saveDatabase } from './database';
import { startWebSocketServer } from './websocket';

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV !== 'production';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'AR Sports Studio Pro',
    backgroundColor: '#0A0E17',
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/out/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// State
let db: Awaited<ReturnType<typeof initDatabase>> | null = null;
let wss: ReturnType<typeof startWebSocketServer> | null = null;

// IPC handlers for database access
ipcMain.handle('db:query', async (_event: any, sql: string, params?: unknown[]) => {
  try {
    if (!db) throw new Error('Database not initialized');
    const stmt = db.prepare(sql);
    if (params && params.length > 0) stmt.bind(params as any);
    const rows: any[] = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  } catch (error) {
    console.error('DB query error:', error);
    throw error;
  }
});

ipcMain.handle('db:run', async (_event: any, sql: string, params?: unknown[]) => {
  try {
    if (!db) throw new Error('Database not initialized');
    db.run(sql, params as any);
    const lastId = db.exec('SELECT last_insert_rowid()')[0]?.values[0][0];
    const changes = db.getRowsModified();
    saveDatabase();
    return { changes, lastInsertRowid: lastId };
  } catch (error) {
    console.error('DB run error:', error);
    throw error;
  }
});

ipcMain.handle('db:get', async (_event: any, sql: string, params?: unknown[]) => {
  try {
    if (!db) throw new Error('Database not initialized');
    const stmt = db.prepare(sql);
    if (params && params.length > 0) stmt.bind(params as any);
    let result = null;
    if (stmt.step()) result = stmt.getAsObject();
    stmt.free();
    return result;
  } catch (error) {
    console.error('DB get error:', error);
    throw error;
  }
});

// Broadcast score state to overlay via WebSocket
ipcMain.handle('ws:broadcast', async (_event: any, data: unknown) => {
  try {
    if (!wss) return;
    wss.clients.forEach((client: any) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(JSON.stringify(data));
      }
    });
  } catch (error) {
    console.error('WS broadcast error:', error);
  }
});

app.whenReady().then(async () => {
  // Initialize database
  db = await initDatabase();

  // Start WebSocket server
  wss = startWebSocketServer(8765);

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
