import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { RoomService } from '../room.service'; 
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// กำหนด interface สำหรับห้อง
interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  status: string;
}

@Component({
  selector: 'app-deluxe',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './deluxe.component.html',
  styleUrls: ['./deluxe.component.css']
})
export class DeluxeComponent implements OnInit {
  room: Room = { id: 0, name: '', type: '', price: 0, status: '' };  // กำหนดค่าเริ่มต้นให้เป็นห้องเปล่า
  booking: any = { name: '', email: '', checkIn: '', checkOut: '' };
  user: any;  

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private roomService: RoomService
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token'); // ดึง Token จาก localStorage 
    if (token) {
      // ดึงข้อมูลผู้ใช้จาก API
      this.http
        .get('http://localhost:3000/user-profile', {
          headers: { Authorization: `Bearer ${token}` }, 
        })
        .subscribe(
          (response) => {
            this.user = response; // เก็บข้อมูลผู้ใช้ในตัวแปร
            console.log('User profile:', this.user);
          },
          (error) => {
            console.error('Error fetching user profile:', error);
            
          }
        );
    } else {
      console.log('No token found. Redirecting to login.');
      // ถ้าไม่มี Token ให้ redirect ไปหน้า login
    }

    // เรียกข้อมูลห้องทั้งหมดจาก API
    this.roomService.getRooms().subscribe((data) => {
      // กรองห้องประเภท Deluxe เท่านั้น
      this.room = data.find((room: Room) => room.type === 'Deluxe');  // กำหนดประเภทห้อง
    });
  }

  // ฟังก์ชันสำหรับการส่งข้อมูลการจอง
  onSubmit(): void {
    if (this.booking.name && this.booking.email && this.booking.checkIn && this.booking.checkOut) {
      // ส่งข้อมูลการจองห้องไปที่ API
      this.roomService.bookRoom(this.room.id, this.booking).subscribe(
        (response) => {
          alert('Room booked successfully!');
        },
        (error) => {
          console.error('Error booking room:', error);
          alert('Failed to book room.');
        }
      );
    } else {
      alert('Please fill in all the fields.');
    }
  }
}
