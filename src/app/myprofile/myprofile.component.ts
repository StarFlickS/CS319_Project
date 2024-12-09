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
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from localStorage
  
    if (token) {
      // Make the HTTP request with the token in the Authorization header)
      this.http
        .get('http://localhost:3000/user-profile', {
          headers: { Authorization: `Bearer ${token}` }, // Include the token
        })
        .subscribe({
          next: (response) => {
            console.log('User profile:', response);
            this.user = response; // Store the user data
          },
          error: (error) => {
            console.error('Error fetching user profile:', error);
          },
        });
    } else {
      console.log('No token found. Redirecting to login.');
      this.router.navigate(['/login']); // Redirect to the login page
    }
  }
  
  navigateToEditprofile(): void {
    this.router.navigate(['/editprofile']); // Redirect to the register page
  }
  
}