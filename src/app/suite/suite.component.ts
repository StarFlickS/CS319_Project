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
  selector: 'app-suite',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './suite.component.html',
  styleUrl: './suite.component.css'
})
export class SuiteComponent implements OnInit {
  room: Room = { id: 0, name: '', type: '', price: 0, status: '' };  // กำหนดค่าเริ่มต้นให้เป็นห้องเปล่า
  booking: any = { name: '', email: '', checkIn: '', checkOut: '' };
  user: any;  

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private roomService: RoomService
  ) { }

  ngOnInit(): void {
    // ดึงประเภทห้องจาก URL
    const token = localStorage.getItem('jwtToken'); // ดึง Token จาก localStorage 
    if (token) {
      // ดึงข้อมูลผู้ใช้จาก API
      this.http
        .get('http://localhost:3000/user-profile', {
          headers: { Authorization: `Bearer ${token}` }, 
        })
        .subscribe(
          (response) => {
            this.user = response; // เก็บข้อมูลผู้ใช้ในตัวแปร
            this.booking.email = this.user.email; 
            console.log('User profile:', this.user.id);
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
      // กรองห้องประเภท Suite เท่านั้น
      this.room = data.find((room: Room) => room.type === 'Suite');// กำหนดประเภทห้อง
    });
  }

  // ฟังก์ชันสำหรับการส่งข้อมูลการจอง
  onSubmit(): void {
    if (this.booking.name && this.booking.email && this.booking.checkIn && this.booking.checkOut) {
      const bookingData = {
        userId: this.user?.id, // ใช้ id ของผู้ใช้จาก user-profile
        roomId: this.room.id,   // id ของห้อง
        bookingName: this.booking.name,
        bookingEmail: this.booking.email,
        checkIn: this.booking.checkIn,
        checkOut: this.booking.checkOut,
      };
  
      console.log("Booking Data:", bookingData);
  
      // ส่งข้อมูลการจองไปยัง API
      this.http.post(
        'http://localhost:3000/bookings',  // URL ของ API สำหรับการจองห้อง
        bookingData  // ข้อมูลการจอง
      ).subscribe(
        (response) => {
          alert('Room booked successfully!');
          console.log('Booking response:', response);
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