# FINA LBB Visa KYC API

 backend API ທີ່ສ້າງດ້ວຍ Node.js ແລະ Express.js ສຳລັບການຈັດການລະບົບ KYC (Know Your Customer) ຂອງ FINA LBB Visa. ລະບົບນີ້ຈັດການກັບການສ້າງຜູ້ສະໝັກ (Applicants), ອັບໂຫລດເອກະສານ, ການກວດສອບເອກະສານ, ການຈັດການແຂວງ/ເມືອງ, ພະນັກງານ (Employees), ການກວດສອບສິດ (Authentication), ແລະລາຍງານ (Reports). ໃຊ້ JWT ສຳລັບການກວດສອບສິດ ແລະ Multer ສຳລັບການອັບໂຫລດເອກະສານ PDF.

## ສາລະບານ

- [ຄຸນນະສົມບັດ](#ຄຸນນະສົມບັດ)
- [ເທກໂນໂລຢີທີ່ໃຊ້](#ເທກໂນໂລຢີທີ່ໃຊ້)
- [ການຕິດຕັ້ງ](#ການຕິດຕັ້ງ)
- [ການຕັ້ງຄ່າ](#ການຕັ້ງຄ່າ)
- [ການເລີ່ມເຮັດວຽກ](#ການເລີ່ມເຮັດວຽກ)
- [API Endpoints](#api-endpoints)
  - [ການກວດສອບສິດ (Authentication)](#ການກວດສອບສິດ-authentication)
  - [ການຈັດການແຂວງ (Provinces)](#ການຈັດການແຂວງ-provinces)
  - [ການຈັດການເມືອງ (Districts)](#ການຈັດການເມືອງ-districts)
  - [ການຈັດການພະນັກງານ (Employees)](#ການຈັດການພະນັກງານ-employees)
  - [ການຈັດການຜູ້ສະໝັກ (Applicants)](#ການຈັດການຜູ້ສະໝັກ-applicants)
  - [ການກວດສອບເອກະສານ (Manage Documents)](#ການກວດສອບເອກະສານ-manage-documents)
  - [ການຈັດການລາຍງານ (Reports)](#ການຈັດການລາຍງານ-reports)
- [ການກວດສອບສິດແລະການເຂົ້າເຖິງ](#ການກວດສອບສິດແລະການເຂົ້າເຖິງ)
- [ການອັບໂຫລດເອກະສານ (File Uploads)](#ການອັບໂຫລດເອກະສານ-file-uploads)
- [ໂຄງສ້າງຖານຂໍ້ມູນ (Database Schema)](#ໂຄງສ້າງຖານຂໍ້ມູນ-database-schema)
- [ການຈັດການຂໍ້ຜິດພາດ (Error Handling)](#ການຈັດການຂໍ້ຜິດພາດ-error-handling)
- [ການປະກອບສ່ວນ](#ການປະກອບສ່ວນ)
- [ໃບອະນຸຍາດ](#ໃບອະນຸຍາດ)

## ຄຸນນະສົມບັດ

- **ການກວດສອບສິດ**: Register, Login, ກວດສອບຜູ້ໃຊ້ປະຈຸບັນ, ການກວດສອບບົດບາດເຊັ່ນ ADMIN, VERIFIER.
- **ການຈັດການແຂວງ/ເມືອງ**: CRUD ສຳລັບແຂວງແລະເມືອງ (ADMIN ເທົ່ານັ້ນ).
- **ການຈັດການພະນັກງານ**: CRUD ສຳລັບພະນັກງານ (Employees).
- **ການຈັດການຜູ້ສະໝັກ**: ສ້າງຜູ້ສະໝັກ, ອັບໂຫລດເອກະສານ PDF (ເຊັ່ນ customer_request_form, request_earmark_account), ອັບເດດຜູ້ສະໝັກ, ລຶບເອກະສານ.
- **ການກວດສອບເອກະສານ**: ກວດສອບ (check), ປະຕິເສດ (reject), Issued, ອັບເດດ FINA CTM Key, ຢືນຢັນການຮັບ (confirm received) ໂດຍ VERIFIER.
- **ການຈັດການລາຍງານ**: ເອົາລາຍງານການຕິດຕາມ (follow-report), Logs (log-report).
- **ການ Seed Admin**: ສ້າງຫຼືອັບເດດຜູ້ດູແລລະບົບອັດຕະໂນມັດເມື່ອເລີ່ມເຮັດວຽກ.
- **Static Files**: Serve ເອກະສານຈາກໂຟນເດີ applicant_documents.

## ເທກໂນໂລຢີທີ່ໃຊ້

- **Node.js** & **Express.js**: Framework ສຳລັບ API.
- **JWT**: ສຳລັບການກວດສອບ Token (ສົມມຸດຕາມ middleware authCheck).
- **Bcrypt**: ສຳລັບການ hash password.
- **Multer**: ສຳລັບການອັບໂຫລດເອກະສານ PDF.
- **Morgan & Cors**: ສຳລັບ logging ແລະ cross-origin.
- **MySQL**: Database (ຈາກ connect_DB).
- **ອື່ນໆ**: dotenv (ສຳລັບ .env), fs/path ສຳລັບການຈັດການໄຟລ໌.

## ການຕິດຕັ້ງ

1. Clone repository:
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. ຕິດຕັ້ງ dependencies:
   ```
   npm install
   ```

   Dependencies ຫຼັກ (ຈາກ code):
   - express
   - morgan
   - cors
   - multer
   - bcrypt
   - dotenv

   ຖ້າບໍ່ມີ package.json, ໃຊ້ `npm install express morgan cors multer bcrypt dotenv`.

## ການຕັ້ງຄ່າ

1. ສ້າງໄຟລ໌ `.env` ໃນ root directory ດ້ວຍຕົວແປດັ່ງນີ້:
   ```
   PORT=8001  # Port ຂອງ server
   DATABASE_URL=mysql://user:password@host:3306/database_name  # URL ເຊື່ອມຕໍ່ MySQL
   SECRET=your_jwt_secret_key  # Secret ສຳລັບ JWT (ຖ້າມີ)
   ```

2. ຕັ້ງຖານຂໍ້ມູນ MySQL:
   - ສ້າງ database ແລະ tables ຕາມ [ໂຄງສ້າງຖານຂໍ້ມູນ](#ໂຄງສ້າງຖານຂໍ້ມູນ-database-schema).
   - ແລ່ນ script seedAdmin.js ເພື່ອສ້າງ admin ອັດຕະໂນມັດ: `node seedAdmin.js`.

3. ສ້າງໂຟນເດີສຳລັບອັບໂຫລດ: `applicant_documents` ແລະ subfolders ເຊັ່ນ customer_request_form, request_earmark_account, ແລະອື່ນໆ.

## ການເລີ່ມເຮັດວຽກ

1. ເລີ່ມ server:
   ```
   npm start
   ```
   ຫຼືໃຊ້ Nodemon:
   ```
   npm install -g nodemon
   nodemon server.js  # ສົມມຸດວ່າ entry file ແມ່ນ index.js ຫຼື app.js
   ```

2. API ຈະມີໃຫ້ໃຊ້ງານທີ່ `http://localhost:8001`. ເຂົ້າ `/` ເພື່ອເບິ່ງ welcome message.

## API Endpoints

Endpoints ທັງໝົດເລີ່ມຕົ້ນດ້ວຍ `/api/` (ປັບຕາມ app.js). ໃຊ້ Postman ສຳລັບການທົດສອບ.

### ການກວດສອບສິດ (Authentication)

- **POST /register**: Register ຜູ້ໃຊ້ໃໝ່.
  - Body: `{ email, password, role }` (ປັບຕາມ controller).
- **POST /login**: Login ແລະໄດ້ຮັບ Token.
  - Body: `{ email, password }`.
- **POST /current-user**: ເອົາຂໍ້ມູນຜູ້ໃຊ້ປະຈຸບັນ.
  - Headers: `Authorization: Bearer <token>`.
- **POST /current-verifier**: ເອົາຂໍ້ມູນ Verifier ປະຈຸບັນ (Verifier ເທົ່ານັ້ນ).

### ການຈັດການແຂວງ (Provinces)

- **GET /provinces**: ເອົາລາຍການແຂວງທັງໝົດ.
- **POST /provinces**: ສ້າງແຂວງໃໝ່ (ADMIN).
- **PUT /provinces/:id**: ອັບເດດແຂວງ.
- **DELETE /provinces/:id**: ລຶບແຂວງ.

### ການຈັດການເມືອງ (Districts)

- **GET /districts**: ເອົາລາຍການເມືອງທັງໝົດ.
- **POST /districts**: ສ້າງເມືອງໃໝ່ (ADMIN).
- **PUT /districts/:id**: ອັບເດດເມືອງ.
- **DELETE /districts/:id**: ລຶບເມືອງ.

### ການຈັດການພະນັກງານ (Employees)

- **GET /employee**: ເອົາລາຍການພະນັກງານທັງໝົດ.
- **POST /employee**: ສ້າງພະນັກງານໃໝ່ (ADMIN).
- **PUT /employee/:id**: ອັບເດດພະນັກງານ.
- **DELETE /employee/:id**: ລຶບພະນັກງານ.

### ການຈັດການຜູ້ສະໝັກ (Applicants)

- **POST /create-applicants**: ສ້າງຜູ້ສະໝັກໃໝ່.
- **GET /provinces**: ເອົາແຂວງ (ເບິ່ງ Provinces).
- **GET /districts/:province_id**: ເອົາເມືອງຕາມແຂວງ.
- **POST /upload-documents**: ອັບໂຫລດເອກະສານ (PDF ເທົ່ານັ້ນ, ຂະໜາດສູງສຸດ 5MB).
  - Form-data: customer_request_form, request_earmark_account, ແລະອື່ນໆ.
- **GET /documents/:applicant_id**: ເອົາເອກະສານຕາມ applicant_id.
- **PUT /update-applicant/:applicant_id**: ອັບເດດຜູ້ສະໝັກ.
- **DELETE /delete-document/:applicant_id/:file_type**: ລຶບເອກະສານຕາມປະເພດ.
- **GET /applicant/:applicant_id**: ເອົາຂໍ້ມູນຜູ້ສະໝັກ.

### ການກວດສອບເອກະສານ (Manage Documents)

- **PUT /check_document**: ກວດສອບເອກະສານ (Verifier).
- **PUT /reject_document**: ປະຕິເສດເອກະສານ (Verifier).
- **PUT /issued**: Issued ເອກະສານ (Verifier).
- **PUT /update_fina_ctm_key**: ອັບເດດ FINA CTM Key (Verifier).
- **POST /confirm-received**: ຢືນຢັນການຮັບ (Verifier).

### ການຈັດການລາຍງານ (Reports)

- **GET /follow-report**: ເອົາລາຍງານການຕິດຕາມ.
- **GET /log-report**: ເອົາລາຍງານ Logs (ADMIN).

## ການກວດສອບສິດແລະການເຂົ້າເຖິງ

- **JWT Auth**: ໃຊ້ສຳລັບການກວດສອບ Token ໃນ `authCheck` middleware.
- **Role Checks**: 
  - `adminCheck`: ສຳລັບ 'ADMIN'.
  - `verifierCheck`: ສຳລັບ 'VERIFIER'.

ໃຊ້ `Authorization: Bearer <token>` ໃນ headers ສຳລັບ endpoints ທີ່ປ້ອງກັນ.

## ການອັບໂຫລດເອກະສານ (File Uploads)

- Multer ຕັ້ງຄ່າສຳລັບ PDF ເທົ່ານັ້ນ, ຂະໜາດສູງສຸດ 5MB.
- ເກັບໄຟລ໌ໃນໂຟນເດີ applicant_documents ແລະ subfolders ຕາມ fieldname.
- Filename: `${applicant_id}_${timestamp}.pdf`.

## ໂຄງສ້າງຖານຂໍ້ມູນ (Database Schema)

ສົມມຸດຕາມ code (ປັບຕາມຄວາມຕ້ອງການ):

- **employees**: `id (PK), name, last_name, email, role, password`.
- **provinces**: `id (PK), name`.
- **districts**: `id (PK), name, province_id (FK)`.
- **applicants**: `applicant_id (PK), details...`.
- **documents**: ຕາຕະລາງສຳລັບເອກະສານ (ເຊັ່ນ customer_request_form_url).
- **audit_logs**: ສຳລັບການ log ການກວດສອບ.

ໃຊ້ SQL scripts ເພື່ອສ້າງ tables.

## ການຈັດການຂໍ້ຜິດພາດ (Error Handling)

- Middleware ສົ່ງ 401 ສຳລັບ Token ບໍ່ຖືກຕ້ອງ, 403 ສຳລັບບົດບາດບໍ່ກົງກັນ.
- Multer ກວດສອບ PDF ແລະຂະໜາດໄຟລ໌.
- Controllers ຄວນຈັດການຂໍ້ຜິດພາດເຊັ່ນ not found, validation.

