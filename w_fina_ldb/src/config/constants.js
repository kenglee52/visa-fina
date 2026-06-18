/**
 * Application Constants
 * Centralized constants for the entire application
 */

// File Upload Configuration
export const FILE_UPLOAD_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['application/pdf'],
  ALLOWED_EXTENSIONS: ['.pdf'],
};

// Document Types
export const DOCUMENT_TYPES = [
  { value: 'id_card', label: 'ບັດປະຈຳຕົວ' },
  { value: 'passport', label: 'ພາສໍອດ' },
  { value: 'family_book', label: 'ສະມຸດຄອບຄົວ' },
  { value: 'other', label: 'ອື່ນໆ' },
];

// File Types for Applicant Documents
export const FILE_TYPES = {
  CUSTOMER_REQUEST_FORM: 'customer_request_form',
  REQUEST_EARMARK_ACCOUNT: 'request_earmark_account',
  REGISTRATION_FORM_CREDIT_CARD: 'registration_form_credit_card',
  REGISTRATION_FORM_GIF_FINA: 'registration_form_gif_fina',
};

// Relationship Statuses
export const RELATIONSHIP_STATUSES = [
  { value: 'single', label: 'ໂສດ' },
  { value: 'married', label: 'ສົມພາດ' },
  { value: 'divorced', label: 'ໝ່ວຍລ້າງ' },
  { value: 'widowed', label: 'ສະໝັດໝູ່' },
];

// Genders
export const GENDERS = [
  { value: 'male', label: 'ຊາຍ' },
  { value: 'female', label: 'ຍິງ' },
];

// Employee Roles
export const EMPLOYEE_ROLES = {
  ADMIN: 'admin',
  VERIFIER: 'verifier',
  DATA_ENTRY: 'data_entry',
  RECEIVER: 'receiver',
};

export const ROLE_LABELS = {
  admin: 'ຜູ້ດູແລ',
  verifier: 'ຜູ້ກວດສອບ',
  data_entry: 'ອັບໂຫຼດເອກະສານ',
  receiver: 'ຜູ້ມາຣັບບັດ',
};

// Applicant Statuses
export const APPLICANT_STATUSES = {
  IN_PROGRESS: 'in_progress',
  CHECKED: 'checked',
  REJECTED: 'rejected',
  ISSUED: 'issued',
  RECEIVED: 'received',
};

