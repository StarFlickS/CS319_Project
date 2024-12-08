import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Makes the service globally available
})
export class RoomService {
  private apiUrl = 'http://localhost:3000/rooms';  // Replace with your API URL  
    

  constructor(private http: HttpClient) {}

  getRooms(): Observable<any> {
    return this.http.get(this.apiUrl); // Fetch data from the API
  } 

 getRoomById(roomId: number): Observable<any> {
  return this.http.delete(`http://localhost:3000/rooms/delete/${roomId}`);
}

updateRoom(roomData: any): Observable<any> {
  const roomId = roomData.id;  
  return this.http.put<any>(`http://localhost:3000/editrooms/${roomId}`, roomData);  // ส่งข้อมูลอัปเดตไปที่ /editrooms/:id
}

  addRoom(room: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, room);
  }

  deleteRoom(roomId: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/rooms/delete/${roomId}`);
  }

  getRoomByType(type: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/type/${type}`);  // ดึงข้อมูลจาก API ตามประเภทห้อง
  }

  bookRoom(roomId: number, bookingData: any): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/bookroom/${roomId}`, bookingData);
  }
}

