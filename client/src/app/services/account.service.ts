import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { ServiceConstants } from './service-constants';
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService extends BaseHttpService {
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(http: HttpClient) {
    super(http, 'account');
    this.loadUser();
  }

  loadUser(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user: User = JSON.parse(userStr) as User;
      this.currentUserSource.next(user);
    } else this.currentUserSource.next(null);
  }

  reLoadUser(): void {
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (!!user)
        this.http.get<User>(`${this.rootUrl}GetCurrentUser`).subscribe({
          next: (user) => {
            this.setCurrentUser(user);
          },
          error: (_) => {
            localStorage.removeItem('user');
            this.currentUserSource.next(null);
          },
        });
    });   
  }

  login(model: any) {
    return this.http
      .post<User>(`${this.baseUrl}${ServiceConstants.Account.Login}`, model)
      .pipe(
        map((response: User) => {
          const user = response;
          if (user) {
            this.setCurrentUser(user);
          }
        })
      );
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  register(model: any) {
    return this.http
      .post<User>(`${this.baseUrl}${ServiceConstants.Account.Register}`, model)
      .pipe(
        map((user) => {
          if (user) {
            this.setCurrentUser(user);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  takeCurrentUser() {
    return this.currentUser$.pipe(take(1));
  }
}
