import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  @Input() conversations;
  @Output() action = new EventEmitter();
  activeIndex = 0;
  constructor() { }

  ngOnInit() {
  }

  add() {
    this.action.emit('close');
  }

  change(index) {
    this.activeIndex = index;
  }

}
