import { provideRouter, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { MyprofileComponent } from './myprofile/myprofile.component'; 
import { BookingsComponent } from './bookings/bookings.component';
import { AddroomComponent } from './addroom/addroom.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { EditroomsComponent } from './editrooms/editrooms.component';  
import { HomeUserComponent } from './home-user/home-user.component';
import { SingleComponent } from './single/single.component';
import { DeluxeComponent } from './deluxe/deluxe.component';
import { SuiteComponent } from './suite/suite.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile' , component: ProfileComponent} ,
  { path: 'myprofile', component: MyprofileComponent},
  { path:  'booking', component:BookingsComponent},
  { path: 'addroom',component:AddroomComponent},
  { path: 'editprofile',component:EditprofileComponent},
  { path: 'editrooms/:id',component:EditroomsComponent}, 
  {path: 'homeuser',component:HomeUserComponent},
  {path: 'rooms/single', component:SingleComponent},
  {path: "rooms/deluxe",component:DeluxeComponent},
  {path: "rooms/suite",component:SuiteComponent},

];

export const appRouterProviders = [provideRouter(routes)];