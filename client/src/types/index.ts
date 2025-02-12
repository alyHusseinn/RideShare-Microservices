export interface Location {
  lat: number;
  long: number;
}

export interface Trip {
  tripId: number;
  riderId: number;
  driverId?: number;
  pickupLocation: Location;
  destination: Location;
  status: 'pending' | 'ongoing' | 'completed';
}

export interface User {
  id: number;
  username: string;
  role: 'driver' | 'rider';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}