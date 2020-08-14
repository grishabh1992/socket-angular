import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
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
export class MessagesComponent implements OnInit, AfterViewChecked {
  _conversationMessages: ConversationMessages;
  other: { [key: string]: User } = {};
  receipent: User;
  me: User;
  isTypingObservable;
  typingText = '';
  keys = {};
  text: string;
  @ViewChild('messageBox') messageBox: ElementRef;
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

  ngAfterViewChecked() {
  }

  keyUp(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      event.preventDefault();
      this.keys['newline'] = false;
      return false;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.keys['newline']) {
        this.text = this.text;
      } else {
        this.sendMessage();
      }
      return false;
    }
  }
  keyDown(event) {
    this.socket.startTyping(this.conversationMessages._id);
    if (event.key === 'Shift') {
      event.preventDefault();
      this.keys['newline'] = true;
      return false;
    }
  }

  getFormatText(msg: string) {
    return msg.replace(/\n/g, '<br/>');
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
    if (this.text && this.text.trim().length) {
      this.socket.sendMessage({
        messageText: this.text.trim(),
        sender: this.me._id,
        conversation: this.conversationMessages._id,
        members: this.conversationMessages.members,
      });
    }
  }

  logout() {
    this.storage.clearAll();
    this.router.navigate(['/']);
  }

}

// @HostListener('window:keyup', ['$event'])
// keyEvent(event: KeyboardEvent) {
//   if (event.key === 'Shift') {
//     event.preventDefault();
//     this.keys['newline'] = false;
//     return false;
//   } else if (event.key === 'Enter') {
//     event.preventDefault();
//     if (this.keys['newline']) {
//       this.message = this.message;
//     } else {
//       this.send(this.message);
//     }
//     return false;
//   }
// }
// @HostListener('window:keydown', ['$event'])
// keydownEvent(event: KeyboardEvent) {
//   if (event.key === 'Shift') {
//     event.preventDefault();
//     this.keys['newline'] = true;
//     return false;
//   }
