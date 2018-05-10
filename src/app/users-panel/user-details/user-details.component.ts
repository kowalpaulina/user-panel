import { UsersService } from "./../../services/users.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../../models/user.interface";

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.scss"]
})
export class UserDetailsComponent implements OnInit {
  user: User;
  weather: any;
  temperature: string;
  humidity: string;
  temperatureResult;
  humidityResult;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.getUserDetails();
  }

  public getUserDetails(): void {
    this.activeRoute.params.subscribe(params => {
      let id = params["id"];
      if (id) {
        this.usersService.getUserStream(id).subscribe(user => {
          if (user) {
            this.user = user;
            this.getWeather(user.city);
          }
        });
      } else {
        this.user = this.usersService.createUser();
      }
    });
  }

  public getWeather(city) {
    this.usersService.getWeather(city).subscribe(weather => {
      this.temperatureResult = weather[0];
      this.humidityResult = weather[1];
      this.user.temperature = this.temperatureResult.query.results.channel.item.condition.temp;
      this.user.humidity = this.humidityResult.query.results.channel.atmosphere.humidity;
    });
  }

  public deleteUser(user: User): void {
    this.usersService.deleteUser(this.user).subscribe(users => {
      this.router.navigate([""]);
    });
  }

  public saveUser(valid, user): void {
    if (!valid) {
      return;
    }
    this.usersService.saveUser(this.user).subscribe(user => {
      this.getWeather(user.city);
      this.router.navigate(["user", user.id]);
    });
  }
}
