import { provideRouter, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { MyprofileComponent } from './myprofile/myprofile.component'; 
import { BookingsComponent } from './bookings/bookings.component';
import { EditprofileComponent } from './editprofile/editprofile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile' , component: ProfileComponent} ,
  { path: 'myprofile', component: MyprofileComponent},
  { path:  'booking', component:BookingsComponent},
  { path: 'editprofile' ,component:EditprofileComponent}

];

export const appRouterProviders = [provideRouter(routes)];