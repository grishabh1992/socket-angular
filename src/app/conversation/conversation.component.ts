import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  @Input() conversations;
  @Output() action = new EventEmitter();
  activeIndex = 0;
  constructor(private socketService : SocketService) { }

  ngOnInit() {
  }

  add() {
    this.action.emit('close');
  }

  change(index) {
    this.activeIndex = index;
    this.socketService.joinRoom('HI');
  }

}
