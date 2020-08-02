import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { Conversation, User } from '../model';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  @Input() conversations: Conversation;
  @Output() action = new EventEmitter();
  activeIndex = 0;
  constructor(private socketService: SocketService,
    private storage: StorageService) { }

  ngOnInit() {
  }

  add() {
    this.action.emit('close');
  }

  change(index) {
    this.activeIndex = index;
    this.socketService.joinRoom('HI');
  }

  getReceipt(conversation: Conversation) {
    const me = this.storage.getLoggedUser();
    const member: User[] = (conversation.members as User[]).filter((user: User) => user._id !== me._id);
    return member.length ? member[0] : {};
  }

}
