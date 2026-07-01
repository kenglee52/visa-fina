import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API_BASE_URL } from '@/config/env.config';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Swal from 'sweetalert2';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import axios from 'axios';
// import { url } from '@/componet/unity/Part';
import { ArrowLeft } from 'lucide-react';

// Custom DateInput component for dd/mm/yyyy display with native date picker
const DateInput = ({ name, value, onChange, required, className, placeholder }) => {
  const dateInputRef = React.useRef(null);

  // Convert yyyy-mm-dd to dd/mm/yyyy for display
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  // Handle click on text input to open native date picker
  const handleClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  // Handle date selection from native date picker
  const handleDatePickerChange = (e) => {
    const isoDate = e.target.value; // yyyy-mm-dd from date picker
    if (isoDate) {
      if (isNaN(Date.parse(isoDate))) {
        onChange({ target: { name, value: '' } });
        return;
      }
      onChange({ target: { name, value: isoDate } });
    } else {
      onChange({ target: { name, value: '' } });
    }
  };

  // Handle manual text input in dd/mm/yyyy format
  const handleTextChange = (e) => {
    const textValue = e.target.value;
    if (textValue === '') {
      onChange({ target: { name, value: '' } });
      return;
    }
    // Validate dd/mm/yyyy format
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(textValue)) {
      return; // Don't update state until valid format
    }
    const [day, month, year] = textValue.split('/');
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    if (isNaN(Date.parse(isoDate))) {
      onChange({ target: { name, value: '' } });
      return;
    }
    onChange({ target: { name, value: isoDate } });
  };

  return (
    <div className="relative">
      <Input
        type="text"
        name={name}
        value={formatDateForInput(value)}
        onChange={handleTextChange}
        onClick={handleClick}
        placeholder={placeholder}
        required={required}
        className={className}
      />
      <input
        type="date"
        ref={dateInputRef}
        onChange={handleDatePickerChange}
        value={value}
        className="absolute opacity-0 w-0 h-0"
      />
    </div>
  );
};

