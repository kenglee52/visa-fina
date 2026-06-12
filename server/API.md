# FINA LBB Visa KYC API Documentation

## Base URL

```
http://localhost:8001/api
```

## Authentication

ສ່ວນຫຼາຍຂອງ endpoints ຕ້ອງການ JWT token ໃນ header:

```http
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register Employee

ສ້າງບັນຊີພະນັກງານໃຫມ່

```http
POST /api/register
```

**Request Body:**
```json
{
  "id": "EMP001",
  "name": "John",
  "last_name": "Doe",
  "role": "data_entry",
  "password": "password123"
}
```

**Valid Roles:**
- `admin`
- `verifier`
- `data_entry`
- `receiver`

**Response (201):**
```json
{
  "success": true,
  "message": "Employee registered successfully",
  "data": {
    "employee": {
      "id": "EMP001",
      "name": "John",
      "last_name": "Doe",
      "role": "data_entry"
    }
  }
}
```

---

### Login

ເຂົ້າສູ່ລະບົບ ແລະ ຮັບ JWT token

```http
POST /api/login
```

**Request Body:**
```json
{
  "id": "EMP001",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "employee": {
      "id": "EMP001",
      "name": "John",
      "last_name": "Doe",
      "role": "data_entry"
    }
  }
}
```

---

### Get Current User

ເບິ່ງຂໍ້ມູນຜູ້ໃຊ້ງານປະຈຸບັນ

```http
GET /api/current-user
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Current user retrieved successfully",
  "data": {
    "employee": {
      "id": "EMP001",
      "name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "role": "data_entry"
    }
  }
}
```

---

## 👥 Applicants Endpoints

### Create Applicant

ສ້າງຂໍ້ມູນຜູ້ສະໝັກໃຫມ່

```http
POST /api/create-applicants
Authorization: Bearer <token>
```

**Request Body:**
```json
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
  "lbd_ctm_key": "LBD123456",
  "fina_ctm_key": "FINA789",
  "credit_rating": "A"
}
```

**Valid Genders:**
- `male`
- `female`

**Valid Relationship Status:**
- `single`
- `married`
- `divorced`
- `widowed`

**Valid Document Types:**
- `id_card`
- `passport`
- `family_book`
- `other`

**Response (201):**
```json
{
  "success": true,
  "message": "Applicant created successfully",
  "data": {
    "applicant": {
      "id": 123,
      "fina_ctm_key": "FINA789",
      "lbd_ctm_key": "LBD123456",
      "credit_rating": "A",
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
      "expiry_date": "2030-01-01"
    }
  }
}
```

---

### Get Applicant

ເບິ່ງຂໍ້ມູນຜູ້ສະໝັກຕາມ ID

```http
GET /api/applicant/:applicant_id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Applicant fetched successfully",
  "data": {
    "applicant": {
      "fina_ctm_key": "FINA789",
      "lbd_ctm_key": "LBD123456",
      "credit_rating": "A",
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
      "expiry_date": "2030-01-01"
    },
    "documents": {
      "customer_request_form": "applicant_documents/customer_request_form/123_1699999999.pdf",
      "request_earmark_account": "applicant_documents/request_earmark_account/123_1699999999.pdf",
      "registration_form_credit_card": "applicant_documents/registration_form_credit_card/123_1699999999.pdf",
      "registration_form_gif_fina": "applicant_documents/registration_form_gif_fina/123_1699999999.pdf"
    }
  }
}
```

---

### Update Applicant

ອັບເດດຂໍ້ມູນຜູ້ສະໝັກ (ຮອງຮັບທັງຂໍ້ມູນ ແລະ ໄຟລ໌ເອກະສານ)

```http
PUT /api/update-applicant/:applicant_id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
name: Somchai
surname: Suddee
dob: 1990-01-01
village: Ban Nong Ping
gender: male
province_id: 1
district_id: 1
relationship_status: single
doc_type: id_card
doc_number: 1234567890123
issued_by: Laos
issued_date: 2020-01-01
expiry_date: 2030-01-01
lbd_ctm_key: LBD123456
fina_ctm_key: FINA789
credit_rating: A

