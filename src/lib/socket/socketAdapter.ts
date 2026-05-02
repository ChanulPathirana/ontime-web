// Single source of truth for socket layer (mock vs real backend)

import { mockSimulator } from './mockSimulator';
import { socketService } from './socketService';

// Default to mock in development for safety
const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_SOCKET?.toLowerCase() === 'true' || true;

// Log current mode once at startup
console.log(
  `[Socket] Running in ${USE_MOCK ? 'MOCK MODE' : 'REAL BACKEND MODE'}`
);

// Export unified socket interface used across the app
export const socketClient = USE_MOCK ? mockSimulator : socketService;

Object.freeze(socketClient);

// Shared type for tracking data consistency across app
export type { BusLocation } from './socketService.ts';