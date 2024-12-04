import { Component, OnInit } from '@angular/core';
import { MyprofileComponent } from '../myprofile/myprofile.component';
import { BookingsComponent } from '../bookings/bookings.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MyprofileComponent, BookingsComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent  {

}
