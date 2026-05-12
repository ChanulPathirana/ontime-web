import type { BusLocation } from './socketService';

export type BusEtaUpdate = {
  busId: string;
  eta: number;
};

export type SocketEventMap = {
  connect: undefined;
  disconnect: string;
  connect_error: Error;
  reconnect: number;
  'bus:location': BusLocation;
  'bus:eta': BusEtaUpdate;
};

export type SocketEventHandler<K extends keyof SocketEventMap> = (
  data: SocketEventMap[K]
) => void;

export interface SocketClient {
  connect(): void;
  disconnect(): void;
  on<K extends keyof SocketEventMap>(
    event: K,
    handler: SocketEventHandler<K>
  ): void;
  off<K extends keyof SocketEventMap>(
    event: K,
    handler?: SocketEventHandler<K>
  ): void;
  emit(event: string, data?: unknown): void;
  readonly isConnected: boolean;
}