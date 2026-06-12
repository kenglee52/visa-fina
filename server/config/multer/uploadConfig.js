const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderMap = {
      customer_request_form: 'applicant_documents/customer_request_form/',
      request_earmark_account: 'applicant_documents/request_earmark_account/',
      registration_form_credit_card: 'applicant_documents/registration_form_credit_card/',
      registration_form_gif_fina: 'applicant_documents/registration_form_gif_fina/',

    };
    const uploadDir = path.join(__dirname, '../', folderMap[file.fieldname]);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
  const applicant_id = req.params?.applicant_id || req.body.applicant_id;
  if (!applicant_id) {
    return cb(new Error("Applicant ID is required for file upload"));
  }
  const ext = path.extname(file.originalname).toLowerCase();
  const uniqueSuffix = `${applicant_id}_${Date.now()}`;
  cb(null, `${uniqueSuffix}${ext}`);
},

});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([
  { name: 'customer_request_form', maxCount: 1 },
  { name: 'request_earmark_account', maxCount: 1 },
  { name: 'registration_form_credit_card', maxCount: 1 },
  { name: 'registration_form_gif_fina', maxCount: 1 },

]);

module.exports = upload;