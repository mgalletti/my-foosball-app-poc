import { CommonAttributes } from './common.js';

export enum NearbyPlacesUnit {
  KM = 'KM',
  MILES = 'MILES',
}

export enum PlaceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNKNOWN = 'UNKNOWN',
  UNVERIFIED = 'UNVERIFIED',
}

export interface Coordinates {
  lat: number;
  long: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  type: string;
}

export interface Place extends CommonAttributes {
  coordinates: Coordinates;
  status: PlaceStatus;
  address?: Address;
}
