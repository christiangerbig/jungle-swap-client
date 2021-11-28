// ---------- Plants ----------
export type PlantId = string;

// ---------- Images ----------
type ImagePublicId = string;
type ImageUrl = string;

// ---------- Messages ----------
export type MessageId = string;

// ---------- User authentication ----------
export interface User {
  _id?: string;
  username?: string;
  email: string;
  password: string;
  amountOfRequests?: number;
  amountOfReplies?: number;
}

// ---------- Plants ----------
export interface Plant {
  _id?: string;
  name?: string;
  description?: string;
  size?: number;
  imageUrl?: string;
  imagePublicId?: string;
  location?: string;
  price?: number;
  creator?: string | User;
}

// ---------- Images ----------
export interface UploadImageData {
  imageUrl?: ImageUrl;
  imagePublicId?: ImagePublicId;
}

export interface DestroyImageData {
  imagePublicId?: ImagePublicId;
}

// ---------- Messages ----------
export interface Message {
  _id?: string;
  buyer?: string | User;
  seller?: string | User;
  plant?: string | Plant;
  request?: string;
  reply?: string;
  messageState?: boolean;
}

export interface MessageCounters {
  amountOfRequests?: number;
  amountOfReplies?: number;
}
