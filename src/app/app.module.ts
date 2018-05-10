import { UsersService } from './services/users.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UsersListComponent } from './users-panel/users-list/users-list.component';
import { UserDetailsComponent } from './users-panel/user-details/user-details.component';
import { UsersPanelComponent } from './users-panel/users-panel.component';


@NgModule({
  declarations: [
    AppComponent,
    UsersListComponent,
    UserDetailsComponent,
    UsersPanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
      RouterModule.forRoot([
        {
          path: '',
          component: UsersPanelComponent,
          children: [
            { path: 'new', component: UserDetailsComponent },
            { path: 'user/:id', component: UserDetailsComponent }
          ]
        },
        {
          path: '**',
          redirectTo: '/',
          pathMatch: 'full'
        }
    
  ])
  ],
  providers: [UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