// Optional file uploads
customer_request_form: (file)
request_earmark_account: (file)
registration_form_credit_card: (file)
registration_form_gif_fina: (file)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Applicant updated successfully",
  "data": {
    "documents": [
      {
        "applicant_id": "123",
        "file_type": "registration_form_credit_card",
        "file_path": "applicant_documents/registration_form_credit_card/123_1700000000.pdf"
      }
    ]
  }
}
```

---

### Upload Documents

ອັບໂຫຼດເອກະສານສຳລັບຜູ້ສະໝັກ

```http
POST /api/upload-documents
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Required Files:**
- `registration_form_credit_card` (ຈຳເປັນ)
- `registration_form_gif_fina` (ຈຳເປັນ)

**Optional Files:**
- `customer_request_form`
- `request_earmark_account`

**Request:**
```
applicant_id: 123
registration_form_credit_card: (PDF file, max 5MB)
registration_form_gif_fina: (PDF file, max 5MB)
customer_request_form: (PDF file, max 5MB)
request_earmark_account: (PDF file, max 5MB)
```

**Response (201):**
```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "data": {
    "documents": [
      {
        "applicant_id": "123",
        "file_type": "customer_request_form",
        "file_path": "applicant_documents/customer_request_form/123_1700000000.pdf"
      },
      {
        "applicant_id": "123",
        "file_type": "registration_form_credit_card",
        "file_path": "applicant_documents/registration_form_credit_card/123_1700000000.pdf"
      }
    ]
  }
}
```

---

### Get Documents

ເບິ່ງເອກະສານທັງໝົດຂອງຜູ້ສະໝັກ

```http
GET /api/documents/:applicant_id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Resource fetched successfully",
  "data": {
    "documents": {
      "customer_request_form": "applicant_documents/customer_request_form/123_1699999999.pdf",
      "request_earmark_account": null,
      "registration_form_credit_card": "applicant_documents/registration_form_credit_card/123_1699999999.pdf",
      "registration_form_gif_fina": "applicant_documents/registration_form_gif_fina/123_1699999999.pdf"
    }
  }
}
```

---

### Delete Document

ລົບເອກະສານຂອງຜູ້ສະໝັກ

```http
DELETE /api/delete-document/:applicant_id/:file_type
Authorization: Bearer <token>
```

**Valid File Types:**
- `customer_request_form`
- `request_earmark_account`
- `registration_form_credit_card`
- `registration_form_gif_fina`

**Response (200):**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

## Address Endpoints

### Get Provinces

ເບິ່ງລາຍຊື່ແຂວງທັງໝົດ

```http
GET /api/provinces
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Provinces retrieved successfully",
  "data": {
    "provinces": [
      {
        "id": 1,
        "name": "Vientiane"
      },
      {
        "id": 2,
        "name": "Luang Prabang"
      }
    ]
  }
}
```

---

### Get Districts

ເບິ່ງລາຍຊື່ເມືອງ/ເມືອງຕາມແຂວງ

```http
GET /api/districts/:province_id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Districts retrieved successfully",
  "data": {
    "districts": [
      {
        "id": 1,
        "name": "Sisattanak"
      },
      {
        "id": 2,
        "name": "Chanthabuly"
      }
    ]
  }
}
```

---

## 📊 Report Endpoints

### Get Follow Report

ລາຍງານສະຖານະຜູ້ສະໝັກ (ຮອງຮັບ pagination ແລະ filter)

