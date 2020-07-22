export interface User {
  fullName?: string;
  gender?: string;
  schoolName?: string;
  _id?: string;
}

export interface Conversation {
  members?: User[] | string[];
  createdAt?: Date;
  _id?: string;
  isGroup?: boolean;
  groupName?: string;
}
