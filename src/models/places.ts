import { CommonAttributes } from './common.js';

export enum NearbyPlacesUnit {
  KM = 'KM',
  MILES = 'Miles',
}

export enum PlaceStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  UNKNOWN = 'Unknown',
  UNVERIFIED = 'Unverified',
}

export interface Coordinates {
  lat: number;
  long: number;
}

export interface Place extends CommonAttributes {
  coordinates: Coordinates;
  status: PlaceStatus;
}
