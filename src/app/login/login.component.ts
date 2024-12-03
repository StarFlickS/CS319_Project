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
        console.log('Login successful:', response);
        alert('Login successful!');
      },
      (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      }
    }

  navigateToRegister(): void {
    this.router.navigate(['/register']); // Redirect to the register page
  }
}
