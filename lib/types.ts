import type { ReactNode } from "react";

export type DealType = "sale" | "rent" | "mortgage";
export type PropertyCategory =
  | "apartment"
  | "villa"
  | "penthouse"
  | "office"
  | "duplex"
  | "studio";
export type PropertyStatus = "active" | "pending" | "sold" | "rented";

export interface Property {
  id: string;
  title: string;
  subtitle: string;
  dealType: DealType;
  category: PropertyCategory;
  city: string;
  district: string;
  address: string;
  price: number;
  deposit?: number;
  monthly?: number;
  area: number;
  landArea?: number;
  rooms: number;
  bathrooms: number;
  parking: number;
  year: number;
  floor: number;
  totalFloors: number;
  amenities: string[];
  images: string[];
  description: string;
  highlights: string[];
  consultantId: string;
  status: PropertyStatus;
  featured: boolean;
  views: number;
  createdAt: string;
  coords: { x: number; y: number };
  tour?: boolean;
  aiScore?: number;
}

export interface Consultant {
  id: string;
  name: string;
  role: string;
  phone: string;
  rating: number;
  deals: number;
  experience: number;
  specialties: string[];
  bio: string;
  initials: string;
  tone: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  propertyId: string;
  stage: "new" | "contacted" | "visit" | "negotiation" | "closed";
  value: number;
  source: string;
  agentId: string;
  createdAt: string;
  note: string;
}

export interface Message {
  id: string;
  name: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  channel: string;
}

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  propertyIds?: string[];
  quickReplies?: string[];
}

export interface ReactNodeChild {
  children: ReactNode;
}
