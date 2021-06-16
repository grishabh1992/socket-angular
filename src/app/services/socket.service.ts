import { Injectable } from "@angular/core";
// ES6 import or TypeScript
import { io } from "socket.io-client";
import { StorageService } from './storage.service';
import { Message, Conversation, ActiveConversationEvent } from '../model';
import { Subject } from 'rxjs';
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket;
  activeConversation$: Subject<ActiveConversationEvent> = new Subject<ActiveConversationEvent>();
  constructor(
    private storage: StorageService
  ) {
    this.connect();
  }

  connect() {
    const token = this.storage.getLoggedUser().token;
    if (token) {
      this.socket = io(environment.API, {
        query: { token }
      });
    }
  }


  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.socket = null;
  }

  joinRoom(roomName) {
    this.socket.emit('join', { roomName });
  }

  sendMessage(message: Message) {
    this.socket.emit('message', message);
  }

  receiveMessage(callback) {
    this.socket.on('message', callback);
  }

  receiveNewMessage(callback) {
    this.socket.on('new-message-trigger', callback);
  }

  receiveSeenStatus(callback) {
    this.socket.on('seen-trigger', callback);
  }

  typing(callback) {
    this.socket.on('typing', callback);
  }

  startTyping(conversation: string) {
    this.socket.emit('typing', conversation);
  }

  messageSeen(conversation: string, date: Date) {
    this.socket.emit('seen', conversation, date)
  }
}
