import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { Conversation, User, Message } from '../model';
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
      console.log(conversation);
      this._conversations = conversation;
      this.change(0, conversation[0]);
    }
  }
  get conversations(): Conversation[] {
    return this._conversations;
  }
  @Output() action = new EventEmitter();
  @Output() select = new EventEmitter();
  activeIndex = 0;
  activeConversation: Conversation;
  constructor(private socketService: SocketService,
    private storage: StorageService) { }

  ngOnInit() {
    // this.socketService.receiveMessage((message: Message) => {
    //   if (message.conversation !== this.activeConversation._id) {
    //     this.conversations = this.conversations.map((conversation) => {
    //       if (conversation._id === message.conversation) {
    //         conversation.unread  = conversation.unread ? conversation.unread++ : 1;
    //       }
    //       return conversation;
    //     })
    //   }
    // });
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
    const me = this.storage.getLoggedUser();
    const member: User[] = (conversation.members as User[]).filter((user: User) => user._id !== me._id);
    return member.length ? member[0] : {};
  }

}
