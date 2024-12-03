import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Makes the service globally available
})
export class RoomService {
  private apiUrl = 'http://localhost:3000/rooms'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  getRooms(): Observable<any> {
    return this.http.get(this.apiUrl); // Fetch data from the API
  }
}
