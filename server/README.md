# FINA LBB Visa KYC API

Backend API ສຳລັບລະບົບ KYC (Know Your Customer) ບັດເຄຣດິດ FINA LBB Visa

## 📋 ເນື້ອໃນ

- [ຂໍ້ມູນໂຄງການ](#ຂໍ້ມູນໂຄງການ)
- [ຄຸນສົມບັດ](#ຄຸນສົມບັດ)
- [ເຕັກໂນໂລຊີທີ່ໃຊ້](#ເຕັກໂນໂລຊີທີ່ໃຊ້)
- [ໂຄງສ້າງໂຄງການ](#ໂຄງສ້າງໂຄງການ)
- [ການຕິດຕັ້ງ](#ການຕິດຕັ້ງ)
- [ການຕັ້ງຄ່າ Environment](#ການຕັ້ງຄ່າ-environment)
- [ການແລ່ນໂຄງການ](#ການແລ່ນໂຄງການ)
- [API Endpoints](#api-endpoints)
- [ໂຄງສ້າງຖານຂໍ້ມູນ](#ໂຄງສ້າງຖານຂໍ້ມູນ)

## ຂໍ້ມູນໂຄງການ

FINA LBB Visa KYC API ເປັນ REST API ສຳລັບຈັດການຂໍ້ມູນຜູ້ສະໝັກບັດເຄຣດິດ ຮອງຮັບການອັບໂຫຼດເອກະສານ ການກວດສອບ ແລະ ການຕິດຕາມສະຖານະຄຳຂໍ

## ຄຸນສົມບັດ

- 🔐 **Authentication**: JWT-based authentication
- 📄 **Document Upload**: ອັບໂຫຼດເອກະສານ PDF (ສູງສຸດ 5MB)
- 📊 **Reporting**: ລະບົບລາຍງານ ແລະ audit logs
- 👥 **Role-based Access**: admin, verifier, data_entry, receiver
- ✅ **Input Validation**: Validation middleware ດ້ວຍ express-validator
- 📝 **Logging**: Centralized logging system
- 🔄 **Transaction Support**: Database transactions ສຳລັບຄວາມປອດໄພ

## ເຕັກໂນໂລຊີທີ່ໃຊ້

| ໝວດໝູ່ | ເຕັກໂນໂລຊີ |
|---------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MySQL |
| **Authentication** | JWT (jsonwebtoken) |
| **File Upload** | Multer |
| **Validation** | express-validator |
| **Password Hashing** | bcrypt |

## ໂຄງສ້າງໂຄງການ

```
server/
├── config/                      # Configuration files
│   ├── connect_DB.js           # Database connection
│   ├── constants.js            # Constants & error messages
│   └── multer/
│       └── uploadConfig.js     # File upload configuration
├── controllers/                 # Business logic
│   ├── address/
│   │   ├── provinces.js        # Province CRUD
│   │   └── districts.js        # District CRUD
│   ├── applicants.js           # Applicant operations
│   ├── authen_user.js          # Login/Register
│   ├── employee.js             # Employee management
│   ├── follow_applicant.js     # Reports & logs
│   └── manage_doc/
│       └── applicants_manage.js # Document management
├── middlewares/                # Middleware functions
│   ├── authCheck.js            # JWT authentication
│   └── validators/
│       ├── addressValidator.js
│       ├── applicantValidator.js
│       └── employeeValidator.js
├── routes/                      # API routes
│   ├── applicants.js
│   ├── applicants_manage.js
│   ├── authen_user.js
│   ├── districts.js
│   ├── employee.js
│   ├── follow_applicant.js
│   └── provinces.js
├── utils/                       # Helper functions
│   ├── logger.js               # Logging utility
│   └── response.js             # Response helpers
├── applicant_documents/        # Uploaded PDFs
├── server.js                    # Entry point
├── seed.js                     # Seed admin user
├── package.json
└── .env                        # Environment variables
```

## ການຕິດຕັ້ງ

```bash
# Clone repository
git clone <repository-url>

# ເຂົ້າໄປໃນ directory server
cd server

# ຕິດຕັ້ງ dependencies
npm install
```

## ການຕັ້ງຄ່າ Environment

ສ້າງໄຟລ໌ `.env` ໃນໂຟນເດີ `server/`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=visa_kyc
SECRET=your_jwt_secret_key
PORT=8001
```

## ການແລ່ນໂຄງການ

### Development Mode
```bash
npm start
```
Server ຈະແລ່ນທີ່ port 8001 (ຫຼື ຕາມທີ່ລະບຸໃນ .env)

### Seed Admin User
```bash
node seed.js
```
ສຳລັບສ້າງ admin user ເລີ່ມຕົ້ນ

## API Endpoints

### Base URL
```
http://localhost:8001/api
```

### Authentication

#### Register
```http
POST /api/register
Content-Type: application/json

{
  "id": "EMP001",
  "name": "John",
  "last_name": "Doe",
  "role": "data_entry",
  "password": "password123"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "id": "EMP001",
  "password": "password123"
}
```

### Applicants

#### Create Applicant
```http
POST /api/create-applicants
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Somchai",
  "surname": "Suddee",
  "dob": "1990-01-01",
  "village": "Ban Nong Ping",
  "gender": "male",
  "province_id": 1,
  "district_id": 1,
  "relationship_status": "single",
  "doc_type": "id_card",
  "doc_number": "1234567890123",
  "issued_by": "Laos",
  "issued_date": "2020-01-01",
  "expiry_date": "2030-01-01",
  "lbd_ctm_key": "LBD123456"
}
```

#### Get Applicant
```http
GET /api/applicant/:applicant_id
Authorization: Bearer <token>
```

#### Update Applicant
```http
PUT /api/update-applicant/:applicant_id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Upload Documents
```http
POST /api/upload-documents
Authorization: Bearer <token>
Content-Type: multipart/form-data

applicant_id: 123
registration_form_credit_card: (file)
registration_form_gif_fina: (file)
customer_request_form: (file)
request_earmark_account: (file)
```

#### Get Documents
```http
GET /api/documents/:applicant_id
Authorization: Bearer <token>
```

#### Delete Document
```http
DELETE /api/delete-document/:applicant_id/:file_type
Authorization: Bearer <token>
```

### Address

#### Get Provinces
```http
GET /api/provinces
Authorization: Bearer <token>
```

#### Get Districts
```http
GET /api/districts/:province_id
Authorization: Bearer <token>
```

### Reports

#### Get Follow Report
```http
GET /api/follow-report?status=in_progress&page=1&limit=10
Authorization: Bearer <token>
```

#### Get Log Report
```http
GET /api/log-report?action=upload_documents&page=1&limit=10
Authorization: Bearer <token>
```

## ໂຄງສ້າງຖານຂໍ້ມູນ

### Tables

#### `employees`
- id (PK)
- name
- last_name
- email
- role (admin, verifier, data_entry, receiver)
- password (hashed)

#### `applicants`
- id (PK)
- fina_ctm_key
- lbd_ctm_key
- credit_rating
- name
- surname
- dob
- village
- gender
- province_id (FK)
- district_id (FK)
- relationship_status
- doc_type
- doc_number
- issued_by
- issued_date
- expiry_date
- current_status
- last_rejected_feedback
- created_at
- updated_at

#### `applicant_documents`
- id (PK)
- applicant_id (FK)
- file_type
- file_path

#### `audit_logs`
- id (PK)
- applicant_id (FK)
- data_entry_employee_id (FK)
- employee_id (FK)
- action
- status
- timestamp

#### `provinces`
- id (PK)
- name

#### `districts`
- id (PK)
- province_id (FK)
- name

## License

ISC