const CustomAlertDialog = ({ open, onConfirm, onCancel, title, message, confirmText, cancelText }) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md font-noto-sans-lao z-[60]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-blue-800">{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="py-4 text-center">
          <p className="text-base text-gray-700">{message}</p>
        </div>
        <AlertDialogFooter className="flex justify-end gap-2">
          {onCancel && (
            <AlertDialogCancel onClick={onCancel} className="font-noto-sans-lao">
              {cancelText || 'ຍົກເລີກ'}
            </AlertDialogCancel>
          )}
          {onConfirm && (
            <AlertDialogAction onClick={onConfirm} className="bg-blue-600 hover:bg-blue-700 font-noto-sans-lao">
              {confirmText || 'ຢືນຢັນ'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const EditApplicant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
  });
  const [files, setFiles] = useState({
    customer_request_form: null,
    request_earmark_account: null,
    registration_form_credit_card: null,
    registration_form_gif_fina: null,
    file_typ_5: null, // ✅ ເພີ່ມ

  });
  const [documents, setDocuments] = useState({
    customer_request_form: null,
    request_earmark_account: null,
    registration_form_credit_card: null,
    registration_form_gif_fina: null,
    file_typ_5: null, // ✅ ເພີ່ມ
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [fileToDelete, setFileToDelete] = useState(null);
  const [error, setError] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const fetchApplicant = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/applicant/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { applicant, documents } = response.data.data || {};
        setFormData({
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
        setDocuments(documents || {
          customer_request_form: null,
          request_earmark_account: null,
          registration_form_credit_card: null,
          registration_form_gif_fina: null,
          file_typ_5: null, // ✅ ເພີ່ມ
        });

        // Fetch provinces
        const provincesResponse = await axios.get(`${API_BASE_URL}/api/provinces`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProvinces(provincesResponse.data.data?.provinces || []);

        // Fetch districts if province exists
        if (applicant.province_id) {
          const districtsResponse = await axios.get(`${API_BASE_URL}/api/districts/${applicant.province_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDistricts(districtsResponse.data.data?.districts || []);
        }
      } catch (err) {
        console.error('Error fetching applicant:', err);
        setDialogTitle('ຂໍ້ຜິດພາດ');
        setDialogMessage(err.response?.data?.message || 'ບໍ່ສາມາດດຶງຂໍ້ມູນຜູ້ສະໝັກໄດ້');
        setIsErrorDialogOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplicant();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;

    // ຖ້າຄ່າຖືກສົ່ງມາເປັນ YYYY-MM-DD ຈາກ Date Picker ຢູ່ແລ້ວ ໃຫ້ອັບເດດເລີຍ
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setError('');
      return;
    }

    // ຖ້າເປັນຄ່າວ່າງ
    if (!value) {
      setFormData((prev) => ({ ...prev, [name]: '' }));
      return;
    }

    // ຖ້າເປັນການພິມ ແລະ ພິມຄົບ 10 ຫຼັກ (dd/mm/yyyy)
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [day, month, year] = value.split('/');
      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      if (!isNaN(Date.parse(isoDate))) {
        setFormData((prev) => ({ ...prev, [name]: isoDate }));
        setError('');
        return;
      }
    }

    // ຖ້າຮູບແບບຍັງບໍ່ຄົບ ໃຫ້ເກັບຄ່າຊົ່ວຄາວໄວ້ກ່ອນ (ເພື່ອບໍ່ໃຫ້ປຸ່ມພິມຄ້າງ)
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const [invalidFiles, setInvalidFiles] = useState({
    customer_request_form: false,
    request_earmark_account: false,
    registration_form_credit_card: false,
    registration_form_gif_fina: false,
    file_typ_5: false, // ✅ ເພີ່ມ
  });
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];

    if (file && file.type !== 'application/pdf') {
      e.target.value = '';
      setFiles((prev) => ({ ...prev, [fileType]: null }));
      setInvalidFiles((prev) => ({ ...prev, [fileType]: false }));
      setDialogTitle('ຂໍ້ຜິດພາດ');
      setDialogMessage(`ກະລຸນາອັບໂຫຼດໄຟລ໌ PDF ສຳລັບ ${fileType}`);
      setIsErrorDialogOpen(true);
      return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
      e.target.value = '';
      setFiles((prev) => ({ ...prev, [fileType]: null }));
      setInvalidFiles((prev) => ({ ...prev, [fileType]: true })); // ✅ mark invalid
      setDialogTitle('ຂໍ້ຜິດພາດ');
      setDialogMessage(`ໄຟລ໌ ${fileType} ມີຂະໜາດໃຫຍ່ເກີນ 5MB. ກະລຸນາເລືອກໄຟລ໌ໃໝ່`);
      setIsErrorDialogOpen(true);
      return;
    }

    // ✅ valid
    setFiles((prev) => ({ ...prev, [fileType]: file }));
    setInvalidFiles((prev) => ({ ...prev, [fileType]: false }));
    setError('');
  };

  const handleDeleteFile = (fileType) => {
    setFileToDelete(fileType);
    setDialogTitle('ຢືນຢັນການລົບ');
    setDialogMessage(`ທ່ານຕ້ອງການລົບໄຟລ໌ ${fileType} ບໍ່?`);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteConfirmOpen(false);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/delete-document/${id}/${fileToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments((prev) => ({ ...prev, [fileToDelete]: null }));
      setFiles((prev) => ({ ...prev, [fileToDelete]: null }));
      setInvalidFiles((prev) => ({ ...prev, [fileToDelete]: false })); // ✅ ເພີ່ມບ່ອນນີ້

      // ✅ ລົບສຳເລັດ: ສະແດງ popup ແຕ່ບໍ່ navigate ອອກ
      setDialogTitle('ສຳເລັດ');
      setDialogMessage(`ໄຟລ໌ ${fileToDelete} ຖືກລົບສຳເລັດ`);
      setShouldNavigateToFollow(false); // ← ຢູ່ໜ້ານີ້ຕໍ່
      setIsResultDialogOpen(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'ບໍ່ສາມາດລົບໄຟລ໌ໄດ້';
      setDialogTitle('ຂໍ້ຜິດພາດ');
      setDialogMessage(errorMessage);
      setShouldNavigateToFollow(false);
      setIsResultDialogOpen(true);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    }
    setFileToDelete(null);
  };

  const handleProvinceChange = async (value) => {
    setFormData((prev) => ({ ...prev, province_id: value, district_id: '' }));
    if (value) {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/districts/${value}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDistricts(response.data.data?.districts || []);
      } catch (err) {
        console.error('Error fetching districts:', err);
        setDialogTitle('ຂໍ້ຜິດພາດ');
        setDialogMessage('ບໍ່ສາມາດດຶງຂໍ້ມູນເມືອງໄດ້');
        setIsErrorDialogOpen(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      setDistricts([]);
    }
  };

  const getFieldError = (fieldLabel) => {
    return error.includes(fieldLabel) ? 'border-red-500 animate-pulse' : '';
  };

  const validateForm = () => {
    const requiredFields = [
      { key: 'lbd_ctm_key', label: 'LBD CTM ID' },
      { key: 'name', label: 'ຊື່' },
      { key: 'surname', label: 'ນາມສະກຸນ' },
      { key: 'dob', label: 'ວັນເດືອນປີເກີດ' },
      { key: 'village', label: 'ບ້ານ' },
      { key: 'gender', label: 'ເພດ' },
      { key: 'province_id', label: 'ແຂວງ' },
      { key: 'district_id', label: 'ເມືອງ' },
      { key: 'relationship_status', label: 'ສະຖານະຄວາມສຳພັນ' },
      { key: 'doc_type', label: 'ປະເພດເອກະສານ' },
      { key: 'doc_number', label: 'ເລກທີ່ເອກະສານ' },
      { key: 'issued_by', label: 'ຜູ້ອອກເອກະສານ' },
      { key: 'issued_date', label: 'ວັນທີ່ອອກ' },
      { key: 'expiry_date', label: 'ວັນທີ່ໝົດອາຍຸ' },
    ];

    for (const { key, label } of requiredFields) {
      if (!formData[key]) {
        return `ກະລຸນາປ້ອນ ${label}`;
      }
    }

    if (isNaN(Date.parse(formData.dob)) || isNaN(Date.parse(formData.issued_date)) || isNaN(Date.parse(formData.expiry_date))) {
      return 'ຮສູບແບບວັນທີ່ບໍ່ຖືກຕ້ອງ (ວັນເດືອນປີເກີດ, ວັນທີ່ອອກ, ຫຼືວັນທີ່ໝົດອາຍຸ)';
    }

    if (!['single', 'married', 'divorced', 'widowed'].includes(formData.relationship_status)) {
      return 'ກະລຸນາເລືອກສະຖານະຄວາມສຳພັນໃຫ້ຖືກຕ້ອງ';
    }

    if (!['passport', 'id_card', 'family_book', 'other'].includes(formData.doc_type)) {
      return 'ກະລຸນາເລືອກປະເພດເອກະສານໃຫ້ຖືກຕ້ອງ';
    }

    if (!['male', 'female'].includes(formData.gender)) {
      return 'ກະລຸນາເລືອກເພດໃຫ້ຖືກຕ້ອງ';
    }

    if (formData.fina_ctm_key && formData.lbd_ctm_key && formData.fina_ctm_key === formData.lbd_ctm_key) {
      return 'FINA CTM ID ແລະ LBB CTM ID ຕ້ອງບໍ່ຊ້ຳກັນ';
    }

    // ✅ ແທນ 2 if ສຸດທ້າຍເກົ່າດ້ວຍໂຕນີ້
    const requiredFileTypes = [
      { key: 'registration_form_credit_card', label: 'ແບບຟອມລົງທະບຽນບັດເຄຣດິດ' },
      { key: 'registration_form_gif_fina', label: 'ແບບຟອມລົງທະບຽນ GIF FINA' },
      { key: 'customer_request_form', label: 'ແບບຟອມຄຳຂໍຂອງລູກຄ້າ' },        // ✅ ເພີ່ມ
      { key: 'request_earmark_account', label: 'ໃບສະເໜີຂໍ Block ບັນຊີ' },
      { key: 'file_typ_5', label: 'ຊື່ໄຟລ໌ 5' }, // ✅ ເພີ່ມ
    ];

    for (const { key, label } of requiredFileTypes) {
      // ກວດໄຟລ໌ >5MB ທີ່ຖືກ reject
      if (invalidFiles[key]) {
        return `ໄຟລ໌ ${label} ໃຫຍ່ກວ່າ 5MB. ກະລຸນາເລືອກໄຟລ໌ໃໝ່`;
      }
      // ກວດວ່າບໍ່ມີທັງ file ໃໝ່ ແລະ document ເກົ່າ
      if (!files[key] && !documents[key]) {
        return `ກະລຸນາອັບໂຫຼດ ${label} (ບັງຄັບ)`;
      }
    }

    return '';
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setDialogTitle('ຂໍ້ຜິດພາດ');
      setDialogMessage(validationError);
      setIsErrorDialogOpen(true);
      return;
    }
    setDialogTitle('ຢືນຢັນການບັນທຶກ');
    setDialogMessage('ທ່ານຕ້ອງການບັນທຶກການແກ້ໄຂນີ້ບໍ?');
    setIsConfirmDialogOpen(true);
  };

  const handleCancelConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
  };

  const handleSubmission = async () => {
    setIsConfirmDialogOpen(false);
    setIsSubmitting(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    const validFileTypes = ['customer_request_form', 'request_earmark_account', 'registration_form_credit_card', 'registration_form_gif_fina', 'file_typ_5',];
    Object.entries(files).forEach(([key, file]) => {
      if (file && validFileTypes.includes(key)) {
        data.append(key, file);
      }
    });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/api/update-applicant/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setFiles({
        customer_request_form: null,
        request_earmark_account: null,
        registration_form_credit_card: null,
        registration_form_gif_fina: null,
        file_typ_5: null, // ✅ ເພີ່ມ
      });
      const updatedResponse = await axios.get(`${API_BASE_URL}/api/applicant/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(updatedResponse.data.data?.documents || {
        customer_request_form: null,
        request_earmark_account: null,
        registration_form_credit_card: null,
        registration_form_gif_fina: null,
        file_typ_5: null, // ✅ ເພີ່ມ
      });
      // setDialogTitle('ສຳເລັດ');
      // setDialogMessage(response.data.message || 'ຂໍ້ມູນຖືກແກ້ໄຂສຳເລັດ');
      // // setIsErrorDialogOpen(true);
      // // setTimeout(() => navigate('/data-entry/status'), 1500);
      // toast.success("ຂໍ້ມູນຖືກແກ້ໄຂສຳເລັດ");
      // setTimeout(() => navigate("/data-entry/status"), 1500);

      Swal.fire({
        title: "ສຳເລັດ",
        icon: "success",
        text: "ແກ້ໄຂຂໍ້ມູນສຳເລັດ",
        timer: 1500,
        // showConfirmButton: false
      });
      navigate("/data-entry/status")
      // .then((result)=> {
      //   if(result.isConfirmed){
      //     navigate("/data-entry/status");
      //   }
      // })

    } catch (err) {
      console.error('Error updating applicant:', err);
      const errorMessage = err.response?.data?.message || 'ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນໄດ້';
      setDialogTitle('ຂໍ້ຜິດພາດ');
      setDialogMessage(errorMessage);
      setIsErrorDialogOpen(true);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading && !formData.name) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>
      </div>
    );
  }

  return (
    <div className="font-noto-sans-lao min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGoBack}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-blue-800">ແກ້ໄຂຂໍ້ມູນຜູ້ສະໝັກ</h1>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Card className="border-2 border-blue-200 shadow-lg max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl text-blue-700">ຂໍ້ມູນຜູ້ສະໝັກ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">FINA CTM ID</label>
                <Input
                  name="fina_ctm_key"
                  value={formData.fina_ctm_key}
                  onChange={handleInputChange}
                  className={`mt-1 h-10 transition-colors ${getFieldError('FINA CTM ID')}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">LBD CTM ID <span className="text-red-600">*</span></label>
                <Input
                  name="lbd_ctm_key"
                  value={formData.lbd_ctm_key}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 h-10 transition-colors ${getFieldError('LBD CTM ID')}`}
                />
                {error.includes('LBD CTM ID') && (
                  <span className="text-red-500 text-sm">ກະລຸນາປ້ອນ LBD CTM ID</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ອັນດັບຄວາມນຳເຊື່ອ</label>
                <Input
                  name="credit_rating"
                  value={formData.credit_rating}
                  onChange={handleInputChange}
                  className={`mt-1 h-10 transition-colors ${getFieldError('ອັນດັບຄວາມນຳເຊື່ອ')}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ຊື່ <span className="text-red-600">*</span></label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 h-10 transition-colors ${getFieldError('ຊື່')}`}
                />
                {error.includes('ຊື່') && (
                  <span className="text-red-500 text-sm">ກະລຸນາປ້ອນຊື່</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ນາມສະກຸນ <span className="text-red-600">*</span></label>
                <Input
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 h-10 transition-colors ${getFieldError('ນາມສະກຸນ')}`}
                />
                {error.includes('ນາມສະກຸນ') && (
                  <span className="text-red-500 text-sm">ກະລຸນາປ້ອນນາມສະກຸນ</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ວັນເດືອນປີເກີດ <span className="text-red-600">*</span></label>
                <DateInput
                  name="dob"
                  value={formData.dob}
                  onChange={handleDateChange}
                  placeholder="dd/mm/yyyy"
                  required
                  className={`mt-1 h-10 transition-colors ${getFieldError('ວັນເດືອນປີເກີດ')}`}
                />
                {error.includes('ວັນເດືອນປີເກີດ') && (
                  <span className="text-red-500 text-sm">{error.includes('ຮູບແບບ') ? error : 'ກະລຸນາປ້ອນວັນເດືອນປີເກີດ'}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ບ້ານ <span className="text-red-600">*</span></label>
                <Input
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 h-10 transition-colors ${getFieldError('ບ້ານ')}`}
                />
                {error.includes('ບ້ານ') && (
                  <span className="text-red-500 text-sm">ກະລຸນາປ້ອນບ້ານ</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ເພດ <span className="text-red-600">*</span></label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                  required
                >
                  <SelectTrigger className={`mt-1 h-10 transition-colors ${getFieldError('ເພດ')}`}>
                    <SelectValue placeholder="ເລືອກເພດ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ຊາຍ</SelectItem>
                    <SelectItem value="female">ຍິງ</SelectItem>
                  </SelectContent>
                </Select>
                {error.includes('ເພດ') && (
                  <span className="text-red-500 text-sm">ກະລຸນາເລືອກເພດ</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ແຂວງ <span className="text-red-600">*</span></label>
                <Select
                  value={formData.province_id}
                  onValueChange={handleProvinceChange}
                  required
                >
                  <SelectTrigger className={`mt-1 h-10 transition-colors ${getFieldError('ແຂວງ')}`}>
                    <SelectValue placeholder="ເລືອກແຂວງ" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(provinces) && provinces.length > 0 ? (
                      provinces.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-provinces" disabled>ບໍ່ມີຂໍ້ມູນແຂວງ</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {error.includes('ແຂວງ') && (
                  <span className="text-red-500 text-sm">ກະລຸນາເລືອກແຂວງ</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ເມືອງ <span className="text-red-600">*</span></label>
                <Select
                  name="district_id"
                  value={formData.district_id}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, district_id: value }))}
                  required
                  disabled={!formData.province_id || !Array.isArray(districts) || districts.length === 0}
                >
                  <SelectTrigger className={`mt-1 h-10 transition-colors ${getFieldError('ເມືອງ')}`}>
                    <SelectValue placeholder="ເລືອກເມືອງ" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(districts) && districts.length > 0 ? (
                      districts.map((d) => (
                        <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-districts" disabled>ບໍ່ມີຂໍ້ມູນເມືອງ</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {error.includes('ເມືອງ') && (
                  <span className="text-red-500 text-sm">ກະລຸນາເລືອກເມືອງ</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ສະຖານະຄວາມສຳພັນ <span className="text-red-600">*</span></label>
                <Select
                  name="relationship_status"
                  value={formData.relationship_status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, relationship_status: value }))}
                  required
                >
                  <SelectTrigger className={`mt-1 h-10 transition-colors ${getFieldError('ສະຖານະຄວາມສຳພັນ')}`}>
                    <SelectValue placeholder="ເລືອກສະຖານະ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">ໂສດ</SelectItem>
                    <SelectItem value="married">ແຕ່ງງານ</SelectItem>
                    <SelectItem value="divorced">ຢ່າຮ້າງ</SelectItem>
                    <SelectItem value="widowed">ໝ້າຍ</SelectItem>
                  </SelectContent>
                </Select>
                {error.includes('ສະຖານະຄວາມສຳພັນ') && (
                  <span className="text-red-500 text-sm">ກະລຸນາເລືອກສະຖານະຄວາມສຳພັນ</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ປະເພດເອກະສານ <span className="text-red-600">*</span></label>
                <Select
                  name="doc_type"
                  value={formData.doc_type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, doc_type: value }))}
                  required
                >
                  <SelectTrigger className={`mt-1 h-10 transition-colors ${getFieldError('ປະເພດເອກະສານ')}`}>
                    <SelectValue placeholder="ເລືອກປະເພດເອກະສານ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">ໜັງສືຜ່ານແດນ</SelectItem>
                    <SelectItem value="id_card">ບັດປະຈຳຕົວ</SelectItem>
                    <SelectItem value="family_book">ສຳມະໂນຄົວ</SelectItem>
                    <SelectItem value="other">ອື່ນໆ</SelectItem>
                  </SelectContent>
                </Select>
                {error.includes('ປະເພດເອກະສານ') && (
                  <span className="text-red-500 text-sm">ກະລຸນາເລືອກປະເພດເອກະສານ</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ເລກທີ່ເອກະສານ <span className="text-red-600">*</span></label>
                <Input
                  name="doc_number"
                  value={formData.doc_number}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 h-10 transition-colors ${getFieldError('ເລກທີ່ເອກະສານ')}`}
                />
                {error.includes('ເລກທີ່ເອກະສານ') && (
                  <span className="text-red-500 text-sm">ກະລຸນາປ້ອນເລກທີ່ເອກະສານ</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ອອກໂດຍ <span className="text-red-600">*</span></label>
                <Input
                  name="issued_by"
                  value={formData.issued_by}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 h-10 transition-colors ${getFieldError('ຜູ້ອອກເອກະສານ')}`}
                />
                {error.includes('ຜູ້ອອກເອກະສານ') && (
                  <span className="text-red-500 text-sm">ກະລຸນາປ້ອນຜູ້ອອກເອກະສານ</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ວັນທີ່ອອກ <span className="text-red-600">*</span></label>
                <DateInput
                  name="issued_date"
                  value={formData.issued_date}
                  onChange={handleDateChange}
                  placeholder="dd/mm/yyyy"
                  required
                  className={`mt-1 h-10 transition-colors ${getFieldError('ວັນທີ່ອອກ')}`}
                />
                {error.includes('ວັນທີ່ອອກ') && (
                  <span className="text-red-500 text-sm">{error.includes('ຮູບແບບ') ? error : 'ກະລຸນາປ້ອນວັນທີ່ອອກ'}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ວັນທີ່ໝົດອາຍຸ <span className="text-red-600">*</span></label>
                <DateInput
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleDateChange}
                  placeholder="dd/mm/yyyy"
                  required
                  className={`mt-1 h-10 transition-colors ${getFieldError('ວັນທີ່ໝົດອາຍຸ')}`}
                />
                {error.includes('ວັນທີ່ໝົດອາຍຸ') && (
                  <span className="text-red-500 text-sm">{error.includes('ຮູບແບບ') ? error : 'ກະລຸນາປ້ອນວັນທີ່ໝົດອາຍຸ'}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ແບບຟອມຄຳຂໍຂອງລູກຄ້າ (PDF, ບັງຄັບ)<span className="text-red-600">*</span></label>
                <Input
                  type="file"
                  accept=".pdf"
                  name="customer_request_form"
                  onChange={(e) => handleFileChange(e, 'customer_request_form')}
                  className={`mt-1 h-10 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 transition-colors ${getFieldError('ແບບຟອມຄຳຂໍຂອງລູກຄ້າ')}`}
                />
                {documents.customer_request_form && (
                  <div className="flex items-center space-x-2 mt-1">
                    <a
                      href={`${API_BASE_URL}/${documents.customer_request_form}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm truncate"
                    >
                      {documents.customer_request_form.split('/').pop()}
                    </a>
                    <button
                      onClick={() => handleDeleteFile('customer_request_form')}
                      className="text-red-600 hover:text-red-800 text-sm rounded-full"
                      title="ລົບໄຟລ໌"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {files.customer_request_form && (
                  <p className="text-sm text-gray-600 mt-1 truncate">ເລືອກແລ້ວ: {files.customer_request_form.name}</p>
                )}
                {error.includes('ແບບຟອມຄຳຂໍຂອງລູກຄ້າ') && (
                  <span className="text-red-500 text-sm">ກະລຸນາອັບໂຫຼດແບບຟອມຄຳຂໍຂອງລູກຄ້າ</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ໃບສະເໜີຂໍ Block ບັນຊີ (PDF, ບັງຄັບ)<span className="text-red-600">*</span></label>
                <Input
                  type="file"
                  accept=".pdf"
                  name="request_earmark_account"
                  onChange={(e) => handleFileChange(e, 'request_earmark_account')}
                  className={`mt-1 h-10 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 transition-colors ${getFieldError('ໃບສະເໜີຂໍ Block ບັນຊີ')}`}
                />
                {documents.request_earmark_account && (
                  <div className="flex items-center space-x-2 mt-1">
                    <a
                      href={`${API_BASE_URL}/${documents.request_earmark_account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm truncate"
                    >
                      {documents.request_earmark_account.split('/').pop()}
                    </a>
                    <button
                      onClick={() => handleDeleteFile('request_earmark_account')}
                      className="text-red-600 hover:text-red-800 text-sm rounded-full"
                      title="ລົບໄຟລ໌"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {files.request_earmark_account && (
                  <p className="text-sm text-gray-600 mt-1 truncate">ເລືອກແລ້ວ: {files.request_earmark_account.name}</p>
                )}
                {error.includes('ໃບສະເໜີຂໍ Block ບັນຊີ') && (
                  <span className="text-red-500 text-sm">ກະລຸນາອັບໂຫຼດແບບຟອມໃບສະເໜີຂໍ Block ບັນຊີ</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ແບບຟອມລົງທະບຽນບັດເຄຣດິດ (PDF, ບັງຄັບ) <span className="text-red-600">*</span></label>
                <Input
                  type="file"
                  accept=".pdf"
                  name="registration_form_credit_card"
                  onChange={(e) => handleFileChange(e, 'registration_form_credit_card')}
                  required
                  className={`mt-1 h-10 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 transition-colors ${getFieldError('ແບບຟອມລົງທະບຽນບັດເຄຣດິດ')}`}
                />
                {documents.registration_form_credit_card && (
                  <div className="flex items-center space-x-2 mt-1">
                    <a
                      href={`${API_BASE_URL}/${documents.registration_form_credit_card}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm truncate"
                    >
                      {documents.registration_form_credit_card.split('/').pop()}
                    </a>
                    <button
                      onClick={() => handleDeleteFile('registration_form_credit_card')}
                      className="text-red-600 hover:text-red-800 text-sm rounded-full"
                      title="ລົບໄຟລ໌"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {files.registration_form_credit_card && (
                  <p className="text-sm text-gray-600 mt-1 truncate">ເລືອກແລ້ວ: {files.registration_form_credit_card.name}</p>
                )}
                {error.includes('ແບບຟອມລົງທະບຽນບັດເຄຣດິດ') && (
                  <span className="text-red-500 text-sm">ກະລຸນາອັບໂຫຼດແບບຟອມລົງທະບຽນບັດເຄຣດິດ</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ແບບຟອມລົງທະບຽນ GIF FINA (PDF, ບັງຄັບ) <span className="text-red-600">*</span></label>
                <Input
                  type="file"
                  accept=".pdf"
                  name="registration_form_gif_fina"
                  onChange={(e) => handleFileChange(e, 'registration_form_gif_fina')}
                  required
                  className={`mt-1 h-10 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 transition-colors ${getFieldError('ແບບຟອມລົງທະບຽນ GIF FINA')}`}
                />
                {documents.registration_form_gif_fina && (
                  <div className="flex items-center space-x-2 mt-1">
                    <a
                      href={`${API_BASE_URL}/${documents.registration_form_gif_fina}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm truncate"
                    >
                      {documents.registration_form_gif_fina.split('/').pop()}
                    </a>
                    <button
                      onClick={() => handleDeleteFile('registration_form_gif_fina')}
                      className="text-red-600 hover:text-red-800 text-sm rounded-full"
                      title="ລົບໄຟລ໌"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {files.registration_form_gif_fina && (
                  <p className="text-sm text-gray-600 mt-1 truncate">ເລືອກແລ້ວ: {files.registration_form_gif_fina.name}</p>
                )}
                {error.includes('ແບບຟອມລົງທະບຽນ GIF FINA') && (
                  <span className="text-red-500 text-sm">ກະລຸນາອັບໂຫຼດແບບຟອມລົງທະບຽນ GIF FINA</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ຊື່ໄຟລ໌ 5 (PDF, ບັງຄັບ) <span className="text-red-600">*</span>
                </label>
                <Input
                  type="file"
                  accept=".pdf"
                  name="file_typ_5"
                  onChange={(e) => handleFileChange(e, 'file_typ_5')}
                  required
                  className={`mt-1 h-10 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 transition-colors ${getFieldError('ຊື່ໄຟລ໌ 5')}`}
                />
                {documents.file_typ_5 && (
                  <div className="flex items-center space-x-2 mt-1">
                    <a  
                      href={`${API_BASE_URL}/${documents.file_typ_5}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm truncate"
                    >
                      {documents.file_typ_5.split('/').pop()}
                    </a>
                    <button
                      onClick={() => handleDeleteFile('file_typ_5')}
                      className="text-red-600 hover:text-red-800 text-sm rounded-full"
                      title="ລົບໄຟລ໌"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {files.file_typ_5 && (
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    ເລືອກແລ້ວ: {files.file_typ_5.name}
                  </p>
                )}
                {error.includes('ຊື່ໄຟລ໌ 5') && (
                  <span className="text-red-500 text-sm">ກະລຸນາອັບໂຫຼດຊື່ໄຟລ໌ 5</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                onClick={handleGoBack}
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
                {isSubmitting && (
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {isSubmitting ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Dialogs */}
      <CustomAlertDialog
        open={isConfirmDialogOpen}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={handleSubmission}
        onCancel={handleCancelConfirmDialog}
        confirmText="ບັນທຶກ"
        cancelText="ຍົກເລີກ"
      />
      <CustomAlertDialog
        open={isDeleteConfirmOpen}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        confirmText="ລົບ"
        cancelText="ຍົກເລີກ"
      />
      <CustomAlertDialog
        open={isErrorDialogOpen}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={() => {
          setIsErrorDialogOpen(false);
          if (dialogTitle === 'ສຳເລັດ') {
            navigate(-1);
          }
        }}
        confirmText="ຕົກລົງ"
      />
    </div>
  );
};

export default EditApplicant;
