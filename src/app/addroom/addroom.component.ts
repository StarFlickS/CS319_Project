import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../room.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-addroom',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './addroom.component.html',
  styleUrl: './addroom.component.css'
})
export class AddroomComponent implements OnInit {
  rooms: any[] = [];
  room: any = { name: '', type: '', price: 0, status: '' };  // ตัวแปรสำหรับเก็บข้อมูลห้อง
  roomId: string = '';  // ตัวแปรสำหรับเก็บห้องที่กำลังแก้ไข
  isEditMode: boolean = false; 

  constructor(private roomService: RoomService, private router: Router ,private route : ActivatedRoute) {}

  ngOnInit(): void {
    // ดึง ID ของห้องที่ต้องการแก้ไขจาก URL
    this.roomId = this.route.snapshot.paramMap.get('id') || '';
    this.roomService.getRooms().subscribe((data) => {
      this.rooms = data;

    });
  } 

  onSubmit(): void {
    if (this.room.name && this.room.type && this.room.price && this.room.status) {
      this.roomService.addRoom(this.room).subscribe(
        (response) => {
          console.log('Room added successfully:', response);
          alert('Room added successfully!');
        },
        (error) => {
          console.error('Error adding room:', error);
          alert('Failed to add room!');
        }
      );
    } else {
      alert('Please fill in all the fields');
    } 
    console.log('room :', this.room);
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe((data) => {
      this.rooms = data;
    });
  }
  
  deleteRoom(roomId: number): void {
    if (confirm('Are you sure you want to delete this room?')) {
      console.log('Attempting to delete room with ID:', roomId); // ตรวจสอบว่า roomId ถูกต้อง
      this.roomService.deleteRoom(roomId).subscribe(() => {
        this.loadRooms();
        alert('Room deleted successfully!');
      }, (error) => {
        console.error('Error deleting room:', error);
        alert('Failed to delete room!');
      });
    } else {
      console.log('Room deletion canceled');
    }
  }

  editRoom(roomId: number): void {
    this.router.navigate([`/editrooms/${roomId}`]); // นำทางไปหน้า editrooms พร้อมส่ง ID
  }
}
