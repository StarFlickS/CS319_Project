import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../room.service';
import { HttpClient } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editrooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editrooms.component.html',
  styleUrls: ['./editrooms.component.css']
})
export class EditroomsComponent implements OnInit {
  room: any = { name: '', type: '', price: 0, status: '' };
  roomId: string = '';
  rooms: any[] = [];

  constructor(private roomService: RoomService, private router: Router ,private route : ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    // ดึง roomId จาก URL
    this.roomId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Room ID:', this.roomId);
  
    // ดึงข้อมูลห้องทั้งหมดจาก API
    this.roomService.getRooms().subscribe((data) => {
      this.rooms = data;  // เก็บข้อมูลห้องทั้งหมดในตัวแปร rooms
  
      // ค้นหาห้องที่ตรงกับ roomId
      const roomData = this.rooms.find(room => room.id === parseInt(this.roomId, 10));  // แปลงเป็นเลขฐาน 10 
  
      if (roomData) {
        this.room = roomData;  // ถ้าพบข้อมูลห้องที่ตรงกับ roomId ให้เก็บข้อมูลใน this.room
        //console.log('Room Data Found:', this.room);  // แสดงข้อมูลห้องที่พบ
      } else {
        console.error('Room not found for ID:', this.roomId);  // หากไม่พบห้องที่ตรงกับ roomId
        alert('Room not found!');
      }
    });
  }

  onSubmit(): void {
    if (this.room.name && this.room.type && this.room.price && this.room.status) {
      this.roomService.updateRoom(this.room).subscribe(
        (response) => {
          alert('Room updated successfully!');
          this.router.navigate(['/addroom']); // กลับไปหน้า room list
        },
        (error) => {
          console.error('Error updating room:', error);
          alert('Failed to update room!');
        }
      );
    } else {
      alert('Please fill in all the fields');
    }
    console.log(this.room)
  }
  
}
