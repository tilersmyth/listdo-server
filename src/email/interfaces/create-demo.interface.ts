interface Payload {
  messageId: string;
  from: string;
  to: string[];
  cc: string[];
  subject: string;
  bodyText: string | null;
  bodyHtml: string | null;
}

export interface CreateDemo {
  board: string;
  list: string | null;
  payload: Payload;
}
