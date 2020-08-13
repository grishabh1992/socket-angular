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
  other: { [key: string]: User } = {};
  receipent: User;
  me: User;
  // isTyping: boolean;
  isTypingObservable;
  typingText = '';
  @Input()
  set conversationMessages(conversation: ConversationMessages) {
    if (conversation) {
      this._conversationMessages = conversation;
      this.me = this.storage.getLoggedUser();
      this.receipent = (conversation.members as User[]).filter((user: User) => {
        return this.me._id !== user._id;
      })[0];
      (conversation.members as User[]).forEach((user: User) => {
        this.other[user._id] = user;
      });
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
    this.socket.receiveMessage((message: Message) => {
      if (!this.conversationMessages.messages) {
        this.conversationMessages.messages = [];
      }
      this.conversationMessages.messages.push(message);
      this.text = '';
    });
    this.socket.typing((user: User) => {
      this.typing(user);
    })
  }

  keyUp(event) {

  }
  keyDown(event) {
    this.socket.startTyping(this.conversationMessages._id)
  }

  typing(user: User) {
    if (user && user._id !== this.me._id) {
      clearTimeout(this.isTypingObservable);
      console.log('Typing Start');
      this.typingText = `${user.username} is typing`;
      this.isTypingObservable = setTimeout(() => {
        console.log('Typing End');
        this.typingText = '';
      }, 800);
    }
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
