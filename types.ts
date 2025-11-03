export enum MessageAuthor {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  author: MessageAuthor;
  content: string;
}
