export interface EmailPayload {
  messageId: string;
  inReplyTo?: string;
  subject: string;
  text: string;
  textAsHtml: string;
  textPreview: string;
  date: Date;
}
