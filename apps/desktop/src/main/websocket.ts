import { WebSocketServer, WebSocket } from 'ws';

export function startWebSocketServer(port: number): WebSocketServer {
  const wss = new WebSocketServer({ port });

  console.log(`WebSocket server started on port ${port}`);

  wss.on('connection', (ws: WebSocket) => {
    console.log('Overlay client connected');

    // Send initial connection message
    ws.send(JSON.stringify({
      type: 'CONNECTION',
      payload: { status: 'connected', timestamp: new Date().toISOString() },
    }));

    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('WS message received:', message.type);
      } catch {
        console.error('Invalid WS message');
      }
    });

    ws.on('close', () => {
      console.log('Overlay client disconnected');
    });

    ws.on('error', (error: Error) => {
      console.error('WS client error:', error.message);
    });
  });

  wss.on('error', (error: Error) => {
    console.error('WebSocket server error:', error.message);
  });

  return wss;
}
