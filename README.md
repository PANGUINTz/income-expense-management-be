<h3>IncomeExpenseAPI คืออะไร</h3>
<p>IncomeExpenseAPI คือ โปรแกรมหลังบ้านในการทำบัญชีรายรับรายจ่าย ที่สามารถดูค่าใช้จ่ายของวันนี้ และยอดค่าใช้จ่ายของปีก่อน ๆ หรือ เดือนก่อน ๆ ได้ และยังสามารถบอกได้ว่าเงินคงเหลือที่สามารถใช้ได้ในเดือนนี้เหลือเท่าไหร่</p>

<h3>Language, Framework และ Library ที่ใช้</h3>
<p>
    - Typescript <br/>
    - Node.JS <br/>
    - ExpressJS <br/>
    - argon2 <br/>
    - multer  <br/>
    - body-parser <br/>
    - cors <br/>
    - typeorm <br/>
    - ua-parser-js <br/>
    - class-transformer <br/>
    - class-validator <br/>
</p>

<h3>ขั้นตอนการติดตั้ง Project IncomeExpenseAPI</h3>
<p>
    - git clone https://github.com/PANGUINTz/income-expense-management-be.git <br/>
    - npm install <br/>
    - สร้างไฟล์ .env สามารถดูหัวข้อได้ใน .env.example <br/>
    - npm start <br/>
</p>

<h3>ระบบที่มี</h3>
<p>
    - login <br/>
    - authentication จดจำบัญชี และสามารถออกจากระบบได้ทุก device <br/>
    - เพิ่มบัญชีใช้จ่าย <br/>
    - เพิ่มประเภทของการใช้จ่าย <br/>
    - สรุปยอดใช้จ่าย (วันนี้, เดือนนี้, ปีนี้, เดือนอื่นๆ, ปีอื่นๆ) <br/>
    - ดูรายการรายรับรายจ่าย (วันนี้, เดือนนี้, ปีนี้, เดือนอื่นๆ, ปีอื่นๆ) <br/>
    - แนบไฟล์รูปภาพ slip limit 1 MB รองรับรูปภาพ(.jpg, .jpeg, .png) <br/>
    - ระบบกรองคำหยาบ สามารถเพิ่มได้โดยเข้าไปที่ /src/utils/censorProfanity <br/>
    - แบ่งชุดข้อมูล (pagination) <br/>
    - เฉลี่ยเงินที่สามารถใช้ได้ ต่อเดือน(เฉพาะของเดือนนี้) <br/>
</p>

<h3>การใช้งาน Path API IncomeExpenseAPI</h3>
<p>
    <b>Authentification การยืนยันตัวตน</b> <br/>
    Sign In<br/>
    POST: http://localhost:8000/api/auth/signin <br/>
    body { <br/>
        "username":"test", <br/>
        "password:"test" <br/>
    } <br/>
    Sign Up <br/>
    POST: http://localhost:8000/api/auth/signup <br/>
    body { <br/>
        "username":"test", <br/>
        "password:"test" <br/>
    } <br/>
    Sign Out (use Bearer Token)<br/> 
    GET: http://localhost:8000/api/auth/signout <br/>
    Sign Out All Devices (use Bearer Token)<br/>
    GET: http://localhost:8000/api/auth/signout-all <br/>
    Profile (use Bearer Token)<br/>
    GET: http://localhost:8000/api/auth/profile <br/>

</p>

<p>
    <b>Accounts กระเป๋าบัญชี</b> <br/>
    ดูกระเป๋าที่มีทั้งหมด GetAllAccount<br/>
    query params{ <br/>
        page: 1, (optional ถ้าหากไม่ใส่ค่าเริ่มต้นจะถูกใช้งาน) <br/>
        limit: 10, (optional ถ้าหากไม่ใส่ค่าเริ่มต้นจะถูกใช้งาน) <br/>
    }<br/>
    GET: http://localhost:8000/api/accounts <br/>
    ดูกระเป๋านั้น ๆ GetAccountById <br/>
    GET: http://localhost:8000/api/account/:accountId <br/>
    body { <br/>
        "name":"test" <br/>
    } <br/>
    เพิ่มบัญชี Add Account<br/>
    POST: http://localhost:8000/api/account <br/>
    body { <br/>
        "name":"test" <br/>
    } <br/>
    อัพเดตชื่อบัญชี Update Account<br/>
    PUT: http://localhost:8000/api/account/:accountId <br/>
    body { <br/>
        "name":"test" <br/>
    } <br/>
    ลบบัญชี Delete Accounts<br/>
    DELETE: http://localhost:8000/api/account/:accountId <br/>
