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
  user: any;  // ตัวแปรสำหรับเก็บข้อมูลผู้ใช้
  constructor(private http: HttpClient,private router: Router) {}
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
            console.log('User profile:', this.user);
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

  }
  navigateToEditprofile(): void {
    this.router.navigate(['/editprofile']); // Redirect to the register page
  }
  
}
