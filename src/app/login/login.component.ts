import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin(): void {
    const loginData = { username: this.username, password: this.password };
    this.http.post('http://localhost:3000/login', loginData).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
  
        // Store the token in localStorage
        localStorage.setItem('jwtToken', response.token);
  
        // Redirect based on role
        if (response.role === 'admin') {
          alert('Welcome Admin!');
          this.router.navigate(['/addroom']); // เส้นทางสำหรับ admin
        } else {
          this.router.navigate(['/homeuser']); // เส้นทางสำหรับ user
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']); // Redirect to the register page
  }
}