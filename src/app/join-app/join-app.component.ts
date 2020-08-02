import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { StorageService } from '../services/storage.service';

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
    private storage : StorageService,
  ) { }

  ngOnInit() {
  }

  join() {
    if (this.username) {
      this.api.joinApp({ body: { username: this.username } }).subscribe((data : any) => {
        console.log(data);
        this.storage.setLoggedUser(data.data);
        this.router.navigate(['/dashboard']);
      });
    }
  }

}
