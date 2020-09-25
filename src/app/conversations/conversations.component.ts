import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { Conversation, User, Message, ActiveConversationEvent } from '../model';
import { StorageService } from '../services/storage.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-conversation',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationComponent implements OnInit {
  private _conversations: Conversation[];
  activeIndex = -1;
  activeConversation: Conversation;
  me: User;
  receipt: User;
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

  constructor(private socketService: SocketService,
    private storage: StorageService) {
    this.me = this.storage.getLoggedUser()
  }

  ngOnInit() {
    this.socketService.activeConversation$.pipe(untilDestroyed(this)).subscribe((event: ActiveConversationEvent) => {
      this.conversations[this.activeIndex] = { ...event.conversation, unreadCount: 0 };
    });
    this.socketService.receiveUnseenMessage((newMessage: Message) => {
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
    this.activeConversation = {...conversation};
    this.socketService.joinRoom(conversation._id);
    this.select.emit({...conversation});
  }

  getReceipt(conversation: Conversation) {
    const member: User[] = (conversation.members as User[]).filter((user: User) => user._id !== this.me._id);
    return member.length ? member[0] : {};
  }

}
