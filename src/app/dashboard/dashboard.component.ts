import { Component, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';
import { Conversation, ConversationMessages } from '../model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
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
    this.api.conversations({ params: { ref: JSON.stringify(['members']) } }).pipe(untilDestroyed(this)).subscribe((reponse: any) => {
      this.conversations = reponse.data;
    });

  }

  async startNewConversation(conversation: Conversation) {
    this.api.initiateConversation({ body: conversation }).pipe(untilDestroyed(this)).subscribe();
    this.isNewConversation = false;
    this.getConversations();
  }

  async startConversation(conversation: Conversation) {
    this.api.messages({ params: conversation }).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.conversationMessages = response.data[0];
    });
  }

}
