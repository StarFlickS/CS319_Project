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

  // ดึงข้อมูลห้องโดยใช้ ID
 // ฟังก์ชันสำหรับดึงข้อมูลห้องตาม ID
 getRoomById(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`);
}

updateRoom(roomData: any): Observable<any> {
  return this.http.put<any>(this.apiUrl, roomData);  // ส่งข้อมูลอัปเดตทั้งหมด
}



  addRoom(room: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, room);
  }

  deleteRoom(roomId: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/rooms/delete/${roomId}`);
  }
}

