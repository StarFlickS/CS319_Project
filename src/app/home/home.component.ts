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
      this.rooms = data;

      // Limit to 3 rooms per type
      const roomTypes = Array.from(new Set(this.rooms.map((room) => room.type))); // Get unique room types
      this.limitedRooms = roomTypes.flatMap((type) =>
        this.rooms.filter((room) => room.type === type).slice(0, 3) // Limit each type to 3 rooms
      );
    });
  }

  navigateToHome(): void {
    this.router.navigate(['/']); // Navigate to Home
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']); // Navigate to Login
  }

  getRoomImage(type: string): string {
    switch (type) {
      case 'Deluxe':
        return 'src/assets/img/deluxe.jpg';
      case 'Suite':
        return 'src/assets/img/single.jpg';
      default :
        return 'img/suite.jpg';
    }
  }
  
}