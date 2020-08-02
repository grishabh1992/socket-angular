import { Component, OnInit, Input } from '@angular/core';
import { ConversationMessages } from '../model';
import { APIService } from '../services/api.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  private conversationId: string;
  conversationMessages : ConversationMessages;
  messages = [];
  @Input()
  set conversation(conversationId: string) {
    this.conversationId = conversationId;
    this.api.messages({ params: { ref : JSON.stringify(['members', 'sender']) } }).subscribe((reponse: any) => {
      this.conversationMessages = reponse.data;
    });
  }
  get conversation(): string {
    return this.conversationId;
  }

  text: string;
  constructor(private api: APIService) { }

  ngOnInit() {
  }

  sendMessage(text) {

  }

}
