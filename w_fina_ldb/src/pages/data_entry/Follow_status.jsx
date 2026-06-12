import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { url } from '@/componet/unity/Part';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isToday } from 'date-fns';
import DatePicker from 'react-datepicker';
import { RefreshCcw, X } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import 'sweetalert2/dist/sweetalert2.min.css';

const FollowStatus = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [applicantIdSearch, setApplicantIdSearch] = useState('');
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'ທັງໝົດ' },
    { value: 'in_progress', label: 'ລໍຖ້າການຕິດຕາມ' },
    { value: 'checked', label: 'ກວດສອບແລ້ວ' },
    { value: 'rejected', label: 'ປະຕິເສດ' },
    { value: 'issued', label: 'ອອກບັດແລ້ວ' },
    { value: 'received', label: 'ຮັບບັດແລ້ວ' },
  ];

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
    }
  }, [navigate]);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ');

      const params = { page, limit: 10 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (applicantIdSearch) params.applicant_id = applicantIdSearch;
      if (dateFrom) params.date_from = format(dateFrom, 'yyyy-MM-dd');
      if (dateTo) params.date_to = format(dateTo, 'yyyy-MM-dd');

      console.log('Fetching reports with params:', params);
      const response = await axios.get(`${url.base_url}/api/follow-report`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
        params,
      });

      console.log('API Response:', response.data);
      const total = response.data.total || 0;
      const limit = response.data.limit || 10;
      const calculatedTotalPages = Math.ceil(total / limit) || 1;

      const filteredReports = response.data.data || [];
      if (statusFilter !== 'all' && filteredReports.length > 0) {
        const invalidReports = filteredReports.filter(report => report.status !== statusFilter);
        if (invalidReports.length > 0) {
          console.warn('Found reports with mismatched status:', invalidReports);
        }
      }

      const sortedReports = filteredReports.sort((a, b) => {
        const aIsToday = a.updated_at && isToday(parseISO(a.updated_at));
        const bIsToday = b.updated_at && isToday(parseISO(b.updated_at));
        if (aIsToday && !bIsToday) return -1;
        if (!aIsToday && bIsToday) return 1;
        return 0;
      });

      setReports(sortedReports);
      setTotalPages(calculatedTotalPages);
      console.log('Page:', page, 'Total Pages:', calculatedTotalPages, 'Reports:', sortedReports.length);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.response?.data?.message || 'ບໍ່ສາມາດດຶງຂໍ້ມູນລາຍງານໄດ້');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, applicantIdSearch, dateFrom, dateTo]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

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

  const handleStatusFilterChange = (value) => {
    console.log('Status filter changed to:', value);
    setStatusFilter(value);
    setPage(1);
  };

  const handleApplicantIdSearch = (e) => {
    setApplicantIdSearch(e.target.value);
    setPage(1);
  };

  const handleRefresh = () => {
    setApplicantIdSearch('');
    setDateFrom(null);
    setDateTo(null);
    setStatusFilter('all');
    setPage(1);
    fetchReports();
  };

  const clearDateFrom = () => {
    setDateFrom(null);
    setPage(1);
  };

  const clearDateTo = () => {
    setDateTo(null);
    setPage(1);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    try {
      return format(parseISO(date), 'yyyy-MM-dd');
    } catch {
      return '-';
    }
  };

  const formatFileType = (fileType) => {
    switch (fileType) {
      case 'customer_request_form': return 'ແບບຟອມຄຳຂໍຂອງລູກຄ້າ';
      case 'request_earmark_account': return 'ໃບສະເໜີຂໍ Block ບັນຊີ';
      case 'registration_form_credit_card': return 'ແບບຟອມລົງທະບຽນບັດເຄຣດິດ VISA';
      case 'registration_form_gif_fina': return 'ແບບຟອມລົງທະບຽນ GIF Fina';

      
      default: return fileType || '-';
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'in_progress': return 'ລໍຖ້າດຳເນີນການ';
      case 'checked': return 'ກວດສອບແລ້ວ';
      case 'rejected': return 'ປະຕິເສດ';
      case 'issued': return 'ອອກບັດແລ້ວ';
      case 'received': return 'ຮັບບັດແລ້ວ';
      default: return '-';
    }
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

  const formatGender = (gender) => {
    return gender === 'male' ? 'ຊາຍ' : gender === 'female' ? 'ຍິງ' : '-';
  };

  const showApplicantDetails = (report) => {
    const filesList = report.files?.length > 0
      ? report.files.map(file => `
          <li>
            <a href="${url.base_url}/${file.file_path}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
              ${formatFileType(file.file_type)}
            </a>
          </li>
        `).join('')
      : '<li>ບໍ່ມີເອກະສານ</li>';

    Swal.fire({
      title: 'ລາຍລະອຽດຜູ້ສະໝັກ',
      html: `
        <div class="font-noto-sans-lao text-left text-base">
          <p><strong>ID ຜູ້ສະໝັກ:</strong> ${report.applicant_id || '-'}</p>
          <p><strong>ຊື່-ນາມສະກຸນ:</strong> ${report.applicant_name || '-'} ${report.applicant_surname || '-'}</p>
          <p><strong>ວັນເດືອນປີເກີດ:</strong> ${formatDate(report.dob)}</p>
          <p><strong>ເພດ:</strong> ${formatGender(report.gender)}</p>
          <p><strong>ບ້ານ:</strong> ${report.village || '-'}</p>
          <p><strong>ເມືອງ:</strong> ${report.district_name || '-'}</p>
          <p><strong>ແຂວງ:</strong> ${report.province_name || '-'}</p>
          <p><strong>ສະຖານະສົມຮົດ:</strong> ${report.relationship_status || '-'}</p>
          <p><strong>ປະເພດເອກະສານ:</strong> ${formatDocType(report.doc_type)}</p>
          <p><strong>ເລກທີ່ເອກະສານ:</strong> ${report.doc_number || '-'}</p>
       
          <p><strong>ວັນທີ່ອອກເອກະສານ:</strong> ${formatDate(report.issued_date)}</p>
          <p><strong>ວັນທີ່ໝົດອາຍຸ:</strong> ${formatDate(report.expiry_date)}</p>
          <p><strong>ສະຖານະ:</strong> ${formatStatus(report.status)}</p>
          <p><strong>ວັນທີ່ສ້າງ:</strong> ${formatDate(report.created_at)}</p>
          <p><strong>ວັນທີ່ອັບເດດ:</strong> ${formatDate(report.updated_at)}</p>
          <p><strong>ເອກະສານ:</strong></p>
          <ul class="list-disc pl-5">${filesList}</ul>
        </div>
      `,
      confirmButtonText: 'ປິດ',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'font-noto-sans-lao', title: 'font-bold text-lg' },
    });
  };

  const showRejectionFeedback = (report) => {
    Swal.fire({
      title: 'ເຫດຜົນທີ່ປະຕິເສດ',
      html: `
        <div class="font-noto-sans-lao text-left text-base">
          <p><strong>ID ຜູ້ສະໝັກ:</strong> ${report.applicant_id || '-'}</p>
          <p><strong>ເຫດຜົນທີ່ປະຕິເສດ:</strong> ${report.last_rejected_feedback || 'ບໍ່ມີເຫດຜົນທີ່ລະບຸ'}</p>
        </div>
      `,
      confirmButtonText: 'ປິດ',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'font-noto-sans-lao', title: 'font-bold text-lg' },
    });
  };

  return (
    <div className="font-noto-sans-lao p-6 sm:p-8 w-full mx-auto bg-slate-50">
        <Card className="shadow-2xl rounded-2xl border-2 border-blue-500">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-800">
            ລາຍງານການຕິດຕາມເອກະສານ
          </CardTitle>
          <p className="text-center text-gray-500">ສະແດງສະຖານະການຕິດຕາມຂອງຜູ້ສະໝັກ</p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="ຄົ້ນຫາ ID ຜູ້ສະໝັກ"
                value={applicantIdSearch}
                onChange={handleApplicantIdSearch}
                className="w-full sm:w-48 h-10 border-blue-500 rounded-md px-3 py-2 font-noto-sans-lao"
              />
              <div className="relative flex items-center">
                <DatePicker
                  selected={dateFrom}
                  onChange={(date) => setDateFrom(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="ວັນທີ່ສ້າງຈາກ (dd/mm/yyyy)"
                  className="w-full sm:w-48 h-10 border-blue-500 rounded-md px-3 py-2 font-noto-sans-lao"
                />
                {dateFrom && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearDateFrom}
                    className="absolute right-2 h-6 w-6 text-gray-500 hover:text-red-500"
                    aria-label="ລ້າງວັນທີ່ສ້າງຈາກ"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="relative flex items-center">
                <DatePicker
                  selected={dateTo}
                  onChange={(date) => setDateTo(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="ວັນທີ່ສ້າງຫາ (dd/mm/yyyy)"
                  className="w-full sm:w-48 h-10 border-blue-500 rounded-md px-3 py-2 font-noto-sans-lao"
                />
                {dateTo && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearDateTo}
                    className="absolute right-2 h-6 w-6 text-gray-500 hover:text-red-500"
                    aria-label="ລ້າງວັນທີ່ສ້າງຫາ"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button
                onClick={handleRefresh}
                className="w-full sm:w-10 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-md"
                aria-label="รีโหลดข้อมูล"
              >
                <RefreshCcw className="h-5 w-5" />
              </Button>
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-full sm:w-48 h-10 border-blue-500 rounded-md font-noto-sans-lao" aria-label="ກັ່ນຕອງຕາມສະຖານະ">
                <SelectValue placeholder="ກັ່ນຕອງຕາມສະຖານະ" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center text-gray-600">ກຳລັງໂຫຼດ...</div>
          ) : reports.length === 0 ? (
            <div className="text-center text-gray-600">ບໍ່ມີຂໍ້ມູນຜູ້ສະໝັກສຳລັບສະຖານະນີ້</div>
          ) : (
            <Table className="whitespace-nowrap text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-gray-700">ID ເອກະສານ</TableHead>
                  <TableHead className="font-bold text-gray-700">ຊື່-ນາມສະກຸນ</TableHead>
                  <TableHead className="font-bold text-gray-700">ວັນເດືອນປີເກີດ</TableHead>

                  <TableHead className="font-bold text-gray-700">ບ້ານ</TableHead>
                  <TableHead className="font-bold text-gray-700">ເມືອງ</TableHead>
                  <TableHead className="font-bold text-gray-700">ແຂວງ</TableHead>
                  <TableHead className="font-bold text-gray-700">ເອກະສານ</TableHead>
                  <TableHead className="font-bold text-gray-700">ສະຖານະ</TableHead>
                  <TableHead className="font-bold text-gray-700">ວັນທີ່ອັບເດດ</TableHead>
                  <TableHead className="font-bold text-gray-700">ລາຍລະອຽດ</TableHead>
                  <TableHead className="font-bold text-gray-700">ແກ້ໄຂ</TableHead>
                  <TableHead className="font-bold text-gray-700">ເຫດຜົນປະຕິເສດ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report, index) => {
                  const isEditable = ['in_progress', 'rejected'].includes(report.status);
                  const isRejected = report.status === 'rejected';
                  return (
                    <TableRow
                      key={`${report.applicant_id}-${index}`}
                      className={
                        isRejected
                          ? 'bg-red-100 hover:bg-red-200'
                          : report.updated_at && isToday(parseISO(report.updated_at))
                          ? 'bg-yellow-100 hover:bg-yellow-200'
                          : 'hover:bg-gray-50'
                      }
                    >
                      <TableCell>{report.applicant_id}</TableCell>
                      <TableCell>{`${report.applicant_name} ${report.applicant_surname}`}</TableCell>
                         <TableCell className="text-black">{formatDate(report.dob)}</TableCell>
                      <TableCell>{report.village || '-'}</TableCell>

                      <TableCell>{report.district_name || '-'}</TableCell>
                      <TableCell>{report.province_name || '-'}</TableCell>
                      <TableCell>
                        {report.files?.length > 0 ? (
                          <div className="flex flex-col space-y-2">
                            {report.files.map((file, index) => (
                              <a
                                key={index}
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
                          <span className="text-gray-500">ບໍ່ມີເອກະສານ</span>
                        )}
                      </TableCell>
                      <TableCell>{formatStatus(report.status)}</TableCell>
                      <TableCell>{formatDate(report.updated_at)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showApplicantDetails(report)}
                          className="border-blue-500 text-blue-500 hover:bg-blue-100"
                          aria-label={`ເບິ່ງລາຍລະອຽດຜູ້ສະໝັກ ${report.applicant_id}`}
                        >
                          ລາຍລະອຽດ
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/data-entry/edit/${report.applicant_id}`)}
                          className={`border-blue-500 text-blue-500 hover:bg-blue-100 ${
                            !isEditable ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''
                          }`}
                          aria-label={`ແກ້ໄຂຜູ້ສະໝັກ ${report.applicant_id}`}
                          disabled={!isEditable}
                        >
                          ແກ້ໄຂ
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showRejectionFeedback(report)}
                          className={`border-red-500 text-red-500 hover:bg-red-100 ${
                            !isRejected ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''
                          }`}
                          aria-label={`ເບິ່ງເຫດຜົນປະຕິເສດຜູ້ສະໝັກ ${report.applicant_id}`}
                          disabled={!isRejected}
                        >
                          ເຫດຜົນ
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
            <span className="self-center text-gray-600">
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

export default FollowStatus;