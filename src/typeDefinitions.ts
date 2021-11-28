export type PlantId = string | undefined;
export type ImagePublicId = string | undefined;
export type ImageUrl = string;
export type MessageId = string | undefined;
export type IntervalId = NodeJS.Timer | null;
export type ErrorMessage = string | null;

export interface User {
  _id?: string;
  username?: string;
  email: string;
  password: string;
  amountOfRequests?: number;
  amountOfReplies?: number;
}

export interface Plant {
  _id?: string;
  name?: string;
  description?: string;
  size?: number;
  imageUrl?: string;
  imagePublicId?: string;
  location?: string;
  price?: number;
  creator?: string | User | undefined;
}

export interface UploadImageData {
  imageUrl?: ImageUrl;
  imagePublicId?: ImagePublicId;
}

export interface DestroyImageData {
  imagePublicId?: ImagePublicId;
}

export interface Message {
  _id?: string;
  buyer?: string | User | undefined;
  seller?: string | User | undefined;
  plant?: string | Plant | undefined;
  request?: string;
  reply?: string;
  messageState?: boolean;
}

export interface MessageCounters {
  amountOfRequests?: number;
  amountOfReplies?: number;
}
