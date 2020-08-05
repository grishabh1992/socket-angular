import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class StorageService {

  constructor() {
  }

  clearAll () {
    localStorage.clear();
  }

  setLoggedUser(info) {
    localStorage.setItem('loggedIn', JSON.stringify(info));
  }

  getLoggedUser() {
    return JSON.parse(localStorage.getItem('loggedIn') || '{}');
  }

}
