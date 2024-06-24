import { Booking } from "@prisma/client";

export const flatFilterableFields: string[] = [
  "searchTerm",
  "flatName",
  "squareFeet",
  "totalBedrooms",
  "totalRooms",
  "location",
  "rent",
];

export const flatSearchableFields:string[] = [
  "utilitiesDescription",
  "location",
  "description",
];

export interface FlatCreateInput {
  flatName: string | null;
  email: string | null;
  squareFeet: number | null;
  totalBedrooms: number | null;
  totalRooms: number | null;
  utilitiesDescription: string | null;
  location: String | null;
  description: String | null;
  amenities: String | null;
  rent: number | null;
  advanceAmount: number | null;
  availability: Boolean;
  flatPhoto: string | null;
}

export interface IUpdateFlat {
  flatName: string | null | undefined;
  userId: string | null | undefined;
  squareFeet: number | null | undefined;
  totalBedrooms: number | null | undefined;
  totalRooms: number | null | undefined;
  utilitiesDescription: string | null | undefined;
  location: String | null | undefined;
  description: String | null | undefined;
  amenities: String | null | undefined;
  rent: number | null | undefined;
  advanceAmount?: number | null | undefined;
  availability?: Boolean | undefined;
  flatPhoto?: string | null | undefined;
  booking?: Booking;
}