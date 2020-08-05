import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
import { StorageService } from './storage.service';
const token = '123456789';
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

}
