import { Component, OnInit, Input } from '@angular/core';
import { ConversationMessages, User } from '../model';
import { APIService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  private conversationId: string;
  _conversationMessages: ConversationMessages;
  other : User;
  me : User;
  @Input()
  set conversationMessages(conversation: ConversationMessages) {
    this._conversationMessages = conversation;
    this.me = this.storage.getLoggedUser();
    if(conversation && !conversation.isGroup) {
      this.other = (conversation.members as User[]).filter((user: User) => user._id !== this.me._id)[0];

    }
  }
  get conversation(): ConversationMessages {
    return this._conversationMessages;
  }
  // @Input()
  // set conversation(conversationId: string) {
  //   this.conversationId = conversationId;
  //   this.api.messages({ params: { ref: JSON.stringify(['members', 'sender']) } }).subscribe((reponse: any) => {
  //     this.conversationMessages = reponse.data;
  //   });
  // }
  // get conversation(): string {
  //   return this.conversationId;
  // }

  text: string;
  constructor(private api: APIService,
    private router: Router,
    private socket : SocketService,
    private storage: StorageService) { }

  ngOnInit() {
    this.me = this.storage.getLoggedUser();
  }

  sendMessage(text) {
    // this.socket
  }

  logout() {
    this.storage.clearAll();
    this.router.navigate(['/']);
  }

}
