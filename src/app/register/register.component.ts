import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister(): void {
    this.http
      .post('http://localhost:3000/register', {
        username: this.username,
        email: this.email,
        password: this.password,
      })
      .subscribe(
        (response: any) => {
          console.log('Registration successful:', response);
          alert('Account created successfully!');
          this.router.navigate(['/login']); // Redirect to login page
        },
        (error) => {
          console.error('Registration failed:', error);
          alert('Registration failed. Please try again.');
        }
      );
  }
}
