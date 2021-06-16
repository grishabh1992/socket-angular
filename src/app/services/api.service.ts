import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
export interface Request {
  body?: any,
  params?: any
}


@Injectable({ providedIn: 'root' })
export class APIService {

  constructor(
    private http: HttpClient
  ) {
  }

  joinApp(request: Request) {
    return this.http.put(`${environment.API}user`, request.body);
  }

  listUsers(request: Request) {
    return this.http.get(`${environment.API}user`, request.body);
  }

  initiateConversation(request: Request) {
    return this.http.post(`${environment.API}conversation`, request.body);
  }

  conversations(request: Request ) {
    return this.http.get(`${environment.API}conversation`, request);
  }

  messages(request: Request ) {
    return this.http.get(`${environment.API}message/${request.params._id}`, request);
  }
}
