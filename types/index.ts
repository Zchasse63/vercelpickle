/**
 * Type definitions for the Pickle B2B Marketplace
 *
 * This file re-exports all types from the dedicated type files
 * for easier importing throughout the application.
 */

// Re-export all types from dedicated files
export * from './user';
export * from './product';
export * from './order';
export * from './cart';
export * from './payment';
export * from './ui';
export * from './convex';

// Review types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: number;
  updatedAt: number;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  createdAt: number;
  updatedAt: number;
}

// Support ticket types
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  createdAt: number;
}
