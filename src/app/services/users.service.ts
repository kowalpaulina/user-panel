import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.interface';
import { Subject, Observable, Subscription } from 'rxjs';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Injectable()
export class UsersService {
  readonly server_url = 'http://localhost:3000/users/';
  public users: User[];
  public user;
  public userStream$ = new Subject<User>();
  public usersStream$ = new Subject<User[]>();

  constructor(private http: HttpClient) {}

  public getUsers():Subscription {
    return this.http
      .get<User[]>(this.server_url)
      .catch((error: Response) => {
        return Observable.throw(error.json());
      })
      .subscribe(users => {
        this.users = users;
        this.usersStream$.next(this.users);
      });
  }

  public getUserStream(id: string): Observable<User> {
    this.getUser(id);
    return Observable.from(this.userStream$).startWith(this.user);
  }

  public getUsersStream$(): Observable<User[]> {
    this.getUsers();
    return Observable.from(this.usersStream$).startWith(this.users);
  }

  public getUser(id: string): Subscription {
    return this.http.get(`${this.server_url}${id}`).subscribe(user => {
      this.user = user;
      this.userStream$.next(this.user);
    });
  }

  public deleteUser(user:User):Observable<User[]> {
    let request;
    request = this.http.delete(`${this.server_url}${user.id}`);
    return request
      .do(user => {
        this.getUsers();
      })
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

  public saveUser(user:User) {
    let request;
    if (user.id) {
      request = this.http.put(this.server_url + user.id, user);
    } else {
      request = this.http.post(this.server_url, user);
    }
    return request.do(user => {
      this.getUsers();
    });
  }

  public createUser(): User {
    return {
      name: '',
      lastname: '',
      city: '',
      country: '',
      temperature: '',
      humidity: ''
    };
  }

  public getWeather(city):Observable<any> {
    let temperatureApi = `https://query.yahooapis.com/v1/public/yql?q=select item from weather.forecast where woeid in (select woeid from geo.places(1) where text='${city}')and u='c'&format=json`;
    let humidityApi = `https://query.yahooapis.com/v1/public/yql?q=select atmosphere from weather.forecast where woeid in (select woeid from geo.places(1) where text='${city}')and u='c'&format=json`;
    let temperature = this.http.get(temperatureApi);
    let humidity = this.http.get(humidityApi);

    return forkJoin([temperature, humidity]);
  }
}
