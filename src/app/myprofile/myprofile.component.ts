import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myprofile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent implements OnInit {
  user: any; // เก็บข้อมูลผู้ใช้
  bookings: any[] = []; // เก็บประวัติการจอง

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('jwtToken'); // ดึง Token จาก localStorage

    if (token) {
      // ดึงข้อมูลโปรไฟล์ผู้ใช้
      this.http
        .get('http://localhost:3000/user-profile', {
          headers: { Authorization: `Bearer ${token}` }, // เพิ่ม Token ใน Header
        })
        .subscribe({
          next: (response: any) => {
            console.log('User profile:', response);
            this.user = response; // เก็บข้อมูลผู้ใช้
            this.fetchBookings(this.user.id); // ดึงข้อมูลประวัติการจอง
          },
          error: (error) => {
            console.error('Error fetching user profile:', error);
          },
        });
    } else {
      console.log('No token found. Redirecting to login.');
      this.router.navigate(['/login']); // Redirect ไปยังหน้า Login
    }
  }

  fetchBookings(userId: number): void {
    // ดึงข้อมูลประวัติการจองของผู้ใช้จาก API
    this.http
      .get(`http://localhost:3000/bookings/${userId}`)
      .subscribe({
        next: (response: any) => {
          console.log('User bookings:', response);
          this.bookings = response; // เก็บข้อมูลการจอง
        },
        error: (error) => {
          console.error('Error fetching bookings:', error);
        },
      });
  }

  navigateToEditprofile(): void {
    this.router.navigate(['/editprofile']); // Redirect ไปยังหน้า Edit Profile
  }
}