// Status Labels (Lao)
export const STATUS_LABELS = {
  in_progress: 'ລໍຖ້າການຕິດຕາມ',
  checked: 'ກວດສອບແລ້ວ',
  rejected: 'ປະຕິເສດ',
  issued: 'ອອກແລ້ວ',
  received: 'ຮັບແລ້ວ',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  EMPLOYEE: 'employee',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Routes
export const ROUTES = {
  LOGIN: '/',
  DATA_ENTRY_APPLICANTS: '/data-entry/applicants',
  DATA_ENTRY_STATUS: '/data-entry/status',
  VERIFIER_CHECK: '/verifier/verifie-check',
  VERIFIER_ISSUED: '/verifier/verifie-issued',
  VERIFIER_RECEIVED: '/verifier/verifie-received',
  VERIFIER_VIEW_LOG: '/verifier/verifie-view-log',
  ADMIN_DASHBOARD: '/admin-dasdbord',
  ADMIN_AUDIT_LOG: '/admin-dasdbord/audit-log',
  ADMIN_MANAGEMENT: '/admin-dasdbord/management',
  ADMIN_PROVINCES: '/admin-dasdbord/management/provinces',
  ADMIN_DISTRICTS: '/admin-dasdbord/management/districts',
  ADMIN_EMPLOYEES: '/admin-dasdbord/management/employee',
};

// Validation Messages (Lao)
export const VALIDATION_MESSAGES = {
  REQUIRED: 'ກະລຸນາປ້ອນຂໍ້ມູນນີ້',
  INVALID_EMAIL: 'ລະຫັດອີເມວບໍ່ຖືກຕ້ອງ',
  INVALID_PHONE: 'ລະຫັດໂທລະພູມບໍ່ຖືກຕ້ອງ',
  PASSWORD_TOO_SHORT: 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງນ້ອຍ 6 ຕົວອັກສອນ',
  PASSWORDS_NOT_MATCH: 'ລະຫັດຜ່ານບໍ່ຕົງກັນ',
  FILE_TOO_LARGE: 'ຂະໜາດໄຟລ໌ຕ້ອງບໍ່ເກີນ 5MB',
  INVALID_FILE_TYPE: 'ອະນຸຍາດສະເໜີພາສໍາລັດ PDF ເທົ່ານັ້ນ',
  CTM_KEYS_MUST_DIFFER: 'FINA CTM Key ແລະ LBD CTM Key ຕ້ອງແຕກຕ່າງກັນ',
  PROVINCE_REQUIRED: 'ກະລຸນາເລືອກແຂວງ',
  DISTRICT_REQUIRED: 'ກະລຸນາເລືອກເມືອງ',
  LOGIN_FAILED: 'ເຂົ້າສູ່ລະບົບລົ້ມເຫຼັນ',
};

// Toast Messages (Lao)
export const TOAST_MESSAGES = {
  // Success
  LOGIN_SUCCESS: 'ເຂົ້າສູ່ລະບົບສຳເລັດ',
  LOGOUT_SUCCESS: 'ອອກຈາກລະບົບສຳເລັດ',
  SAVE_SUCCESS: 'ບັນທຶກຂໍ້ມູນສຳເລັດ',
  DELETE_SUCCESS: 'ລຶບຂໍ້ມູນສຳເລັດ',
  UPDATE_SUCCESS: 'ອັບເດດຂໍ້ມູນສຳເລັດ',
  UPLOAD_SUCCESS: 'ອັບໂຫຼດໄຟລ໌ສຳເລັດ',

  // Error
  LOGIN_FAILED: 'ເຂົ້າສູ່ລະບົບລົ້ມເຫຼັນ',
  SAVE_FAILED: 'ບັນທຶກຂໍ້ມູນລົ້ມເຫຼັນ',
  DELETE_FAILED: 'ລຶບຂໍ້ມູນລົ້ມເຫຼັນ',
  UPLOAD_FAILED: 'ອັບໂຫຼດໄຟລ໌ລົ້ມເຫຼັນ',
  NETWORK_ERROR: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ເຊີບເວີ',
  UNKNOWN_ERROR: 'ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຄາດຄິດ',
};

// Dialog Messages (Lao)
export const DIALOG_MESSAGES = {
  CONFIRM_DELETE: 'ທ່ານແນ່ໃຈບໍ່ທີ່ຈະລຶບຂໍ້ມູນນີ້?',
  CONFIRM_LOGOUT: 'ທ່ານແນ່ໃຈບໍ່ທີ່ຈະອອກຈາກລະບົບ?',
  CONFIRM_APPROVE: 'ທ່ານແນ່ໃຈບໍ່ທີ່ຈະອະນຸມັດຜູ້ສະໝັກນີ້?',
  CONFIRM_REJECT: 'ທ່ານແນ່ໃຈບໍ່ທີ່ຈະປະຕິເສດຜູ້ສະໝັກນີ້?',
  CONFIRM_ISSUE: 'ທ່ານແນ່ໃຈບໍ່ທີ່ຈະອອກບັດໃຫ້ຜູ້ສະໝັກນີ້?',
  CONFIRM_RECEIVE: 'ທ່ານແນ່ໃຈບໍ່ທີ່ຈະຢືນຢັນການຮັບບັດ?',

  CONFIRM: 'ຢືນຢັນ',
  CANCEL: 'ຍົກເລີກ',
  DELETE: 'ລຶບ',
  LOGOUT: 'ອອກຈາກລະບົບ',
  APPROVE: 'ອະນຸມັດ',
  REJECT: 'ປະຕິເສດ',
  ISSUE: 'ອອກບັດ',
  RECEIVE: 'ຮັບບັດ',
};

// Input Labels (Lao)
export const INPUT_LABELS = {
  // Personal Info
  NAME: 'ຊື່',
  SURNAME: 'ນາມສະກຸນ',
  DOB: 'ວັນເດືອນປີເກີດ',
  VILLAGE: 'ບ້ານ',
  GENDER: 'ເພດ',
  RELATIONSHIP_STATUS: 'ສະຖານະ',

  // Document Info
  DOC_TYPE: 'ປະເພດເອກະສານ',
  DOC_NUMBER: 'ເລກທີເອກະສານ',
  ISSUED_BY: 'ອອກໂດຍ',
  ISSUED_DATE: 'ວັນທີອອກ',
  EXPIRY_DATE: 'ວັນທີໝົປ',
  PROVINCE: 'ແຂວງ',
  DISTRICT: 'ເມືອງ',

  // CTM Keys
  FINA_CTM_KEY: 'FINA CTM Key',
  LBD_CTM_KEY: 'LBD CTM Key',
  CREDIT_RATING: 'ລະດັບເຄຣດິດ',

  // Employee
  EMPLOYEE_ID: 'ລະຫັດພະນັກງານ',
  PASSWORD: 'ລະຫັດຜ່ານ',
  EMAIL: 'ອີເມວ',
  ROLE: 'ຕຳແໜ່ງ',

  // Actions
  SEARCH: 'ຄົ້ນຫາ...',
  SUBMIT: 'ບັນທຶກ',
  CANCEL: 'ຍົກເລີກ',
  EDIT: 'ແກ້ໄຂ',
  ADD: 'ເພີ່ມ',
  SAVE: 'ບັນທຶກ',
  BACK: 'ກັບຄືນ',
};
