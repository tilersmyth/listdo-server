export interface EmailStatus {
  type?: 'open' | 'closed' | 'pending';
  user: string[];
  note?: string;
}
