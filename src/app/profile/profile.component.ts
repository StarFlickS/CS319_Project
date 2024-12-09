import { Component, OnInit } from '@angular/core';
import { MyprofileComponent } from '../myprofile/myprofile.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MyprofileComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent  {

}