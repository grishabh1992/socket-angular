import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  messages = [];
  users = [];
  isNewConversation = false;
  constructor() { }

  ngOnInit() {
    this.messages = [
      {
        username : 'Jon',
        subject: 'hihihi'

      }, {
        username : 'Rahul',
        subject : 'Hay whats up?'
      },
      {
        username : 'Jon',
        subject: 'hihihi'

      }, {
        username : 'Rahul',
        subject : 'Hay whats up?'
      },
      {
        username : 'Jon',
        subject: 'hihihi'

      }, {
        username : 'Rahul',
        subject : 'Hay whats up?'
      },
      {
        username : 'Jon',
        subject: 'hihihi'

      }, {
        username : 'Rahul',
        subject : 'Hay whats up?'
      },
      {
        username : 'Jon',
        subject: 'hihihi'

      }, {
        username : 'Rahul',
        subject : 'Hay whats up?'
      },
      {
        username : 'Jon',
        subject: 'hihihi'

      }, {
        username : 'Rahul',
        subject : 'Hay whats up?'
      }
    ];
    this.users = [
      {
        username : 'Jon',
        subject: 'hihihi'

      }, {
        username : 'Rahul',
        subject : 'Hay whats up?'
      }
    ]
  }

  startNewConversation(user){
    console.log(user);
    this.isNewConversation = false;
  }



}
