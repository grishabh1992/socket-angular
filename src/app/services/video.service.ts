import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
import { StorageService } from './storage.service';
import { Message, Conversation, ActiveConversationEvent } from '../model';
import { Observable, Subject } from 'rxjs';
import { promise } from 'protractor';
import { SocketService } from './socket.service';

const { RTCPeerConnection, RTCSessionDescription } = window;
declare var navigator: any;

@Injectable({ providedIn: 'root' })
export class VideoService {
  public steram;
  public isAlreadyCalling;
  private socket: SocketIOClient.Socket;
  public peerConnection;
  public activeCall: {

  };
  getCalled = false;
  activeConversation$: Subject<ActiveConversationEvent> = new Subject<ActiveConversationEvent>();
  constructor(
    private storage: StorageService,
    private socketService: SocketService
  ) {
    this.peerConnection = new RTCPeerConnection();
  }

  getPermissionAndStream(conf): Observable<string> {
    const streamConf = { ...conf };
    return new Observable<string>(observer => {
      navigator.getUserMedia(
        // streamConf,
        { video: true, audio: false },
        stream => {
          this.steram = stream;
          stream.getTracks().forEach(track => this.peerConnection.addTrack(track, stream));
          console.log(stream.getTracks());
          observer.next(stream);
          observer.complete();
        },
        error => {
          console.warn(error.message);
          observer.error(error.message);
        }
      );
    });
  }

  getRemoteUser(): Observable<string> {
    return new Observable<string>(observer => {
      this.peerConnection.ontrack = ({ streams: [stream] }) => {
        console.log('track...')
          observer.next(stream);
          observer.complete();
      }
    });
  }

  async startVideoCall(videoConf) {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    if (this.isAlreadyCalling) {
      this.socketService.reInitiateVideoCall(videoConf.conversation, offer, videoConf.socket);
    }
    this.socketService.startVideoCall(videoConf.conversation, offer, videoConf.receipent);
  }

  async incomingVideoCall(conversation, offer, socket) {
    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    this.socketService.acceptVideoCall(conversation, answer, socket);
    this.getCalled = true;
  }

  async acceptedCall(conversation, data) {
    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(data.answer)
    );
    if (!this.isAlreadyCalling) {
      this.isAlreadyCalling = true;
      await this.startVideoCall({conversation, socket : data.socket});
    }
  }



}
