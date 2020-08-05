import { Component, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';
import { Conversation, ConversationMessages } from '../model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  conversations = [];
  conversationMessages : ConversationMessages;
  users = [];
  isNewConversation = false;
  constructor(private api: APIService) { }

  ngOnInit() {
    this.getConversations();
  }

  getConversations() {
    this.api.conversations({ params: { ref: JSON.stringify(['members']) } }).subscribe((reponse: any) => {
      this.conversations = reponse.data;
    });

  }

  async startNewConversation(conversation: Conversation) {
    this.api.initiateConversation({ body: conversation }).subscribe();
    this.isNewConversation = false;
    this.getConversations();
  }

  async startConversation(conversation: Conversation) {
    this.api.messages({ params: conversation }).subscribe((response: any) => {
      console.log(response);
      this.conversationMessages = response.data[0];
    });
  }

}
