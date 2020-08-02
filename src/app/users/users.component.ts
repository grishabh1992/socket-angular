import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { APIService } from '../services/api.service';
import { Conversation, User } from '../model';
import { MatListOption } from '@angular/material/list';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @Output() select = new EventEmitter();
  @Output() action = new EventEmitter();
  users: any;
  isGroup: boolean;
  groupName: string;
  constructor(
    private api: APIService
  ) { }

  ngOnInit() {
    this.api.listUsers({}).subscribe((userPayload: any) => {
      this.users = userPayload.data;
    })
  }

  close() {
    this.action.emit('close');
  }

  selectUser(user: User) {
    const conversation: Conversation = {
      members: [user._id]
    }
    this.select.emit(conversation);
  }

  navigateToCreateGroup() {
    this.isGroup = true;
  }

  createGroup(selectedUser: MatListOption[]) {
    const conversation: Conversation = {
      groupName: this.groupName,
      isGroup : true,
      members: selectedUser.map((user) => user.value._id)
    }
    this.select.emit(conversation);
    this.groupName = '';
  }
}
