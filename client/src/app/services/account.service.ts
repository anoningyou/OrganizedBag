import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { ServiceConstants } from './service-constants';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {
    this.loadUser();

   }

  loadUser(): void {
    const userStr = localStorage.getItem('user');
    console.log(userStr);
    if (userStr) {
      const user: User = JSON.parse(userStr) as User;
      this.currentUserSource.next(user);
    }
  }

  login(model: any){
    return this.http.post<User>(`${this.baseUrl}${ServiceConstants.Account.Login}`,model).pipe(
      map((response: User) => {
        const user = response;
        if(user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  setCurrentUser(user: User){
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ?user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  register(model:any){
    return this.http.post<User>(`${this.baseUrl}${ServiceConstants.Account.Register}`,model).pipe(
      map(user => {
        console.log(user);
        if(user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  getDecodedToken(token: string){
    return JSON.parse(atob(token.split('.')[1]));
  }
}
