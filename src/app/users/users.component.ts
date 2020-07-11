import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { APIService } from '../api.service';

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
    this.api.listUsers({}).subscribe((data) => {
      this.users = data;
    })
  }

  close() {
    this.action.emit('close');
  }

  selectUser(user) {
    this.select.emit(user);
  }

  navigateToCreateGroup() {
    this.isGroup = true;
  }

  createGroup() {

  }
}
