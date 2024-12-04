import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css'],
})
export class EditprofileComponent {
  user: any = {}; // Initialize user object
  newemail: string = '';
  newpassword: string = ''; 
  userId: number = 0 ;  

  constructor(private http: HttpClient, private router: Router) {}
  
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
            console.log('User profile:', this.user.id);
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

  updateProfile(): void {
    const loginData = { newemail: this.newemail, newpassword: this.newpassword,userId: this.user.id };
    const token = localStorage.getItem('token');
    if (!token) {
        alert('คุณต้องเข้าสู่ระบบเพื่ออัปเดตโปรไฟล์ของคุณ');
        this.router.navigate(['/login']);
        return;
    }
    
    // ตรวจสอบค่าที่กรอกในฟอร์ม
    if (!this.newemail.trim() || !this.newpassword.trim()) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }
     // ตรวจสอบข้อมูลก่อนส่ง
    console.log('Sending data:', { newemail: this.newemail, newpassword: this.newpassword,userId: this.user.id});
    this.http
    .post(
        'http://localhost:3000/user-update',
        { newemail: this.newemail, newpassword: this.newpassword },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    )
    .subscribe(
        (response) => {
            console.log('อัปเดตโปรไฟล์สำเร็จ:', response);
            alert('อัปเดตโปรไฟล์สำเร็จ!');
            this.router.navigate(['/profile']);
        },
        (error) => {
            console.error('เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์:', error);
            alert('เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์ กรุณาลองใหม่อีกครั้ง');
        }
    );
    
  }
}
