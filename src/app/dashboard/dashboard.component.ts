import { Component, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';
import { Conversation } from '../model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  messages = [];
  users = [];
  isNewConversation = false;
  constructor(private api: APIService) { }

  ngOnInit() {
    this.getConversations();
  }

  getConversations() {
    this.api.conversations({ params: { ref : JSON.stringify(['members']) } }).subscribe((reponse: any) => {
      this.messages = reponse.data;
    });

  }

  async startNewConversation(conversation: Conversation) {
    this.api.initiateConversation({ body: conversation }).subscribe();
    this.isNewConversation = false;
    this.getConversations();
  }

}
