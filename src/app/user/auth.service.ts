import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {User} from './user.model';
import {environment} from '../../environments/environment';

import {AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession} from 'amazon-cognito-identity-js';

const POOL_DATA = environment.poolData;
const USER_POOL = new CognitoUserPool(POOL_DATA);


@Injectable()
export class AuthService {
  authIsLoading = new BehaviorSubject<boolean>(false);
  authDidFail = new BehaviorSubject<boolean>(false);
  authStatusChanged = new Subject<boolean>();
  registeredUser: CognitoUser;

  constructor(private router: Router) {
  }

  signUp(username: string, email: string, password: string): void {
    this.authIsLoading.next(true);
    const user: User = {
      username: username,
      email: email,
      password: password
    };
    const attrList: CognitoUserAttribute[] = [];
    const emailAttribute = {
      Name: 'email',
      Value: user.email
    };

    attrList.push(new CognitoUserAttribute(emailAttribute));
    USER_POOL.signUp(user.username, user.password, attrList, null, (err, result) => {
      if (err) {
        this.authDidFail.next(true);
        this.authIsLoading.next(false);
        return;
      }
      this.authDidFail.next(false);
      this.authIsLoading.next(false);
      this.registeredUser = result.user;
      // console.log('user name is ' + result.user);
    });
    return;
  }

  confirmUser(username: string, code: string) {
    this.authIsLoading.next(true);
    const userData = {
      Username: username,
      Pool: USER_POOL
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        this.authDidFail.next(true);
        this.authIsLoading.next(false);
        return;
      }
      this.authDidFail.next(false);
      this.authIsLoading.next(false);
      this.router.navigate(['/']);
    });

  }

  signIn(username: string, password: string): void {
    this.authIsLoading.next(true);
    const authData = {
      Username: username,
      Password: password
    };

    const AuthDetails = new AuthenticationDetails(authData);
    const userData = {
      Username: username,
      Pool: USER_POOL
    };

    const cognitoUser = new CognitoUser(userData);

    const that = this;
    cognitoUser.authenticateUser(AuthDetails, {
      onSuccess(result: CognitoUserSession) {
        that.authStatusChanged.next(true);
        that.authIsLoading.next(false);
        that.authDidFail.next(false);
        console.log(result);
      },
      onFailure() {
        that.authDidFail.next(true);
        that.authIsLoading.next(false);
      }
    });
    this.authStatusChanged.next(true);
    return;
  }

  getAuthenticatedUser() {
    return USER_POOL.getCurrentUser();
  }

  logout() {
    this.getAuthenticatedUser().signOut();
    this.authStatusChanged.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    const user = this.getAuthenticatedUser();
    const obs = Observable.create((observer) => {
      if (!user) {
        observer.next(false);
      } else {
        user.getSession((err, session) => {
          if (err) {
            observer.next(false);
          } else if (session.isValid()) {
            observer.next(true);
          } else {
            observer.next(false);
          }
        });
      }
      observer.complete();
    });
    return obs;
  }

  initAuth() {
    this.isAuthenticated().subscribe(
      (auth) => this.authStatusChanged.next(auth)
    );
  }
}
