import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
import { StorageService } from './storage.service';
import { Message } from '../model';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: SocketIOClient.Socket;

  constructor(
    private storage: StorageService
  ) {
    this.socket = io('http://localhost:3001', {
      query: { token: this.storage.getLoggedUser().token }
    });
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
