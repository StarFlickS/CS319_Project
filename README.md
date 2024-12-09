
# ระบบจองห้องพัก BU Hotel

เว็บแอปพลิเคชันสำหรับการจองห้องพักโรงแรมที่พัฒนาด้วย Angular, Node.js, Express.js และ MySQL

---

## ข้อกำหนดเบื้องต้น

ก่อนใช้งานเว็บไซต์นี้ กรุณาตรวจสอบว่าคุณได้ติดตั้งโปรแกรมต่อไปนี้บนเครื่องของคุณ:

1. **MySQL Server**: [ดาวน์โหลด MySQL Server](https://dev.mysql.com/downloads/mysql/)
2. **MySQL Workbench**: [ดาวน์โหลด MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
3. **Node.js**: [ดาวน์โหลด Node.js](https://nodejs.org/)

---

## การตั้งค่าฐานข้อมูล

โปรเจกต์นี้ใช้ฐานข้อมูล **MySQL** ก่อนเริ่มใช้งาน:

1. อัปเดตข้อมูลการเชื่อมต่อ **localhost** ในไฟล์:
   ```plaintext
   backend/db.js
   ```
   แทนที่ค่าตัวอย่างด้วยชื่อผู้ใช้และรหัสผ่าน MySQL ของคุณเอง

2. สร้างฐานข้อมูลสำหรับโปรเจกต์โดยใช้ MySQL Workbench หรือ Command Line:
   ```sql
   CREATE DATABASE bu_hotel;
   ```

---

## วิธีการรันแอปพลิเคชัน

### ขั้นตอนที่ 1: เริ่มเซิร์ฟเวอร์ฝั่ง Backend
1. ไปที่โฟลเดอร์ `backend`:
   ```bash
   cd backend
   ```
2. ติดตั้ง dependencies:
   ```bash
   npm install
   ```
3. เริ่มเซิร์ฟเวอร์:
   ```bash
   node server.js
   ```
   เซิร์ฟเวอร์จะเริ่มต้นฐานข้อมูลและเปิดให้บริการบน localhost

---

### ขั้นตอนที่ 2: เริ่มเซิร์ฟเวอร์ฝั่ง Frontend
1. ไปที่โฟลเดอร์ `frontend`:
   ```bash
   cd frontend
   ```
2. ติดตั้ง dependencies:
   ```bash
   npm install
   ```
3. เริ่มเซิร์ฟเวอร์ฝั่ง frontend:
   ```bash
   ng serve
   ```
4. เปิดเบราว์เซอร์และเข้าสู่:
   ```
   http://localhost:4200
   ```

---

## คุณสมบัติ

- **ระบบจองที่ใช้งานง่าย**: มอบประสบการณ์ที่สะดวกสำหรับผู้ใช้
- **การเชื่อมต่อ API ฝั่ง Backend**: ใช้ RESTful APIs สำหรับการทำ CRUD
- **การจัดการฐานข้อมูล**: รองรับข้อมูลที่สอดคล้องกันสำหรับผู้ใช้งาน ห้องพัก และการจอง
- **การออกแบบที่ตอบสนอง (Responsive Design)**: รองรับการใช้งานทั้งเดสก์ท็อปและอุปกรณ์มือถือ

---

## เทคโนโลยีที่ใช้

- **Frontend**: Angular
- **Backend**: Node.js, Express.js
- **ฐานข้อมูล**: MySQL

---

## ภาพหน้าจอ

เพิ่มภาพหน้าจอเพื่อแสดงการทำงานของอินเทอร์เฟซที่นี่

---

## ติดต่อ

หากมีคำถามเกี่ยวกับโปรเจกต์นี้ กรุณาติดต่อ:

- **อีเมล**: your-email@example.com
- **GitHub**: [your-github-profile](https://github.com/your-github-profile)
