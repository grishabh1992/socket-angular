import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Conversation, User } from './model';
import { SocketService } from './services/socket.service';
import { VideoService } from './services/video.service';
import { VideoComponent } from './video/video.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-socket';
  socketId: string;
  conversation: Conversation;
  offer;
  showAcceptDialog = false;
  constructor(private socket: SocketService,
    public videoService: VideoService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.socket.videoInvitation(async (infromation) => {
      console.log('videoInvitation');
      this.socketId = infromation.socket;
      this.conversation = infromation.conversation;
      this.offer = infromation.offer;
      if (this.videoService.getCalled) {
        console.log('getCalled')
        this.showAcceptDialog = true;
      } else {
        await this.videoService.incomingVideoCall(this.conversation, this.offer, this.socketId);
      }
    });
  }

  async acceptVideo() {
    this.showAcceptDialog = false;

    const dialogRef = this.dialog.open(VideoComponent, {
      data: {
        conversation: this.conversation,
        initiator: false
      }
    });
    await this.videoService.incomingVideoCall(this.conversation, this.offer, this.socketId);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
