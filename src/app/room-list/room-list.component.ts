import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Import this
import { RoomService } from '../room.service';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [HttpClientModule], // Add HttpClientModule here
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent implements OnInit {
  rooms: any[] = [];
  error: string = '';

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.roomService.getRooms().subscribe(
      (data) => {
        this.rooms = data;
        console.log('Rooms:', this.rooms);
      },
      (error) => {
        console.error('Error fetching rooms:', error);
        this.error = 'Failed to load room data.';
      }
    );
  }
}
