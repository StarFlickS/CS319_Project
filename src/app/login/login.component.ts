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
    this.http
      .post('http://localhost:3000/login', {
        username: this.username,
        password: this.password,
      })
      .subscribe(
        (response: any) => {
          console.log('Login successful:', response);
          localStorage.setItem('token', response.token); // Save the JWT token
          this.router.navigate(['/']); // Redirect to the home page
        },
        (error) => {
          console.error('Login failed:', error);
          alert('Invalid username or password');
        }
      );
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']); // Redirect to the register page
  }
}
