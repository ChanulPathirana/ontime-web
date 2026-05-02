import type { BusLocation } from './socketService';

/**
 * Strongly typed event map (🔥 big upgrade)
 */
type Events = {
  connect: { id: string };
  disconnect: string;
  'bus:location': BusLocation;
};

type Handler<T = unknown> = (data: T) => void;

/**
 * Initial mock buses (Colombo area)
 */
const INITIAL_BUSES: BusLocation[] = [
  { busId: 'BUS-01', routeId: 'R138', lat: 6.930, lng: 79.851, speed: 32, heading: 60,  timestamp: Date.now(), occupancy: 'low'    },
  { busId: 'BUS-02', routeId: 'R154', lat: 6.918, lng: 79.862, speed: 25, heading: 135, timestamp: Date.now(), occupancy: 'medium' },
  { busId: 'BUS-03', routeId: 'R120', lat: 6.944, lng: 79.841, speed: 0,  heading: 0,   timestamp: Date.now(), occupancy: 'high'   },
];

/**
 * Mock socket simulator (acts like a fake backend)
 */
class MockSocketSimulator {
  private handlers = new Map<keyof Events, Set<Handler>>();
  private buses: BusLocation[] = JSON.parse(JSON.stringify(INITIAL_BUSES)); // safer than structuredClone
  private interval: ReturnType<typeof setInterval> | null = null;
  private _connected = false;

  /**
   * Simulate socket connection
   */
  connect() {
    if (this._connected) {
      console.warn('[MockSocket] Already connected');
      return;
    }

    console.log('[MockSocket] Connecting...');

    setTimeout(() => {
      this._connected = true;

      this._emit('connect', { id: 'mock-socket-id' });

      this._startSimulation();
    }, 350);
  }

  /**
   * Start bus movement simulation
   */
  private _startSimulation() {
    if (this.interval) return; // prevent duplicate loops

    this.interval = setInterval(() => {
      this.buses = this.buses.map(this._moveBus);

      this.buses.forEach((bus) => {
        this._emit('bus:location', bus);
      });
    }, 1600);
  }

  /**
   * Move a single bus realistically
   */
  private _moveBus = (bus: BusLocation): BusLocation => {
    const rad = (bus.heading * Math.PI) / 180;

    // movement factor based on speed
    const factor = (bus.speed / 80) * 0.0006;

    return {
      ...bus,
      lat: bus.lat + Math.cos(rad) * factor + (Math.random() - 0.5) * 0.00008,
      lng: bus.lng + Math.sin(rad) * factor + (Math.random() - 0.5) * 0.00008,
      speed: Math.max(0, Math.min(60, bus.speed + (Math.random() - 0.5) * 4)),
      heading: (bus.heading + (Math.random() - 0.5) * 10 + 360) % 360,
      timestamp: Date.now(),
    };
  };

  /**
   * Subscribe to event (typed)
   */
  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }

    this.handlers.get(event)!.add(handler as Handler);
  }

  /**
   * Unsubscribe from event
   */
  off<K extends keyof Events>(event: K, handler?: Handler<Events[K]>) {
    if (!this.handlers.has(event)) return;

    if (handler) {
      this.handlers.get(event)!.delete(handler as Handler);
    } else {
      this.handlers.delete(event);
    }
  }

  /**
   * Emit event internally
   */
  private _emit<K extends keyof Events>(event: K, data: Events[K]) {
    this.handlers.get(event)?.forEach((handler) => {
      handler(data);
    });
  }

  /**
   * Disconnect simulator and clean everything
   */
  disconnect() {
    if (!this._connected) return;

    console.warn('[MockSocket] Disconnected');

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.handlers.clear(); // 🔥 prevent memory leaks

    this._connected = false;

    this._emit('disconnect', 'manual');
  }

  /**
   * Connection status
   */
  get isConnected() {
    return this._connected;
  }
}

// Singleton export
export const mockSimulator = new MockSocketSimulator();