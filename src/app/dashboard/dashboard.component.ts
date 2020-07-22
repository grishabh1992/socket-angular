import { Component, OnInit } from '@angular/core';
import { APIService } from '../api.service';
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
    this.api.conversations({ params : {nested :JSON.stringify({members: true} ) }}).subscribe((reponse: any) => {
      this.messages = reponse.data;
    })
  }

  async startNewConversation(conversation: Conversation) {
    this.api.initiateConversation({ body: conversation }).subscribe();
    this.isNewConversation = false;
  }

}
