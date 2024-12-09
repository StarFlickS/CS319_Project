1.หากผู้ใช้ไม่ได้ติดตั้ง mySQL ในเครื่อง ให้ทำการดาวน์โหลดก่อนใช้งานเว็บไซต์
    2.1 mySQL https://dev.mysql.com/downloads/mysql/
    2.2 mySQL Workbench https://dev.mysql.com/downloads/workbench/
2.เว็บไซต์นี้ใช้ mySQL database โดยก่อนใช้งาน ผู้ใช้ต้องกรอกรหัส localhost ของตัวเอง โดยแก้ไขรหัสได้ที่ไฟล์ backend/db.js
3.เมื่อต้องการรันเว็บไซต์ผ่าน localhost ให้ทำการรัน server ก่อน โดยไปที่โฟลเดอร์ backend และ ใช้คำสั่ง node server.js เพื่อทำการสร้างและรัน database
4.เมื่อ server สามารถใช้งานได้แล้ว ให้ทำการรัน ng serve ที่โฟลเดอร์หลัก (root) เพื่อรันเว็บไซต์