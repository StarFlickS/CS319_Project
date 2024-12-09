
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
   ```js
   const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'bu_hotel' 
   });
   ```

   รวมถึง
   ```js
   const tempConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'your_password'
   });
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
1. ไปที่โฟลเดอร์หลัก (root):
   ```bash
   cd ..
   ```
2. เริ่มเซิร์ฟเวอร์ฝั่ง frontend:
   ```bash
   ng serve
   ```
3. เปิดเบราว์เซอร์และเข้าสู่:
   ```
   http://localhost:4200
   ```

---