import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { url } from '@/componet/unity/Part';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isToday } from 'date-fns';
import { RefreshCcw } from 'lucide-react';
import 'sweetalert2/dist/sweetalert2.min.css';

const Verifier_confirm = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('both');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    { value: 'both', label: 'ທັງໝົດ (ລໍຖ້າ ແລະ ປະຕິເສດ)' },
    { value: 'in_progress', label: 'ລໍຖ້າການຕິດຕາມ' },
    { value: 'rejected', label: 'ປະຕິເສດ' },
  ];

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ');

      let fetchedApplicants = [];
      let total = 0;
      const limit = 10;

      // Fetch based on statusFilter
      const statuses = statusFilter === 'both' ? ['in_progress', 'rejected'] : [statusFilter];

      for (const status of statuses) {
        const response = await axios.get(`${url.base_url}/api/follow-report`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
          params: { page, limit, status },
        });

        console.log(`API Response for ${status}:`, response.data);
        fetchedApplicants = [...fetchedApplicants, ...response.data.data];
        total += response.data.total || 0;
      }

      // Filter applicants by searchTerm if provided
      let filteredApplicants = fetchedApplicants;
      if (searchTerm.trim()) {
        filteredApplicants = fetchedApplicants.filter(applicant =>
          applicant.applicant_id?.toString().toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
        total = filteredApplicants.length;
      }

      // Sort applicants by updated_at, prioritizing today's updates
      const sortedApplicants = filteredApplicants.sort((a, b) => {
        const aIsToday = a.updated_at && isToday(parseISO(a.updated_at));
        const bIsToday = b.updated_at && isToday(parseISO(b.updated_at));
        if (aIsToday && !bIsToday) return -1;
        if (!aIsToday && bIsToday) return 1;
        return new Date(b.updated_at) - new Date(a.updated_at);
      });

      // Paginate the combined results
      const startIndex = (page - 1) * limit;
      const paginatedApplicants = sortedApplicants.slice(startIndex, startIndex + limit);
      const calculatedTotalPages = Math.ceil(total / limit) || 1;

      setApplicants(paginatedApplicants);
      setTotalPages(calculatedTotalPages);
    } catch (err) {
      console.error('Error fetching applicants:', err);
      setError(err.response?.data?.message || 'ບໍ່ສາມາດດຶງຂໍ້ມູນຜູ້ສະໝັກໄດ້');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchTerm]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'ຂໍ້ຜິດພາດ',
        text: 'ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ',
        confirmButtonText: 'ຕົກລົງ',
        confirmButtonColor: '#2563eb',
        timer: 4000,
        timerProgressBar: true,
        customClass: { popup: 'font-noto-sans-lao', title: 'font-bold text-lg', content: 'text-base' },
      }).then(() => navigate('/'));
      return;
    }
    fetchApplicants();
  }, [fetchApplicants, navigate]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'ຂໍ້ຜິດພາດ',
        text: error,
        confirmButtonText: 'ຕົກລົງ',
        confirmButtonColor: '#2563eb',
        timer: 4000,
        timerProgressBar: true,
        customClass: { popup: 'font-noto-sans-lao', title: 'font-bold text-lg', content: 'text-base' },
      });
    }
  }, [error]);

  const handleStatusUpdate = async (applicant_id, status) => {
    const actionText = status === 'checked' ? 'ກວດສອບ' : 'ປະຕິເສດ';
    let feedback = '';

    // Prompt for feedback if rejecting
    if (status === 'rejected') {
      const result = await Swal.fire({
        icon: 'question',
        title: `ຢືນຢັນ${actionText}`,
        text: `ກະລຸນາລະບຸເຫດຜົນທີ່ປະຕິເສດຜູ້ສະໝັກນີ້`,
        html: `
          <div class="font-noto-sans-lao">
            <label for="reject-feedback" class="block text-left mb-1">ເຫດຜົນທີ່ປະຕິເສດ:</label>
            <textarea id="reject-feedback" class="swal2-textarea font-noto-sans-lao" placeholder="ກະລຸນາລະບຸເຫດຜົນ"></textarea>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'ຕົກລົງ',
        cancelButtonText: 'ຍົກເລີກ',
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#dc2626',
        customClass: { popup: 'font-noto-sans-lao', title: 'font-bold text-lg', content: 'text-base' },
        preConfirm: () => {
          const inputFeedback = document.getElementById('reject-feedback').value;
          if (!inputFeedback || inputFeedback.trim() === '') {
            Swal.showValidationMessage('ກະລຸນາລະບຸເຫດຜົນທີ່ປະຕິເສດ');
            return false;
          }
          return inputFeedback;
        },
      });

      if (!result.isConfirmed) return;
      feedback = result.value;
    } else {
      const result = await Swal.fire({
        icon: 'question',
        title: `ຢືນຢັນ${actionText}`,
        text: `ທ່ານຕ້ອງການ${actionText}ຜູ້ສະໝັກນີ້ບໍ?`,
        showCancelButton: true,
        confirmButtonText: 'ຕົກລົງ',
        cancelButtonText: 'ຍົກເລີກ',
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#dc2626',
        customClass: { popup: 'font-noto-sans-lao', title: 'font-bold text-lg', content: 'text-base' },
      });

      if (!result.isConfirmed) return;
    }

    try {
      const token = localStorage.getItem('token');
      const endpoint = status === 'checked' ? '/api/check_document' : '/api/reject_document';
      const response = await axios.put(
        `${url.base_url}${endpoint}`,
        { applicant_id, ...(status === 'rejected' && { feedback }) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: 'success',
        title: 'ສຳເລັດ',
        text: response.data.message,
        confirmButtonText: 'ຕົກລົງ',
        confirmButtonColor: '#2563eb',
        timer: 3000,
        timerProgressBar: true,
        customClass: { popup: 'font-noto-sans-lao', title: 'font-bold text-lg', content: 'text-base' },
      });

      fetchApplicants();
    } catch (err) {
      console.error('Error updating status:', err);
      Swal.fire({
        icon: 'error',
        title: 'ຂໍ້ຜິດພາດ',
        text: err.response?.data?.message || 'ບໍ່ສາມາດອັບເດດສະຖານະໄດ້',
        confirmButtonText: 'ຕົກລົງ',
        confirmButtonColor: '#2563eb',
        timer: 4000,
        timerProgressBar: true,
        customClass: { popup: 'font-noto-sans-lao', title: 'font-bold text-lg', content: 'text-base' },
      });
    }
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleRefresh = () => {
    setStatusFilter('both');
    setPage(1);
    setSearchTerm('');
    fetchApplicants();
  };

  const formatDate = (date) => {
    if (!date) return '-';
    try {
      return format(parseISO(date), 'yyyy-MM-dd');
    } catch {
      return '-';
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'in_progress': return 'ລໍຖ້າການຕິດຕາມ';
      case 'rejected': return 'ປະຕິເສດ';
      default: return '-';
    }
  };

  const formatGender = (gender) => {
    return gender === 'male' ? 'ຊາຍ' : gender === 'female' ? 'ຍິງ' : '-';
  };

  const formatDocType = (docType) => {
    switch (docType) {
      case 'passport': return 'ໜັງສືຜ່ານແດນ';
      case 'id_card': return 'ບັດປະຈຳຕົວ';
      case 'family_book': return 'ສຳມະໂນຄົວ';
      case 'other': return 'ອື່ນໆ';
      default: return '-';
    }
  };

  const formatFileType = (fileType) => {
    switch (fileType) {
      case 'customer_request_form': return 'ແບບຟອມຄຳຂໍຂອງລູກຄ້າ';
      case 'request_earmark_account': return 'ໃບສະເໜີຂໍ Block ບັນຊີ';
      case 'registration_form_credit_card': return 'ແບບຟອມລົງທະບຽນບັດເຄຣດິດ';
      default: return fileType || '-';
    }
  };

  const formatRelationshipStatus = (status) => {
    switch (status) {
      case 'single': return 'ໂສດ';
      case 'married': return 'ແຕ່ງງານແລ້ວ';
      case 'divorced': return 'ຢ່າຮ້າງ';
      case 'widowed': return 'ໝ້າຍ/ໝ້າຍຜົວ';
      default: return status || '-';
    }
  };

  const showApplicantDetails = (applicant) => {
    const filesList = applicant.files?.length > 0
      ? applicant.files.map(file => `
          <li>
            <a href="${url.base_url}/${file.file_path}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
              ${formatFileType(file.file_type)}
            </a>
          </li>
        `).join('')
      : '<li>ບໍ່ມີເອກະສານ</li>';

    Swal.fire({
      title: 'ລາຍລະອຽດເອກະສານ',
      html: `
        <div class="font-noto-sans-lao text-left text-base">
          <p><strong>ID ເອກະສານ:</strong> ${applicant.applicant_id || '-'}</p>
          <p><strong>Fina CTM Key:</strong> ${applicant.fina_ctm_key || '-'}</p>
          <p><strong>LBD CTM Key:</strong> ${applicant.lbd_ctm_key || '-'}</p>
          <p><strong>ຊື່-ນາມສະກຸນ:</strong> ${applicant.applicant_name || '-'} ${applicant.applicant_surname || '-'}</p>
          <p><strong>ວັນເດືອນປີເກີດ:</strong> ${formatDate(applicant.dob)}</p>
          <p><strong>ເພດ:</strong> ${formatGender(applicant.gender)}</p>
          <p><strong>ບ້ານ:</strong> ${applicant.village || '-'}</p>
          <p><strong>ເມືອງ:</strong> ${applicant.district_name || '-'}</p>
          <p><strong>ແຂວງ:</strong> ${applicant.province_name || '-'}</p>
          <p><strong>ສະຖານະສົມຮົດ:</strong> ${formatRelationshipStatus(applicant.relationship_status)}</p>
          <p><strong>ປະເພດເອກະສານ:</strong> ${formatDocType(applicant.doc_type)}</p>
          <p><strong>ເລກທີ່ເອກະສານ:</strong> ${applicant.doc_number || '-'}</p>
          <p><strong>ອອກໂດຍ:</strong> ${applicant.issued_by || '-'}</p>
          <p><strong>ວັນທີ່ອອກເອກະສານ:</strong> ${formatDate(applicant.issued_date)}</p>
          <p><strong>ວັນທີ່ໝົດອາຍຸ:</strong> ${formatDate(applicant.expiry_date)}</p>
        
          <p><strong>ສະຖານະ:</strong> ${formatStatus(applicant.status)}</p>
          <p><strong>ວັນທີ່ສ້າງ:</strong> ${formatDate(applicant.created_at)}</p>
          <p><strong>ວັນທີ່ອັບເດດ:</strong> ${formatDate(applicant.updated_at)}</p>
          <p><strong>ເອກະສານ:</strong></p>
          <ul class="list-disc pl-5">${filesList}</ul>
        </div>
      `,
      confirmButtonText: 'ປິດ',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'font-noto-sans-lao', title: 'font-bold text-lg' },
    });
  };

  return (
    <div className="font-noto-sans-lao p-6 sm:p-8 w-full mx-auto bg-orange-50">
      <Card className="shadow-2xl rounded-2xl border-2 border-blue-500">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-800">
            ກວດສອບເອກະສານ
          </CardTitle>
          <p className="text-center text-blue-600">ກວດສອບແລະອັບເດດສະຖານະຂອງເອກກະສານ</p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between gap-4">
            <Input
              type="text"
              placeholder="ຄົ້ນຫາ ID ເອກະສານ"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-48 h-10 border-blue-500 rounded-md px-3 py-2 font-noto-sans-lao"
            />
           

            <Button
              onClick={handleRefresh}
              className="w-full sm:w-10 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-md"
              aria-label="รีโหลดข้อมูล"
              >
              <RefreshCcw className="h-5 w-5" />
            </Button>
             
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-full sm:w-48 h-10 border-blue-500 text-blue-600 rounded-md font-noto-sans-lao" aria-label="ກັ່ນຕອງຕາມສະຖານະ">
                <SelectValue placeholder="ກັ່ນຕອງຕາມສະຖານະ" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-blue-600">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center text-blue-600">ກຳລັງໂຫຼດ...</div>
          ) : applicants.length === 0 ? (
            <div className="text-center text-blue-600">ບໍ່ມີຂໍ້ມູນຜູ້ສະໝັກສຳລັບສະຖານະນີ້</div>
          ) : (
            <Table className="whitespace-nowrap text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-black">ID ເອກະສານ</TableHead>
                  <TableHead className="font-bold text-black">ຊື່-ນາມສະກຸນ</TableHead>
                  <TableHead className="font-bold text-black">ວັນເດືອນປີເກີດ</TableHead>
                  <TableHead className="font-bold text-black">ເພດ</TableHead>
                  <TableHead className="font-bold text-black">ບ້ານ</TableHead>
                  <TableHead className="font-bold text-black">ເມືອງ</TableHead>
                  <TableHead className="font-bold text-black">ແຂວງ</TableHead>
             
                  <TableHead className="font-bold text-black">ເອກະສານ</TableHead>
                  <TableHead className="font-bold text-black">ສະຖານະ</TableHead>
                  <TableHead className="font-bold text-black">ວັນທີ່ອັບເດດ</TableHead>
                  <TableHead className="font-bold text-black">ການດຳເນີນການ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicants.map((applicant, index) => (
                  <TableRow
                    key={`${applicant.applicant_id}-${index}`}
                    className={
                      applicant.updated_at && isToday(parseISO(applicant.updated_at))
                        ? 'bg-blue-300 text-blue-900 font-semibold hover:bg-blue-300'
                        : 'hover:bg-gray-100'
                    }
                  >
                    <TableCell className="text-black">{applicant.applicant_id}</TableCell>
                    <TableCell className="text-black">{`${applicant.applicant_name || '-'} ${applicant.applicant_surname || '-'}`}</TableCell>
                    <TableCell className="text-black">{formatDate(applicant.dob)}</TableCell>
                    <TableCell className="text-black">{formatGender(applicant.gender)}</TableCell>
                    <TableCell className="text-black">{applicant.village || '-'}</TableCell>
                    <TableCell className="text-black">{applicant.district_name || '-'}</TableCell>
                    <TableCell className="text-black">{applicant.province_name || '-'}</TableCell>
                 
                    <TableCell>
                      {applicant.files?.length > 0 ? (
                        <div className="flex flex-col space-y-2">
                          {applicant.files.map((file, fileIndex) => (
                            <a
                              key={fileIndex}
                              href={`${url.base_url}/${file.file_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {formatFileType(file.file_type)}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-blue-600">ບໍ່ມີເອກະສານ</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          `px-2 py-1 rounded-full font-semibold ` +
                          (applicant.status === 'in_progress'
                            ? 'bg-orange-100 text-orange-600'
                            : applicant.status === 'rejected'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-blue-100 text-blue-600')
                        }
                      >
                        {formatStatus(applicant.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-black">{formatDate(applicant.updated_at)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showApplicantDetails(applicant)}
                          className="border-blue-500 text-blue-500 hover:bg-blue-100"
                          aria-label={`ເບິ່ງລາຍລະອຽດຜູ້ສະໝັກ ${applicant.applicant_id}`}
                        >
                          ເບິ່ງລາຍລະອຽດ
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(applicant.applicant_id, 'checked')}
                          className="border-green-500 text-green-500 hover:bg-green-100 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                          disabled={applicant.status === 'checked'}
                          aria-label={`ກວດສອບຜູ້ສະໝັກ ${applicant.applicant_id}`}
                        >
                          ກວດສອບ
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(applicant.applicant_id, 'rejected')}
                          className="border-red-500 text-red-500 hover:bg-red-100 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                          disabled={applicant.status === 'checked' || applicant.status === 'rejected'}
                          aria-label={`ປະຕິເສດຜູ້ສະໝັກ ${applicant.applicant_id}`}
                        >
                          ປະຕິເສດ
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="flex justify-between mt-6">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              aria-label="ໜ້າກ່ອນໜ້າ"
            >
              ກ່ອນໜ້າ
            </Button>
            <span className="self-center text-blue-600">
              ໜ້າ {page} / {totalPages}
            </span>
            <Button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              aria-label="ໜ້າຕໍ່ໄປ"
            >
              ຕໍ່ໄປ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verifier_confirm;