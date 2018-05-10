import { Component, OnInit } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { User } from "../../models/user.interface";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.scss"]
})
export class UsersListComponent implements OnInit {
  users: User[];

  constructor(private userService: UsersService, private router: Router) {}

  ngOnInit() {
    this.userService.getUsersStream$().subscribe(users => {
      this.users = users;
    });
  }

  public editUser(user: User): void {
    this.router.navigate(["user", user.id]);
  }

  public deleteUser(user: User): void {
    this.userService.deleteUser(user).subscribe(users => {});
  }
}
