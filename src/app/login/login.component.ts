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

    this.http.post('http://localhost:3000/login', loginData).subscribe(
      (response: any) => {

        // ถอดรหัส JWT Token
        try {
          if (this.username === 'admin') {
            alert('Welcome Admin!');
            this.router.navigate(['/addroom']); // ไปยังหน้า Admin Dashboard
          } else   {
            console.log('Login successful:', response);
            localStorage.setItem('token', response.token);
            this.router.navigate(['/profile']); // ไปยังหน้าโปรไฟล์
          } 
        } catch (error) {
          console.error('Error decoding token:', error);
          alert('Invalid token. Please login again.');
        }
      },
      (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      }
    );
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']); // Redirect ไปยังหน้าลงทะเบียน
  }
}
