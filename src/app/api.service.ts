import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
export interface Request {
  body?: any,
  parms?: any
}
const API = 'http://localhost:3000/';

@Injectable({ providedIn: 'root' })
export class APIService {

  constructor(
    private http: HttpClient
  ) {
  }

  joinApp(request: Request) {
    return this.http.put(`${API}user`, request.body);
  }

  listUsers(request: Request) {
    return this.http.get(`${API}user`, request.body);
  }

  initiateConversation(request: Request) {
    return this.http.post(`${API}user`, request.body);
  }
}
