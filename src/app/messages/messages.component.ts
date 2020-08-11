import { Component, OnInit, Input } from '@angular/core';
import { ConversationMessages, User, Message } from '../model';
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
  other: User;
  me: User;
  @Input()
  set conversationMessages(conversation: ConversationMessages) {
    this._conversationMessages = conversation;
    this.me = this.storage.getLoggedUser();
    if (conversation && !conversation.isGroup) {
      this.other = (conversation.members as User[]).filter((user: User) => user._id !== this.me._id)[0];

    }
  }
  get conversationMessages(): ConversationMessages {
    return this._conversationMessages;
  }

  text: string;
  constructor(private api: APIService,
    private router: Router,
    private socket: SocketService,
    private storage: StorageService) { }

  ngOnInit() {
    this.me = this.storage.getLoggedUser();
    this.socket.receiveMessage((message : Message) => {
      this.conversationMessages.messages.push(message);
      this.text = '';
    });
  }

  sendMessage() {
    this.socket.sendMessage({
      messageText: this.text,
      sender: this.me._id,
      conversation: this.conversationMessages._id,
      members: this.conversationMessages.members,
    });
  }

  logout() {
    this.storage.clearAll();
    this.router.navigate(['/']);
  }

}
