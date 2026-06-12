/**
 * Applicant Edit Form Component (Refactored)
 * Edit existing applicant with document management
 * Using senior-level React patterns with hooks and API services
 */
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import DateInput from '@/components/common/DateInput';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Hooks
import { useForm } from '@/hooks/form/useForm';
import { useFileUpload } from '@/hooks/form/useFileUpload';
import { useToast } from '@/hooks/ui/useToast';
import { useConfirmDialog } from '@/hooks/ui/useConfirmDialog';

// API Services
import { applicantAPI } from '@/api/applicant.api';
import { documentAPI } from '@/api/document.api';
import { locationAPI } from '@/api/location.api';

// Constants
import {
  INPUT_LABELS,
  VALIDATION_MESSAGES,
  TOAST_MESSAGES,
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

const ApplicantEditForm = ({
  open,
  onOpenChange,
  report,
  provinces,
  districts,
  setDistricts,
  setSelectedProvinceId,
  fetchReports,
}) => {
  const { applicant_id } = report || {};
  const { showSuccess, showError } = useToast();
  const { confirm, confirmDelete: confirmDeleteDialog } = useConfirmDialog();

  // Form state management
  const { form, errors, handleChange, handleDirectChange, validate, reset, setFormValues, setFormValue } = useForm(
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
    setFiles,
  } = useFileUpload({
    ...FILE_UPLOAD_CONFIG,
    allowedTypes: ['application/pdf'],
  });

  // Component state
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [documents, setDocuments] = React.useState({});

  // Fetch applicant data on mount or when applicant_id changes
  useEffect(() => {
    const fetchApplicant = async () => {
      if (!applicant_id) return;
      setIsLoading(true);
      try {
        const response = await applicantAPI.getApplicantById(applicant_id);
        const { applicant, documents: applicantDocuments } = response.data?.data || {};

        if (applicant) {
          setFormValues({
            fina_ctm_key: applicant.fina_ctm_key || '',
            lbd_ctm_key: applicant.lbd_ctm_key || '',
            credit_rating: applicant.credit_rating || '',
            name: applicant.name || '',
            surname: applicant.surname || '',
            dob: applicant.dob ? new Date(applicant.dob).toISOString().split('T')[0] : '',
            village: applicant.village || '',
            gender: applicant.gender || '',
            province_id: applicant.province_id?.toString() || '',
            district_id: applicant.district_id?.toString() || '',
            relationship_status: applicant.relationship_status || '',
            doc_type: applicant.doc_type || '',
            doc_number: applicant.doc_number || '',
            issued_by: applicant.issued_by || '',
            issued_date: applicant.issued_date ? new Date(applicant.issued_date).toISOString().split('T')[0] : '',
            expiry_date: applicant.expiry_date ? new Date(applicant.expiry_date).toISOString().split('T')[0] : '',
          });

          setDocuments(applicantDocuments || {});
          setSelectedProvinceId?.(applicant.province_id);
        }
      } catch (error) {
        console.error('Error fetching applicant:', error);
        showError(error.response?.data?.message || 'ບໍ່ສາມາດດຶງຂໍ້ມູນຜູ້ສະໝັກໄດ້');
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplicant();
  }, [applicant_id, setFormValues, setSelectedProvinceId, showError]);

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
    if (form.relationship_status && !RELATIONSHIP_STATUSES.some((s) => s.value === form.relationship_status)) {
      showError('ກະລຸນາເລືອກສະຖານະຄວາມສຳພັນໃຫ້ຖືກຕ້ອງ');
      return false;
    }

    if (form.doc_type && !DOCUMENT_TYPES.some((d) => d.value === form.doc_type)) {
      showError('ກະລຸນາເລືອກປະເພດເອກະສານໃຫ້ຖືກຕ້ອງ');
      return false;
    }

    if (form.gender && !GENDERS.some((g) => g.value === form.gender)) {
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
      FILE_TYPES.REGISTRATION_FORM_CREDIT_CARD,
      FILE_TYPES.REGISTRATION_FORM_GIF_FINA,
    ];

    for (const fileType of requiredFiles) {
      const hasFile = files[fileType] || documents[fileType];
      if (!hasFile) {
        showError(`ກະລຸນາອັບໂຫຼດ ${fileType} (ບັງຄັບ)`);
        return false;
      }
    }

    return true;
  };

  /**
   * Handle province change
   */
  const handleProvinceChange = async (value) => {
    setFormValue('province_id', value);
    setFormValue('district_id', '');
    setSelectedProvinceId?.(value);

    if (value) {
      try {
        setIsLoading(true);
        const response = await locationAPI.getDistricts(value);
        setDistricts?.(response.data?.data?.districts || []);
      } catch (error) {
        showError('ບໍ່ສາມາດດຶງຂໍ້ມູນເມືອງໄດ້');
      } finally {
        setIsLoading(false);
      }
    } else {
      setDistricts?.([]);
    }
  };

  /**
   * Handle file input change
   */
  const handleFileInputChange = (fileType) => (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange(fileType, file);
    }
  };

  /**
   * Handle file delete
   */
  const handleFileDelete = async (fileType) => {
    const confirmed = await confirmDeleteDialog(fileType);
    if (!confirmed) return;

    try {
      await documentAPI.deleteDocument(applicant_id, fileType);
      setDocuments((prev) => ({ ...prev, [fileType]: null }));
      setFiles((prev) => ({ ...prev, [fileType]: null }));
      showSuccess(TOAST_MESSAGES.DELETE_SUCCESS);
      fetchReports?.();
    } catch (error) {
      showError(error.response?.data?.message || TOAST_MESSAGES.DELETE_FAILED);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    // Validate form fields
    if (!validate()) {
      return;
    }

    // Validate custom business rules
    if (!validateCustomRules()) {
      return;
    }

    // Validate required files
    if (!validateRequiredFiles()) {
      return;
    }

    // Show confirmation dialog
    const confirmed = await confirm({
      title: 'ຢືນຢັນການບັນທຶກ',
      text: 'ທ່ານຕ້ອງການບັນທຶກການແກ້ໄຂນີ້ບໍ?',
    });

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      // Step 1: Update applicant
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // Add files to form data
      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      await applicantAPI.updateApplicant(applicant_id, formData);

      // Reset files state
      resetFiles();

      // Fetch updated documents
      const response = await documentAPI.getDocuments(applicant_id);
      setDocuments(response.data?.data?.documents || {});

      showSuccess(TOAST_MESSAGES.UPDATE_SUCCESS);
      fetchReports?.();
    } catch (error) {
      console.error('Error updating applicant:', error);
      showError(error.response?.data?.message || TOAST_MESSAGES.SAVE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle dialog close
   */
  const handleDialogClose = (isOpen) => {
    if (!isOpen && !isSubmitting) {
      // Check if there are unsaved changes
      const hasChanges = Object.keys(files).some((key) => files[key] !== null);
      if (hasChanges) {
        confirm({
          title: 'ຍົກເລີກການແກ້ໄຂ',
          text: 'ທ່ານຕ້ອງການຍົກເລີກການແກ້ໄຂບໍ? ການປ່ຽນແປງຈະບໍ່ຖືກບັນທຶກ',
        }).then((confirmed) => {
          if (confirmed) {
            reset();
            resetFiles();
            onOpenChange(false);
          }
        });
      } else {
        onOpenChange(false);
      }
    } else {
      onOpenChange(true);
    }
  };

  /**
   * Get field error class
   */
  const getFieldErrorClass = (fieldName) => {
    return errors[fieldName] ? 'border-red-500 animate-pulse' : 'border-gray-300';
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-4xl font-noto-sans-lao animate-in fade-in duration-300 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-800">ແກ້ໄຂຂໍ້ມູນຜູ້ສະໝັກ</DialogTitle>
          </DialogHeader>

          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-blue-700">ຂໍ້ມູນຜູ້ສະໝັກ</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <LoadingSpinner />}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* CTM Keys */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700">FINA CTM ID</Label>
                  <Input
                    name="fina_ctm_key"
                    value={form.fina_ctm_key}
                    onChange={handleChange}
                    className={`mt-1 h-10 transition-colors ${getFieldErrorClass('fina_ctm_key')}`}
                  />
                  {errors.fina_ctm_key && <p className="text-sm text-red-600 mt-1">{errors.fina_ctm_key}</p>}
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    LBD CTM ID <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    name="lbd_ctm_key"
                    value={form.lbd_ctm_key}
                    onChange={handleChange}
                    required
                    className={`mt-1 h-10 transition-colors ${getFieldErrorClass('lbd_ctm_key')}`}
                  />
                  {errors.lbd_ctm_key && <p className="text-sm text-red-600 mt-1">{errors.lbd_ctm_key}</p>}
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700">{INPUT_LABELS.CREDIT_RATING}</Label>
                  <Input
                    name="credit_rating"
                    value={form.credit_rating}
                    onChange={handleChange}
                    className={`mt-1 h-10 transition-colors ${getFieldErrorClass('credit_rating')}`}
                  />
                  {errors.credit_rating && <p className="text-sm text-red-600 mt-1">{errors.credit_rating}</p>}
                </div>

                {/* Personal Info */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    {INPUT_LABELS.NAME} <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={`mt-1 h-10 transition-colors ${getFieldErrorClass('name')}`}
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    {INPUT_LABELS.SURNAME} <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    name="surname"
                    value={form.surname}
                    onChange={handleChange}
                    required
                    className={`mt-1 h-10 transition-colors ${getFieldErrorClass('surname')}`}
                  />
                  {errors.surname && <p className="text-sm text-red-600 mt-1">{errors.surname}</p>}
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    {INPUT_LABELS.DOB} <span className="text-red-600">*</span>
                  </Label>
                  <DateInput
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    placeholder="dd/mm/yyyy"
                    required
                    className="mt-1 h-10"
                  />
                  {errors.dob && <p className="text-sm text-red-600 mt-1">{errors.dob}</p>}
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    {INPUT_LABELS.VILLAGE} <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    name="village"
                    value={form.village}
                    onChange={handleChange}
                    required
                    className={`mt-1 h-10 transition-colors ${getFieldErrorClass('village')}`}
                  />
                  {errors.village && <p className="text-sm text-red-600 mt-1">{errors.village}</p>}
                </div>

                {/* Gender */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    {INPUT_LABELS.GENDER} <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    name="gender"
                    value={form.gender}
                    onValueChange={(value) => handleDirectChange('gender', value)}
                    required
                  >
                    <SelectTrigger className={`mt-1 h-10 transition-colors ${getFieldErrorClass('gender')}`}>
                      <SelectValue placeholder="ເລືອກເພດ" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((gender) => (
                        <SelectItem key={gender.value} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-sm text-red-600 mt-1">{errors.gender}</p>}
                </div>

                {/* Location */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    {INPUT_LABELS.PROVINCE} <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    value={form.province_id}
                    onValueChange={handleProvinceChange}
                    required
                    disabled={isLoading}
                  >
                    <SelectTrigger className={`mt-1 h-10 transition-colors ${getFieldErrorClass('province_id')}`}>
                      <SelectValue placeholder="ເລືອກແຂວງ" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(provinces) && provinces.length > 0 ? (
                        provinces.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-provinces" disabled>
                          ບໍ່ມີຂໍ້ມູນແຂວງ
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.province_id && <p className="text-sm text-red-600 mt-1">{errors.province_id}</p>}
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    {INPUT_LABELS.DISTRICT} <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    name="district_id"
                    value={form.district_id}
                    onValueChange={(value) => handleDirectChange('district_id', value)}
                    required
                    disabled={!form.province_id || !Array.isArray(districts) || districts.length === 0 || isLoading}
                  >
                    <SelectTrigger className={`mt-1 h-10 transition-colors ${getFieldErrorClass('district_id')}`}>
                      <SelectValue placeholder="ເລືອກເມືອງ" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(districts) && districts.length > 0 ? (
                        districts.map((d) => (
                          <SelectItem key={d.id} value={d.id.toString()}>
                            {d.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-districts" disabled>
                          ບໍ່ມີຂໍ້ມູນເມືອງ
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.district_id && <p className="text-sm text-red-600 mt-1">{errors.district_id}</p>}
                </div>

                {/* Relationship Status */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    {INPUT_LABELS.RELATIONSHIP_STATUS} <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    name="relationship_status"
                    value={form.relationship_status}
                    onValueChange={(value) => handleDirectChange('relationship_status', value)}
                    required
                  >
                    <SelectTrigger className={`mt-1 h-10 transition-colors ${getFieldErrorClass('relationship_status')}`}>
                      <SelectValue placeholder="ເລືອກສະຖານະ" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIP_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.relationship_status && <p className="text-sm text-red-600 mt-1">{errors.relationship_status}</p>}
                </div>

                {/* Document Type */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    {INPUT_LABELS.DOC_TYPE} <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    name="doc_type"
                    value={form.doc_type}
                    onValueChange={(value) => handleDirectChange('doc_type', value)}
                    required
                  >
                    <SelectTrigger className={`mt-1 h-10 transition-colors ${getFieldErrorClass('doc_type')}`}>
                      <SelectValue placeholder="ເລືອກປະເພດເອກະສານ" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.doc_type && <p className="text-sm text-red-600 mt-1">{errors.doc_type}</p>}
                </div>

                {/* Document Number */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    {INPUT_LABELS.DOC_NUMBER} <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    name="doc_number"
                    value={form.doc_number}
                    onChange={handleChange}
                    required
                    className={`mt-1 h-10 transition-colors ${getFieldErrorClass('doc_number')}`}
                  />
                  {errors.doc_number && <p className="text-sm text-red-600 mt-1">{errors.doc_number}</p>}
                </div>

                {/* Issued By */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    {INPUT_LABELS.ISSUED_BY} <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    name="issued_by"
                    value={form.issued_by}
                    onChange={handleChange}
                    required
                    className={`mt-1 h-10 transition-colors ${getFieldErrorClass('issued_by')}`}
                  />
                  {errors.issued_by && <p className="text-sm text-red-600 mt-1">{errors.issued_by}</p>}
                </div>

                {/* Document Dates */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    {INPUT_LABELS.ISSUED_DATE} <span className="text-red-600">*</span>
                  </Label>
                  <DateInput
                    name="issued_date"
                    value={form.issued_date}
                    onChange={handleChange}
                    placeholder="dd/mm/yyyy"
                    required
                    className="mt-1 h-10"
                  />
                  {errors.issued_date && <p className="text-sm text-red-600 mt-1">{errors.issued_date}</p>}
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    {INPUT_LABELS.EXPIRY_DATE} <span className="text-red-600">*</span>
                  </Label>
                  <DateInput
                    name="expiry_date"
                    value={form.expiry_date}
                    onChange={handleChange}
                    placeholder="dd/mm/yyyy"
                    required
                    className="mt-1 h-10"
                  />
                  {errors.expiry_date && <p className="text-sm text-red-600 mt-1">{errors.expiry_date}</p>}
                </div>

                {/* File Uploads */}
                {Object.values(FILE_TYPES).map((fileType) => {
                  const isRequired = [
                    FILE_TYPES.REGISTRATION_FORM_CREDIT_CARD,
                    FILE_TYPES.REGISTRATION_FORM_GIF_FINA,
                  ].includes(fileType);

                  const fileLabel = fileType
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase());

                  return (
                    <div key={fileType}>
                      <Label className="block text-sm font-medium text-gray-700">
                        {fileLabel} (PDF{isRequired && ', ບັງຄັບ'})
                        {isRequired && <span className="text-red-600"> *</span>}
                      </Label>
                      <Input
                        type="file"
                        accept=".pdf"
                        name={fileType}
                        onChange={handleFileInputChange(fileType)}
                        required={isRequired}
                        className="mt-1 h-10 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                      />
                      {/* Existing document link */}
                      {documents[fileType] && (
                        <div className="flex items-center justify-between mt-1">
                          <a
                            href={documents[fileType]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm truncate"
                          >
                            {documents[fileType].split('/').pop()}
                          </a>
                          <button
                            onClick={() => handleFileDelete(fileType)}
                            className="text-red-600 hover:text-red-800 text-sm rounded-full ml-2"
                            title="ລົບໄຟລ໌"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                      {/* Newly selected file */}
                      {files[fileType] && (
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          ເລືອກແລ້ວ: {files[fileType].name}
                        </p>
                      )}
                      {fileErrors[fileType] && (
                        <p className="text-sm text-red-600 mt-1">{fileErrors[fileType]}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="mt-4 sm:flex sm:flex-row sm:justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => handleDialogClose(false)}
              disabled={isSubmitting}
              className="h-10 px-6 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 font-noto-sans-lao"
            >
              ຍົກເລີກ
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white flex items-center transition-colors duration-200 active:scale-95 font-noto-sans-lao"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  ກຳລັງບັນທຶກ...
                </>
              ) : (
                'ບັນທຶກ'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicantEditForm;
