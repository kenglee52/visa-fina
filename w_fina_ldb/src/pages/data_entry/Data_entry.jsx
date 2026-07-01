/**
 * Data Entry Page (Refactored)
 * New applicant creation with document uploads
 * Using senior-level React patterns with hooks and API services
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import DateInput from '@/components/common/DateInput';
import Swal from 'sweetalert2';
// Hooks
import { useAuth } from '@/hooks/auth/useAuth';
import { useForm } from '@/hooks/form/useForm';
import { useFileUpload } from '@/hooks/form/useFileUpload';
import { useToast } from '@/hooks/ui/useToast';
import { useConfirmDialog } from '@/hooks/ui/useConfirmDialog';

// API Services
import { applicantAPI } from '@/api/applicant.api';
import { documentAPI } from '@/api/document.api';
import { locationAPI } from '@/api/location.api';
import DatePicker from 'react-datepicker';

// Constants
import {
  INPUT_LABELS,
  VALIDATION_MESSAGES,
  TOAST_MESSAGES,
  DIALOG_MESSAGES,
  DOCUMENT_TYPES,
  RELATIONSHIP_STATUSES,
  GENDERS,
  FILE_TYPES,
  FILE_UPLOAD_CONFIG,
} from '@/config/constants';

// Initial form state
const INITIAL_FORM_STATE = {
  fina_ctm_key: '',
  lbd_ctm_key: '',
  credit_rating: '',
  name: '',
  surname: '',
  dob: '',
  village: '',
  gender: '',
  province_id: '',
  district_id: '',
  relationship_status: '',
  doc_type: '',
  doc_number: '',
  issued_by: '',
  issued_date: '',
  expiry_date: '',
};

// Validation rules
const VALIDATION_RULES = {
  lbd_ctm_key: { required: VALIDATION_MESSAGES.REQUIRED },
  name: { required: VALIDATION_MESSAGES.REQUIRED },
  surname: { required: VALIDATION_MESSAGES.REQUIRED },
  dob: { required: VALIDATION_MESSAGES.REQUIRED },
  village: { required: VALIDATION_MESSAGES.REQUIRED },
  gender: { required: VALIDATION_MESSAGES.REQUIRED },
  province_id: { required: VALIDATION_MESSAGES.PROVINCE_REQUIRED },
  district_id: { required: VALIDATION_MESSAGES.DISTRICT_REQUIRED },
  relationship_status: { required: VALIDATION_MESSAGES.REQUIRED },
  doc_type: { required: VALIDATION_MESSAGES.REQUIRED },
  doc_number: { required: VALIDATION_MESSAGES.REQUIRED },
  issued_by: { required: VALIDATION_MESSAGES.REQUIRED },
  issued_date: { required: VALIDATION_MESSAGES.REQUIRED },
  expiry_date: { required: VALIDATION_MESSAGES.REQUIRED },
};

const DataEntry = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const { confirm } = useConfirmDialog();

  // Form state management
  const { form, errors, handleChange, handleDirectChange, validate, reset, setFormValue } = useForm(
    INITIAL_FORM_STATE,
    VALIDATION_RULES
  );

  // File upload management
  const {
    files,
    errors: fileErrors,
    handleFileChange,
    clearFile,
    reset: resetFiles,
    createFormData,
  } = useFileUpload({
    ...FILE_UPLOAD_CONFIG,
    allowedTypes: ['application/pdf'],
  });

  // Location data state
  const [provinces, setProvinces] = React.useState([]);
  const [districts, setDistricts] = React.useState([]);
  const [provincesLoading, setProvincesLoading] = React.useState(false);
  const [districtsLoading, setDistrictsLoading] = React.useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [applicantId, setApplicantId] = React.useState(null);
  const [documents, setDocuments] = React.useState({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      showError(VALIDATION_MESSAGES.LOGIN_FAILED);
      navigate('/');
    }
  }, [isAuthenticated, navigate, showError]);

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setProvincesLoading(true);
      try {
        const response = await locationAPI.getProvinces();
        setProvinces(response.data?.data?.provinces || []);
      } catch (error) {
        showError(TOAST_MESSAGES.NETWORK_ERROR);
      } finally {
        setProvincesLoading(false);
      }
    };
    fetchProvinces();
  }, [showError]);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!form.province_id) {
        setDistricts([]);
        return;
      }
      setDistrictsLoading(true);
      try {
        const response = await locationAPI.getDistricts(form.province_id);
        setDistricts(response.data?.data?.districts || []);
        // Clear district when province changes
        if (form.district_id) {
          setFormValue('district_id', '');
        }
      } catch (error) {
        showError(TOAST_MESSAGES.NETWORK_ERROR);
      } finally {
        setDistrictsLoading(false);
      }
    };
    fetchDistricts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.province_id]);

  // Fetch documents after applicant creation
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!applicantId) return;
      try {
        const response = await documentAPI.getDocuments(applicantId);
        setDocuments(response.data?.data?.documents || {});
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      }
    };
    fetchDocuments();
  }, [applicantId]);

  /**
   * Validate custom business rules
   */
  const validateCustomRules = () => {
    // Check CTM keys are different
    if (form.fina_ctm_key && form.lbd_ctm_key && form.fina_ctm_key === form.lbd_ctm_key) {
      showError(VALIDATION_MESSAGES.CTM_KEYS_MUST_DIFFER);
      return false;
    }

    // Validate date formats
    const dateFields = ['dob', 'issued_date', 'expiry_date'];
    for (const field of dateFields) {
      if (form[field] && isNaN(Date.parse(form[field]))) {
        showError(`${INPUT_LABELS[field.toUpperCase()]} ບໍ່ຖືກຕ້ອງ`);
        return false;
      }
    }

    // Validate enum values
    if (form.relationship_status && !RELATIONSHIP_STATUSES.some(s => s.value === form.relationship_status)) {
      showError('ກະລຸນາເລືອກສະຖານະຄວາມສຳພັນໃຫ້ຖືກຕ້ອງ');
      return false;
    }

    if (form.doc_type && !DOCUMENT_TYPES.some(d => d.value === form.doc_type)) {
      showError('ກະລຸນາເລືອກປະເພດເອກະສານໃຫ້ຖືກຕ້ອງ');
      return false;
    }

    if (form.gender && !GENDERS.some(g => g.value === form.gender)) {
      showError('ກະລຸນາເລືອກເພດໃຫ້ຖືກຕ້ອງ');
      return false;
    }

    return true;
  };

  /**
   * Validate required file uploads
   */
  const validateRequiredFiles = () => {
    const requiredFiles = [
      FILE_TYPES.REGISTRATION_FORM_CREDIT_CARD.value,  // ✅
      FILE_TYPES.REGISTRATION_FORM_GIF_FINA.value,     // ✅
      FILE_TYPES.CUSTOMER_REQUEST_FORM.value,
      FILE_TYPES.REQUEST_EARMARK_ACCOUNT.value,
      FILE_TYPES.FILE_TYP_5.value, // ✅ ເພີ່ມໃໝ່
    ];

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    for (const fileType of requiredFiles) {
      const fileData = files[fileType];  // ✅ fileType ຕອນນີ້ເປັນ string

      if (!fileData) {
        Swal.fire({
          icon: 'warning',
          title: 'ກະລຸນາອັບໂຫຼດຟາຍ!',
          text: `ທ່ານຍັງບໍ່ໄດ້ອັບໂຫຼດ: ${fileType} (ບັງຄັບ)`,  // ✅
          confirmButtonText: 'ຕົກລົງ',
          confirmButtonColor: '#3085d6',
        });
        return false;
      }

      if (fileData.size > MAX_FILE_SIZE) {
        Swal.fire({
          icon: 'error',
          title: 'ຟາຍມີຂະໜາດໃຫຍ່ເກີນໄປ!',
          html: `ຟາຍ <b>"${fileType}"</b> ມີຂະໜາດເກີນ 5 MB.`,  // ✅
          confirmButtonText: 'ຕົກລົງ',
          confirmButtonColor: '#d33',
        });
        return false;
      }
    }

    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!validate()) {
      return;
    }

    // Validate custom business rules
    if (!validateCustomRules()) {
      return;
    }

    // ✅ ເພີ່ມ: ກວດ fileErrors ຈາກ useFileUpload hook
    const hasFileErrors = Object.values(fileErrors).some(err => err);
    if (hasFileErrors) {
      const firstError = Object.values(fileErrors).find(err => err);
      Swal.fire({
        icon: 'error',
        title: 'ຂໍ້ຜິດພາດໄຟລ໌!',
        text: firstError,
        confirmButtonText: 'ຕົກລົງ',
        confirmButtonColor: '#d33',
      });
      return;
    }

    // Validate required files
    if (!validateRequiredFiles()) {
      return;
    }

    // Show confirmation dialog
    const confirmed = await confirm({
      title: DIALOG_MESSAGES.CONFIRM,
      text: 'ທ່ານຕ້ອງການຢືນຢັນບັນທຶກຂໍ້ມູນຜູ້ສະໝັກ ແລະ ອັບໂຫຼດໄຟລ໌ບໍ່?',
    });

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      // Step 1: Create applicant
      const applicantResponse = await applicantAPI.createApplicant(form);
      const newApplicantId = applicantResponse.data?.data?.applicant?.id;

      if (!newApplicantId) {
        throw new Error('Failed to create applicant');
      }

      setApplicantId(newApplicantId);

      // Step 2: Upload documents
      const formData = createFormData({ applicant_id: newApplicantId });
      await documentAPI.uploadDocuments(newApplicantId, formData);

      // Success
      showSuccess(TOAST_MESSAGES.UPLOAD_SUCCESS, `ບັນທຶກຂໍ້ມູນຜູ້ສະໝັກສຳເລັດ (ID: ${newApplicantId})`);

      // Reset form
      reset();
      resetFiles();
      setDistricts([]);

    } catch (error) {
      console.error('Submission error:', error);
      showError(error.response?.data?.message || TOAST_MESSAGES.SAVE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle gender change with checkbox
   */
  const handleGenderChange = (value) => {
    handleDirectChange('gender', value);
  };

  /**
   * Handle file input change
   */
  // const handleFileInputChange = (fileType) => (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     handleFileChange(fileType, file);
  //   }
  // };

  // ✅ Fix 1: handleFileInputChange — ກວດ size ທັນທີ ກ່ອນຈະ set file
  const handleFileInputChange = (fileType) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        // Clear input ທັນທີ
        e.target.value = '';
        Swal.fire({
          icon: 'error',
          title: 'ຟາຍມີຂະໜາດໃຫຍ່ເກີນໄປ!',
          html: `ຟາຍ <b>"${file.name}"</b> ມີຂະໜາດເກີນ 5 MB.<br>
               <span style="color:#d33;">ກະລຸນາເລືອກຟາຍໃໝ່ທີ່ມີຂະໜາດໜ້ອຍກວ່າ 5 MB.</span>`,
          confirmButtonText: 'ຕົກລົງ',
          confirmButtonColor: '#d33',
        });
        return; // ❌ ບໍ່ set file
      }
      handleFileChange(fileType, file);
    }
  };

  /**
   * Handle file clear
   */
  const handleFileClear = (fileType) => () => {
    clearFile(fileType);
    // Reset the file input
    const input = document.getElementById(fileType);
    if (input) {
      input.value = '';
    }
  };

  /**
   * Get field error class
   */
  const getFieldErrorClass = (fieldName) => {
    return errors[fieldName] ? 'border-red-500 animate-pulse' : 'border-gray-300';
  };

  return (
    <div className="font-noto-sans-lao p-6 sm:p-8 max-w-4xl mx-auto bg-slate-50">
      <Card className="shadow-2xl rounded-2xl border-2 border-blue-500">
        <CardHeader className="pb-4 pt-8">
          <CardTitle className="text-3xl font-bold text-center text-blue-800">
            ປ້ອນຂໍ້ມູນເອກະສານ
          </CardTitle>
          <p className="text-center text-gray-500">ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ</p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Uploaded Documents Display */}
          {applicantId && Object.keys(documents).length > 0 && (
            <div className="mb-8 p-6 bg-blue-50 rounded-xl shadow-inner">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">ເອກະສານທີ່ອັບໂຫຼດແລ້ວ</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(documents).map(([key, path]) => (
                  path && (
                    <div key={key}>
                      <Label className="text-gray-600 font-medium">
                        {key.replace(/_/g, ' ').toUpperCase()}
                      </Label>
                      <a
                        href={path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block mt-1 text-sm truncate"
                      >
                        ເບິ່ງເອກະສານ
                      </a>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* CTM Keys */}
              <div className="space-y-2">
                <Label htmlFor="fina_ctm_key" className="text-gray-700 font-semibold">
                  FINA Customer ID
                </Label>
                <Input
                  maxLength={20}
                  id="fina_ctm_key"
                  name="fina_ctm_key"
                  value={form.fina_ctm_key}
                  onChange={handleChange}
                  placeholder={INPUT_LABELS.FINA_CTM_KEY}
                  disabled={isSubmitting}
                  className={`h-10 transition-colors ${getFieldErrorClass('fina_ctm_key')}`}
                />
                {errors.fina_ctm_key && (
                  <p className="text-sm text-red-600">{errors.fina_ctm_key}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lbd_ctm_key" className="text-gray-700 font-semibold">
                  LBB Customer ID <span className="text-red-600">*</span>
                </Label>
                <Input
                  maxLength={20}
                  id="lbd_ctm_key"
                  name="lbd_ctm_key"
                  value={form.lbd_ctm_key}
                  onChange={handleChange}
                  placeholder={INPUT_LABELS.LBD_CTM_KEY}
                  disabled={isSubmitting}
                  required
                  className={`h-10 transition-colors ${getFieldErrorClass('lbd_ctm_key')}`}
                />
                {errors.lbd_ctm_key && (
                  <p className="text-sm text-red-600">{errors.lbd_ctm_key}</p>
                )}
              </div>

              {/* Credit Rating */}
              <div className="space-y-2">
                <Label htmlFor="credit_rating" className="text-gray-700 font-semibold">
                  {INPUT_LABELS.CREDIT_RATING}
                </Label>
                <Input
                  id="credit_rating"
                  name="credit_rating"
                  value={form.credit_rating}
                  onChange={handleChange}
                  placeholder={INPUT_LABELS.CREDIT_RATING}
                  disabled={isSubmitting}
                  className={`h-10 transition-colors ${getFieldErrorClass('credit_rating')}`}
                />
                {errors.credit_rating && (
                  <p className="text-sm text-red-600">{errors.credit_rating}</p>
                )}
              </div>

              {/* Personal Info */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-semibold">
                  {INPUT_LABELS.NAME} <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={INPUT_LABELS.NAME}
                  required
                  disabled={isSubmitting}
                  className={`h-10 transition-colors ${getFieldErrorClass('name')}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="surname" className="text-gray-700 font-semibold">
                  {INPUT_LABELS.SURNAME} <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="surname"
                  name="surname"
                  value={form.surname}
                  onChange={handleChange}
                  placeholder={INPUT_LABELS.SURNAME}
                  required
                  disabled={isSubmitting}
                  className={`h-10 transition-colors ${getFieldErrorClass('surname')}`}
                />
                {errors.surname && (
                  <p className="text-sm text-red-600">{errors.surname}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob" className="text-gray-700 font-semibold">
                  {INPUT_LABELS.DOB} <span className="text-red-600">*</span>
                </Label>
                <DateInput
                  id="dob"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="h-10"
                  placeholder="dd/mm/yyyy"
                />
                {errors.dob && (
                  <p className="text-sm text-red-600">{errors.dob}</p>
                )}
              </div>

              {/* Village */}
              <div className="space-y-2">
                <Label htmlFor="village" className="text-gray-700 font-semibold">
                  {INPUT_LABELS.VILLAGE} <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="village"
                  name="village"
                  value={form.village}
                  onChange={handleChange}
                  placeholder={INPUT_LABELS.VILLAGE}
                  required
                  disabled={isSubmitting}
                  className={`h-10 transition-colors ${getFieldErrorClass('village')}`}
                />
                {errors.village && (
                  <p className="text-sm text-red-600">{errors.village}</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold">
                  {INPUT_LABELS.GENDER} <span className="text-red-600">*</span>
                </Label>
                <div className={`flex space-x-6 p-2 rounded-md transition-colors ${getFieldErrorClass('gender')}`}>
                  {GENDERS.map((gender) => (
                    <div key={gender.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`gender-${gender.value}`}
                        checked={form.gender === gender.value}
                        onCheckedChange={() => handleGenderChange(gender.value)}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor={`gender-${gender.value}`} className="text-gray-600 cursor-pointer">
                        {gender.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-sm text-red-600">{errors.gender}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="province_id" className="text-gray-700 font-semibold">
                  {INPUT_LABELS.PROVINCE} <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={form.province_id}
                  onValueChange={(value) => handleDirectChange('province_id', value)}
                  disabled={isSubmitting || provincesLoading || provinces.length === 0}
                >
                  <SelectTrigger className={`h-10 transition-colors ${getFieldErrorClass('province_id')}`}>
                    <SelectValue placeholder={INPUT_LABELS.SEARCH} />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province.id} value={province.id.toString()}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.province_id && (
                  <p className="text-sm text-red-600">{errors.province_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="district_id" className="text-gray-700 font-semibold">
                  {INPUT_LABELS.DISTRICT} <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={form.district_id}
                  onValueChange={(value) => handleDirectChange('district_id', value)}
                  disabled={isSubmitting || districtsLoading || !form.province_id || districts.length === 0}
                >
                  <SelectTrigger className={`h-10 transition-colors ${getFieldErrorClass('district_id')}`}>
                    <SelectValue placeholder={INPUT_LABELS.SEARCH} />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district.id} value={district.id.toString()}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.district_id && (
                  <p className="text-sm text-red-600">{errors.district_id}</p>
                )}
              </div>

              {/* Relationship Status */}
              <div className="space-y-2">
                <Label htmlFor="relationship_status" className="text-gray-700 font-semibold">
                  {INPUT_LABELS.RELATIONSHIP_STATUS} <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={form.relationship_status}
                  onValueChange={(value) => handleDirectChange('relationship_status', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className={`h-10 transition-colors ${getFieldErrorClass('relationship_status')}`}>
                    <SelectValue placeholder={INPUT_LABELS.SEARCH} />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIP_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.relationship_status && (
                  <p className="text-sm text-red-600">{errors.relationship_status}</p>
                )}
              </div>

              {/* Document Type */}
              <div className="space-y-2">
                <Label htmlFor="doc_type" className="text-gray-700 font-semibold">
                  {INPUT_LABELS.DOC_TYPE} <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={form.doc_type}
                  onValueChange={(value) => handleDirectChange('doc_type', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className={`h-10 transition-colors ${getFieldErrorClass('doc_type')}`}>
                    <SelectValue placeholder={INPUT_LABELS.SEARCH} />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.doc_type && (
                  <p className="text-sm text-red-600">{errors.doc_type}</p>
                )}
              </div>

              {/* Document Number */}
              <div className="space-y-2">
                <Label htmlFor="doc_number" className="text-gray-700 font-semibold">
                  {INPUT_LABELS.DOC_NUMBER} <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="doc_number"
                  name="doc_number"
                  value={form.doc_number}
                  onChange={handleChange}
                  placeholder={INPUT_LABELS.DOC_NUMBER}
                  required
                  disabled={isSubmitting}
                  className={`h-10 transition-colors ${getFieldErrorClass('doc_number')}`}
                />
                {errors.doc_number && (
                  <p className="text-sm text-red-600">{errors.doc_number}</p>
                )}
              </div>

              {/* Issued By */}
              <div className="space-y-2">
                <Label htmlFor="issued_by" className="text-gray-700 font-semibold">
                  {INPUT_LABELS.ISSUED_BY} <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="issued_by"
                  name="issued_by"
                  value={form.issued_by}
                  onChange={handleChange}
                  placeholder={INPUT_LABELS.ISSUED_BY}
                  required
                  disabled={isSubmitting}
                  className={`h-10 transition-colors ${getFieldErrorClass('issued_by')}`}
                />
                {errors.issued_by && (
                  <p className="text-sm text-red-600">{errors.issued_by}</p>
                )}
              </div>

              {/* Document Dates */}
              <div className="space-y-2">
                <Label htmlFor="issued_date" className="text-gray-700 font-semibold">
                  {INPUT_LABELS.ISSUED_DATE} <span className="text-red-600">*</span>
                </Label>
                <DateInput
                  id="issued_date"
                  name="issued_date"
                  value={form.issued_date}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="h-10"
                  placeholder="dd/mm/yyyy"
                />
                {errors.issued_date && (
                  <p className="text-sm text-red-600">{errors.issued_date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_date" className="text-gray-700 font-semibold">
                  {INPUT_LABELS.EXPIRY_DATE} <span className="text-red-600">*</span>
                </Label>
                <DateInput
                  id="expiry_date"
                  name="expiry_date"
                  value={form.expiry_date}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="h-10"
                  placeholder="yyyy/mm/dd"
                />
                {errors.expiry_date && (
                  <p className="text-sm text-red-600">{errors.expiry_date}</p>
                )}
              </div>

              {/* File Uploads */}
              {Object.values(FILE_TYPES).map((fileType) => {
                const isRequired = [
                  FILE_TYPES.REGISTRATION_FORM_CREDIT_CARD.value,
                  FILE_TYPES.REGISTRATION_FORM_GIF_FINA.value,
                  FILE_TYPES.CUSTOMER_REQUEST_FORM.value,
                  FILE_TYPES.REQUEST_EARMARK_ACCOUNT.value,
                  FILE_TYPES.FILE_TYP_5.value, // ✅ ເພີ່ມໃໝ່
                ].includes(fileType.value);

                return (
                  <div key={fileType.value} className="space-y-2">
                    <Label htmlFor={fileType.value} className="text-gray-700 font-semibold">
                      {fileType.label}
                      {isRequired && <span className="text-red-600"> *</span>}
                    </Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="file"
                        id={fileType.value}
                        name={fileType.value}
                        accept="application/pdf"
                        onChange={handleFileInputChange(fileType.value)}
                        disabled={isSubmitting}
                        required={isRequired}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 h-10"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={handleFileClear(fileType.value)}
                        disabled={isSubmitting || !files[fileType.value]}
                        className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600"
                      >
                        X
                      </Button>
                    </div>
                    {files[fileType.value] && (
                      <p className="text-sm text-gray-600 mt-2 truncate">
                        ໄຟລ໌ທີ່ເລືອກ: {files[fileType.value].name}
                      </p>
                    )}
                    {fileErrors[fileType.value] && (
                      <p className="text-sm text-red-600">{fileErrors[fileType.value]}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກຂໍ້ມູນຜູ້ສະໝັກ ແລະ ອັບໂຫຼດໄຟລ໌'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataEntry;