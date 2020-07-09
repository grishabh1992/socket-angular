import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @Input() users;
  @Output() select = new EventEmitter();
  @Output() action = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  close() {
    this.action.emit('close');
  }

  selectUser(user) {
    this.select.emit(user);
  }
}
