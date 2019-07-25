export interface TaskStatus {
  type?: 'open' | 'closed' | 'pending';
  user: string[];
  message?: string;
}
