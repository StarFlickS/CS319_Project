import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../room.service'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editrooms',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './editrooms.component.html',
  styleUrl: './editrooms.component.css'
})
export class EditroomsComponent  implements OnInit {
  rooms: any[] = [];
  room: any = { name: '', type: '', price: 0, status: '' };  // ตัวแปรสำหรับเก็บข้อมูลห้อง
  roomId: string = '';  // ตัวแปรสำหรับเก็บห้องที่กำลังแก้ไข
  isEditMode: boolean = false; 

  constructor(private roomService: RoomService, private router: Router ,private route : ActivatedRoute) {}

  ngOnInit(): void {
    // รับ roomId จาก URL
    this.roomId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Room ID:', this.roomId); 

    

    // ดึงข้อมูลห้องตาม roomId
    this.roomService.getRoomById(this.roomId).subscribe(
      (data) => {
        this.room = data; // เก็บข้อมูลของห้อง
        console.log('Room Data:', this.room);
        console.log('Room Name:', this.room.name); // Print ชื่อห้อง
      },
      (error) => {
        console.error('Error fetching room data:', error);
      }

      
    );

  }  
  onSubmit(): void {
    // ตรวจสอบว่ามีข้อมูลห้องครบถ้วน
    if (this.room.name && this.room.type && this.room.price && this.room.status) {
      // ส่งข้อมูลห้องทั้งหมดไปอัปเดต
      this.roomService.updateRoom(this.room).subscribe(
        (response) => {
          alert('Room updated successfully!');
          this.router.navigate(['/addroom']); // กลับไปหน้า room list
        },
        (error) => {
          console.error('Error updating room:', error);
        }
      );
    } else {
      alert('Please fill in all the fields.');
    }
  }
  
  
  

}