```http
GET /api/follow-report?status=in_progress&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | Filter by status (in_progress, checked, rejected, issued, received) |
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| applicant_id | number | No | Filter by applicant ID |
| date_from | date | No | Filter from date (YYYY-MM-DD) |
| date_to | date | No | Filter to date (YYYY-MM-DD) |

**Response (200):**
```json
{
  "success": true,
  "message": "Report fetched successfully",
  "data": [
    {
      "applicant_id": 123,
      "fina_ctm_key": "FINA789",
      "lbd_ctm_key": "LBD123456",
      "applicant_name": "Somchai",
      "applicant_surname": "Suddee",
      "status": "in_progress",
      "files": [
        {
          "applicant_id": 123,
          "file_type": "registration_form_credit_card",
          "file_path": "applicant_documents/registration_form_credit_card/123_1699999999.pdf"
        }
      ]
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

### Get Log Report

ລາຍງານ audit logs (Admin ເທົ່ານັ້ນ)

```http
GET /api/log-report?action=upload_documents&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| applicant_id | number | No | Filter by applicant ID |
| action | string | No | Filter by action type |
| status | string | No | Filter by status |
| date_from | date | No | Filter from date (YYYY-MM-DD) |
| date_to | date | No | Filter to date (YYYY-MM-DD) |
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |

**Valid Actions:**
- `check_document`
- `issue_card`
- `receive_card`
- `upload_documents`
- `edit_documents`
- `rejected`
- `update_fina_ctm_key`
- `delete_document`
- `create_applicant`

**Response (200):**
```json
{
  "success": true,
  "message": "Logs fetched successfully",
  "data": [
    {
      "log_id": 1,
      "applicant_id": 123,
      "data_entry_employee_id": 1,
      "employee_id": 2,
      "action": "upload_documents",
      "status": "in_progress",
      "timestamp": "2024-01-01 10:00:00",
      "applicant_name": "Somchai",
      "applicant_surname": "Suddee"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

## 👨‍💼 Employee Endpoints

### Get Employees

ເບິ່ງລາຍຊື່ພະນັກງານທັງໝົດ

```http
GET /api/employees
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": {
    "employees": [
      {
        "id": "EMP001",
        "name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "role": "data_entry"
      }
    ]
  }
}
```

---

### Create Employee

ສ້າງພະນັກງານໃຫມ່

```http
POST /api/employees
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "id": "EMP002",
  "name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com",
  "role": "verifier",
  "password": "password123"
}
```

---

### Update Employee

ອັບເດດຂໍ້ມູນພະນັກງານ

```http
PUT /api/employees/:id
Authorization: Bearer <token>
```

---

### Delete Employee

ລົບພະນັກງານ

```http
DELETE /api/employees/:id
Authorization: Bearer <token>
```

---

## 🔴 Province/District Management (Admin)

### Create Province

```http
POST /api/provinces
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Savannakhet"
}
```

---

### Update Province

```http
PUT /api/provinces/:id
Authorization: Bearer <token>
```

---

### Delete Province

```http
DELETE /api/provinces/:id
Authorization: Bearer <token>
```

---

### Create District

```http
POST /api/districts
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Kaysone Phomvihan",
  "province_id": 1
}
```

---

## 📄 Document Management (Verifier/Admin)

### Check Document

ກວດສອບ ແລະ ອະນຸມັດເອກະສານ

```http
POST /api/check-document
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "applicant_id": 123
}
```

---

### Reject Document

ປະຕິເສດເອກະສານ

```http
POST /api/reject-document
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "applicant_id": 123,
  "feedback": "Incomplete information"
}
```

---

### Issue Card

ອະນຸມັດການອອກບັດ

```http
POST /api/issue-card
Authorization: Bearer <token>
```

---

### Update FINA CTM Key

ອັບເດດ FINA CTM Key

```http
PUT /api/update-fina-ctm-key
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "applicant_id": 123,
  "fina_ctm_key": "FINA999"
}
```

---

## 📦 Error Responses

ທຸກ endpoints ຈະ return error response ໃນຮູບແບບ:

```json
{
  "success": false,
  "message": "Error message description"
}
```

### Common HTTP Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (Validation error) |
| 401 | Unauthorized (Missing/Invalid token) |
| 403 | Forbidden (Insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (Duplicate data) |
| 500 | Internal Server Error |

---

## 🔐 Roles & Permissions

| Role | Permissions |
|------|-------------|
| **admin** | All permissions |
| **verifier** | Check/reject documents, issue cards |
| **data_entry** | Create/update applicants, upload documents |
| **receiver** | Confirm card receipt |
