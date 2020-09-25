import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { SocketService } from '../services/socket.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
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
    private storage: StorageService,
    private socket: SocketService
  ) { }

  ngOnInit() {
  }

  join() {
    if (this.username) {
      this.api.joinApp({ body: { username: this.username } }).pipe(untilDestroyed(this)).subscribe((data: any) => {
        this.storage.setLoggedUser(data.data);
        this.socket.connect();
        this.router.navigate(['/dashboard']);
      });
    }
  }

}
