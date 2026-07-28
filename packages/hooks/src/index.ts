import { useCallback, useEffect, useRef, useState } from 'react';
import type { WebSocketMessage } from '@ar-sports/types';

// ============================================================================
// useWebSocket — Connect overlay to desktop app
// ============================================================================

export function useWebSocket(url: string) {
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  useEffect(() => {
    const connect = () => {
      try {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => setConnected(true);
        ws.current.onclose = () => {
          setConnected(false);
          // Auto-reconnect after 3 seconds
          setTimeout(connect, 3000);
        };
        ws.current.onerror = () => ws.current?.close();
        ws.current.onmessage = (event) => {
          try {
            const msg: WebSocketMessage = JSON.parse(event.data);
            setLastMessage(msg);
          } catch {
            // Ignore malformed messages
          }
        };
      } catch {
        setTimeout(connect, 3000);
      }
    };

    connect();
    return () => ws.current?.close();
  }, [url]);

  const send = useCallback((message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  return { connected, lastMessage, send, ws: ws.current };
}

// ============================================================================
// useCountdown — Timer for countdown graphics
// ============================================================================

export function useCountdown(seconds: number, autoStart = false) {
  const [remaining, setRemaining] = useState(seconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, remaining]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setRemaining(seconds);
    setIsRunning(false);
  }, [seconds]);

  return { remaining, isRunning, start, pause, reset, isComplete: remaining === 0 };
}

// ============================================================================
// useKeyboardShortcut — Global keyboard shortcuts
// ============================================================================

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {},
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        (!!modifiers.ctrl === e.ctrlKey || !!modifiers.ctrl === e.metaKey) &&
        !!modifiers.shift === e.shiftKey &&
        !!modifiers.alt === e.altKey
      ) {
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, modifiers]);
}

// ============================================================================
// useAnimationFrame — Smooth animation loop
// ============================================================================

export function useAnimationFrame(callback: (deltaTime: number) => void, active = true) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  useEffect(() => {
    if (!active) return;

    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [callback, active]);
}
