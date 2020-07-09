import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  @Input() messages;

  text: string;
  constructor() { }

  ngOnInit() {
  }

  sendMessage(text) {

  }

}
