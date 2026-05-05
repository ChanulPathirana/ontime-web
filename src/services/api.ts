const BASE = process.env.NEXT_PUBLIC_G2_BASE_URL ?? 'http://localhost:8000';

export type ApiRoute = {
  id: number;
  name: string;
  route_number: string | null;
  color: string | null;
  destination: string | null;
};

export type ApiTransitRoute = {
  id: string;
  number: string;
  name: string;
  color: string;
  path: [number, number][];
  stops: { name: string; coordinates: [number, number] }[];
};

export type ApiStop = {
  id: number;
  name: string;
  coordinates: [number, number] | null;
  routes: string[];
};

export type ApiNearbyStop = ApiStop & { distance_m: number };

export type ApiRouteSearch = {
  count: number;
  routes: {
    route_id: number;
    name: string;
    route_number: string | null;
    color: string | null;
    start_stop_name: string;
    end_stop_name: string;
  }[];
};

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<T>;
}

export const fetchAllTransitRoutes = () =>
  apiFetch<Record<string, ApiTransitRoute>>('/api/v1/routes/all-transit-data');

export const fetchRoutes = () =>
  apiFetch<ApiRoute[]>('/api/v1/routes');

export const fetchAllStops = () =>
  apiFetch<ApiStop[]>('/api/v1/stops');

export const fetchNearbyStops = (lat: number, lon: number, radius = 500) =>
  apiFetch<ApiNearbyStop[]>(`/api/v1/stops/nearby?lat=${lat}&lon=${lon}&radius_m=${radius}`);

export const fetchStopRoutes = (stopId: string | number) =>
  apiFetch<ApiRoute[]>(`/api/v1/stops/${stopId}/routes`);

export const searchRoutes = (
  startLat: number, startLon: number,
  endLat: number, endLon: number,
  radius = 500,
) =>
  apiFetch<ApiRouteSearch>(
    `/api/v1/routes/search?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}&radius_m=${radius}`,
  );

// ── Bus endpoints ─────────────────────────────────────────────────────────────

export type ApiBusResponse = {
  id: string;
  fleet_code: string;
  plate_number: string;
  status: string;
  route_id: string | null;
  capacity: number | null;
};

export type ApiLiveBusResponse = ApiBusResponse & {
  latitude: number | null;
  longitude: number | null;
};

export const fetchLiveBuses = () =>
  apiFetch<ApiLiveBusResponse[]>('/api/v1/buses/live');

export const fetchBusesByRoute = (routeId: string | number) =>
  apiFetch<ApiBusResponse[]>(`/api/v1/buses/route/${routeId}`);

export const fetchBus = (busId: string | number) =>
  apiFetch<ApiBusResponse>(`/api/v1/buses/${busId}`);