</p>

<p>
    <b>Category ประเภทค่าใช้จ่าย</b> <br/>
    ดูประเภทค่าใช้จ่ายทั้งหมด GetAllCategory<br/>
    GET: http://localhost:8000/api/category <br/>
    body { <br/>
        "name":"test", (required)<br/>
        "type":"expense" | "income", (required)<br/>
        "is_public": false, (optional ถ้าหากต้องการให้ผู้อื่นสามารถใช้ category นี้ได้ให้ใช้ true)<br/>
    } <br/>
    เพิ่มประเภทค่าใช้จ่าย Add Category<br/>
    POST: http://localhost:8000/api/category <br/>
    ลบประเภทค่าใช้จ่าย Delete Category <br/>
    DELETE: http://localhost:8000/api/category/:categoryId <br/>

</p>

<p>
    <b>Transaction ธุรกรรมทางการเงิน</b> <br/>
    query params{ <br/>
        page: 1, (optional ถ้าหากไม่ใส่ค่าเริ่มต้นจะถูกใช้งาน) <br/>
        limit: 10, (optional ถ้าหากไม่ใส่ค่าเริ่มต้นจะถูกใช้งาน) <br/>
        filter = "daily" | "monthly" | "annual", (optional ถ้าหากไม่ใส่ค่าเริ่มต้นจะถูกใช้งาน) <br/>
        monthly, (optional ถ้าหากไม่ใส่จะใช้เดือนปัจจุบัน)<br/>
        annual, (optional ถ้าหากไม่ใส่จะใช้ปีปัจจุบัน)<br/>
        category, (optional ถ้าใส่จะหาเฉพาะ category นั้น)<br/>
        account, (optional ถ้าใส่จะหาเฉพาะ account นั้น)<br/>
    }<br/>
    ดูธุรกรรมทางการเงินทั้งหมด GetAllTransaction<br/>
    GET: http://localhost:8000/api/transaction <br/>
    body { <br/>
        "cost": 100, (required)<br/>
        "note":"", (optional)<br/>
        "category": 1, (required ต้องอิงไอดีตามcategory ด้วย)<br/>
        "slip": "", (optional รองรับรูป 1mb .jpg, .jpeg, .png)<br/>
    } <br/>
    เพิ่มธุรกรรมทางการเงิน Add Transaction<br/>
    POST: http://localhost:8000/api/transaction <br/>
        query params{ <br/>
        page: 1, (optional ถ้าหากไม่ใส่ค่าเริ่มต้นจะถูกใช้งาน) <br/>
        limit: 10, (optional ถ้าหากไม่ใส่ค่าเริ่มต้นจะถูกใช้งาน) <br/>
        filter = "daily" | "monthly" | "annual", (optional ถ้าหากไม่ใส่ค่าเริ่มต้นจะถูกใช้งาน) <br/>
        monthly, (optional ถ้าหากไม่ใส่จะใช้เดือนปัจจุบัน)<br/>
        annual, (optional ถ้าหากไม่ใส่จะใช้ปีปัจจุบัน)<br/>
    }<br/>
    ดูสรุปยอดค่าใช้จ่าย ของบัญชีนั้น ๆ<br/>
    GET: http://localhost:8000/api/transaction/summary/:accountId <br/>
    ระบบเฉลี่ยเงิน ของบัญชีนั้น ๆ ของเดือนปัจจุบัน<br/>
    GET: http://localhost:8000/api/transaction/average/:accountId <br/>

</p>
