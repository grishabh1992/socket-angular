import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from '../api.service';

@Component({
  selector: 'app-join-app',
  templateUrl: './join-app.component.html',
  styleUrls: ['./join-app.component.scss']
})
export class JoinAppComponent implements OnInit {
  username: string;
  constructor(
    private router: Router,
    private api: APIService,
  ) { }

  ngOnInit() {
  }

  join() {
    if (this.username) {
      this.api.joinApp({ body: { username: this.username } }).subscribe((data) => {
        this.router.navigate(['/dashboard']);
      });
    }
  }

}
