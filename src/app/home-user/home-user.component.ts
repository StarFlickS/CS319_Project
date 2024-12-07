import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../room.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.css'
})
export class HomeUserComponent implements OnInit { 
  rooms: any[] = []; // All rooms fetched from the backend
  limitedRooms: any[] = []; // Rooms limited to 3 per type
  user: any;  // ตัวแปรสำหรับเก็บข้อมูลผู้ใช้

  constructor(private http: HttpClient, 
    private router: Router,
    private roomService: RoomService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token'); // ดึง Token จาก localStorage 
    if (token) {
      // ดึงข้อมูลผู้ใช้จาก API
      this.http
        .get('http://localhost:3000/user-profile', {
          headers: { Authorization: `Bearer ${token}` }, // ใส่ Token ใน Header
        })
        .subscribe(
          (response) => {
            this.user = response; // เก็บข้อมูลผู้ใช้ในตัวแปร
            //console.log('User profile:', this.user);
          },
          (error) => {
            console.error('Error fetching user profile:', error);
            // หากเกิดข้อผิดพลาด เช่น Token หมดอายุ
          }
        );
    } else {
      console.log('No token found. Redirecting to login.');
      // ถ้าไม่มี Token ให้ redirect ไปหน้า login
    }

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
    this.router.navigate(['/homeuser']); // Navigate to Home
  }
  
  navigateToMyprofile () : void { 
    this.router.navigate(['/myprofile'])
  }

  getRoomImage(type: string): string {
    switch (type) {
      case 'Deluxe':
        return 'img/deluxe.jpg';
      case 'Suite':
        return 'img/single.jpg';
      default :
        return 'img/suite.jpg';
    }
  }


}
