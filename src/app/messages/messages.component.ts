import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewChecked, ChangeDetectionStrategy, ViewChildren, QueryList } from '@angular/core';
import { ConversationMessages, User, Message } from '../model';
import { APIService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
@UntilDestroy()
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, AfterViewChecked {
  _conversationMessages: ConversationMessages;
  other: { [key: string]: User } = {};
  receipent: User;
  me: User;
  isTypingObservable;
  typingText = '';
  keys: { [key: string]: boolean } = {};
  text: string;
  private isNearBottom = true;
  groupedMessages = {};

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChildren('message') itemElements: QueryList<any>;
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
      this.scrollToBottom();
      this.socket.messageSeen(this.conversationMessages._id, new Date());
      if(this._conversationMessages.messages){
        this.socket.activeConversation$.next({
          conversation: {
            ...this.conversationMessages,
            lastMessage: this._conversationMessages.messages[this._conversationMessages.messages.length - 1],
          }, event: 'seen'
        }); 
        this.groupMessage();
      }    
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
      if (message.conversation === this._conversationMessages._id) {
        this.conversationMessages.messages.push(message);
        this.groupMessage();
        this.text = '';
        this.messageSeen();
      }
    });
    this.socket.typing((conversation: string, user: User) => {
      if (this.conversationMessages._id === conversation) {
        this.typing(user);
      }
    });
  }

  setMessage(text: string) {
    this.text = text;
  }

  groupMessage() {
    this.groupedMessages = this.conversationMessages.messages.reduce((groupedMessage, currentValue)=> {
      const createdDate = new Date(currentValue.createdAt);
      const key = `${createdDate.getDate()}-${createdDate.getMonth()}-${createdDate.getFullYear()}`;
      if(!groupedMessage[key]){
        groupedMessage[key] = [];
      }
      groupedMessage[key].push(currentValue);
      return groupedMessage;
    }, {});
  }

  ngAfterViewChecked() {
    this.itemElements.changes.pipe(untilDestroyed(this)).pipe(untilDestroyed(this)).subscribe(_ => this.onItemElementsChanged());
  }

  getSeenUser(usersId : string[]) {
    const text = (usersId|| []).map((id)=> {
      return this.other[id].username;
    }).join(', ');
    return text.length ? `seen by ${text}`: '';
  }

  private messageSeen() {
    if (this.isNearBottom) {
      this.socket.messageSeen(this.conversationMessages._id, new Date());
      this.socket.activeConversation$.next({
        conversation: {
          ...this.conversationMessages
          , lastMessage: this._conversationMessages.messages[this._conversationMessages.messages.length - 1],
        }, event: 'seen'
      });
    }
  }
  private onItemElementsChanged(): void {
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position = this.myScrollContainer.nativeElement.scrollTop + this.myScrollContainer.nativeElement.offsetHeight;
    const height = this.myScrollContainer.nativeElement.scrollHeight;
    return position > height - threshold;
  }

  scrolled(event: any): void {
    const nowAtBottom = this.isUserNearBottom();
    if (nowAtBottom !== this.isNearBottom) {
      this.isNearBottom = nowAtBottom;
      this.messageSeen();
    }
  }

  scrollToBottom(): void {
    try {
      // For Frequent Scroll
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      // For very somth Scroll
      // this.myScrollContainer.nativeElement.scrollTo({
      //   left: 0,
      //   top: this.myScrollContainer.nativeElement.scrollHeight, behavior: 'smooth'
      // });
    } catch (err) { }
  }

  keyUp(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      event.preventDefault();
      this.keys.newline = false;
      return false;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.keys.newline) {
        this.text = this.text;
      } else {
        this.sendMessage();
      }
      return false;
    }
  }
  keyDown(event: KeyboardEvent) {
    this.socket.startTyping(this.conversationMessages._id);
    if (event.key === 'Shift') {
      event.preventDefault();
      this.keys.newline = true;
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
    this.socket.disconnect();
    this.router.navigate(['/']);
  }

}
