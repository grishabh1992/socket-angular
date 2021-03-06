export interface User {
  username?: string;
  gender?: string;
  _id?: string;
  profile?: string;
  sockets?: string;
}

export interface Message {
  sender?: User | string;
  messageText?: string;
  createdAt?: Date;
  conversation?: Conversation | string;
  members?: User[] | string[];
  _id?: string;
  seen?: string[];
}

export interface Conversation {
  members?: User[] | string[];
  createdAt?: Date;
  _id?: string;
  isGroup?: boolean;
  groupName?: string;
  unreadCount?: number;
  lastMessage?: Message;
}

export interface ConversationMessages extends Conversation {
  messages: Message[]
}

export interface ActiveConversationEvent {
  conversation: Conversation,
  event: string;
}
