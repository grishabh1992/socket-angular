import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SocketService } from '../services/socket.service';
import { VideoService } from '../services/video.service';
declare var URL: any;
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@UntilDestroy()
@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, AfterViewInit {
  myStream: string;
  isAudio = true;
  isVideo = true;
  @Input() headerText: string;
  @Input() lastGroup = false;
  @ViewChild('video') video: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;
  constructor(
    private videoService: VideoService,
    private socketService: SocketService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  async ngOnInit() {
    // this.socketService.membersInVideo((users) => {
    //   console.log('Joined users', users);
    // })
    console.log(this.data);
    if (this.data.initiator) {
      this.videoService.startVideoCall({ conversation: this.data.conversation, receipent: this.data.receipent });
    } else {
      // await this.videoService.incomingVideoCall(this.data.conversation, this.offer, this.socketId);
    }
    //
    this.socketService.acceptedVideoCall(async (data) => {
      await this.videoService.acceptedCall(this.data.conversation, data);
    })
  }

  ngAfterViewInit() {
    this.getMediaStream();
    this.getRemoteUser();
  }

  getRemoteUser() {
    const _video = this.remoteVideo.nativeElement;
    this.videoService.getRemoteUser().subscribe((data) => {
      console.log('Remote user');
      _video.srcObject = data;
      // _video.onloadedmetadata = function (e: any) { };
      _video.play();
    })
  }
  getMediaStream() {
    const _video = this.video.nativeElement;
    this.videoService.getPermissionAndStream(
      {
        video: this.isVideo,
        audio: this.isAudio
      }
    ).pipe(untilDestroyed(this)).subscribe((data: any) => {
      // (<any>window).stream = data;
      _video.srcObject = data;
      // _video.onloadedmetadata = function (e: any) { };
      _video.play();
    })
  }

  toggleAudio() {
    this.isAudio = !this.isAudio;
    this.getMediaStream();
  }

  toggleVideo() {
    this.isVideo = !this.isVideo;
    this.getMediaStream();
  }

  cut() {

  }

  start() {
    this.getMediaStream();
  }
}
