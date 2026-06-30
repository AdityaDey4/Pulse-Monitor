export interface EmailRecipientType {
  id: number;

  name: string;

  email: string;

  consecutiveThreshold: number;

  createdAt: Date;

  updatedAt: Date;
}