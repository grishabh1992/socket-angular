import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
import { StorageService } from './storage.service';
import { Message, Conversation, ActiveConversationEvent } from '../model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: SocketIOClient.Socket;
  activeConversation$: Subject<ActiveConversationEvent> = new Subject<ActiveConversationEvent>();
  constructor(
    private storage: StorageService
  ) {
    this.connect();
  }

  getSocket(): SocketIOClient.Socket {
    return this.socket;
  }

  connect() {
    const token = this.storage.getLoggedUser().token;
    if (token) {
      this.socket = io('http://localhost:3001', {
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

  receiveUnseenMessage(callback) {
    this.socket.on('unseen-message', callback);
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

  startVideoCall(conversation: Conversation, offer, receipent) {
    this.socket.emit('initiate-video', { conversation, offer, receipent });
  }

  reInitiateVideoCall(conversation: Conversation, offer, socket) {
    this.socket.emit('reinitiate-video', { conversation, offer, socket });
  }

  videoInvitation(callback) {
    this.socket.on('made-request', callback);
  }

  acceptVideoCall(conversation: Conversation, answer, socket) {
    this.socket.emit('call-video-accept', { conversation, answer, socket });
  }

  acceptedVideoCall(callback) {
    this.socket.on('call-video-accepted', callback);
  }
}
