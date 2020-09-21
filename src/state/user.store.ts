import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { User } from 'src/app/model';
import { Injectable } from '@angular/core';

export interface UserState extends EntityState<User> {}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({
  name: 'user',
  idKey: '_id',
  cache: {
    ttl: 3600000,
  },
  resettable: true,
})
export class UserStore extends EntityStore<UserState, User> {
  constructor() {
    super();
  }
}
