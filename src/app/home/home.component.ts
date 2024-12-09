import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../room.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  rooms: any[] = []; // All rooms fetched from the backend
  limitedRooms: any[] = []; // Rooms limited to 3 per type

  constructor(private roomService: RoomService, private router: Router) {}

  ngOnInit(): void {
    this.roomService.getRooms().subscribe((data) => {
      this.rooms = data; // Assign all rooms to the rooms array
      this.limitedRooms = this.rooms; // Show all rooms without limitation
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']); // Navigate to Login
  }

  getRoomImage(type: string): string {
    switch (type) {
      case 'Deluxe':
        return 'assets/img/deluxe.jpg';
      case 'Suite':
        return 'assets/img/suite.jpg';
      default :
        return 'assets/img/single.jpg';
    }
  }
}