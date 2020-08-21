import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { Conversation, User, Message, ActiveConversationEvent } from '../model';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  private _conversations: Conversation[];
  @Input()
  set conversations(conversation: Conversation[]) {
    if (conversation && conversation.length) {
      this._conversations = conversation;
      if (this.activeIndex === -1) {
        this.change(0, conversation[0]);
      }
    }
  }
  get conversations(): Conversation[] {
    return this._conversations;
  }
  @Output() action = new EventEmitter();
  @Output() select = new EventEmitter();
  activeIndex = -1;
  activeConversation: Conversation;
  me;
  constructor(private socketService: SocketService,
    private storage: StorageService) {
    this.me = this.storage.getLoggedUser()
  }

  ngOnInit() {
    this.socketService.activeConversation$.subscribe((event: ActiveConversationEvent) => {
      this.conversations[this.activeIndex] = { ...event.conversation, unreadCount: 0 };
    });
    this.socketService.receiveUnseenMessage((newMessage: Message) => {
      console.log('Receive Unseen', newMessage);
      this.conversations = this.conversations.map((conversation: Conversation) => {
        if (conversation._id === newMessage.conversation) {
          conversation.unreadCount++;
        }
        return conversation;
      });
    })
  }

  add() {
    this.action.emit('close');
  }

  change(index: number, conversation: Conversation) {
    this.activeIndex = index;
    this.activeConversation = conversation;
    this.socketService.joinRoom(conversation._id);
    this.select.emit(conversation);
  }

  getReceipt(conversation: Conversation) {
    const member: User[] = (conversation.members as User[]).filter((user: User) => user._id !== this.me._id);
    return member.length ? member[0] : {};
  }

}
