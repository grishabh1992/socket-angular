import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
const token = '123456789';
@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
      query: { token }
    });
  }

  joinRoom(roomName) {
    this.socket.send();
  }

}
