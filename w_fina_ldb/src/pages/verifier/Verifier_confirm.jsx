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
import { RefreshCcw, X, CheckCircle, XCircle, User, FileText, Calendar, MapPin, CreditCard, Clock } from 'lucide-react';
import { API_BASE_URL } from '@/config/env.config';
import 'sweetalert2/dist/sweetalert2.min.css';

// ========== Modal Component ສຳລັບລາຍລະອຽດ ==========
const ApplicantDetailModal = ({ applicant, isOpen, onClose, isVerifier, onStatusUpdate, formatters }) => {
  if (!isOpen || !applicant) return null;

  const { formatDate, formatGender, formatDocType, formatFileType, formatRelationshipStatus, formatStatus } = formatters;

  const canCheck = isVerifier && applicant.status !== 'checked' && applicant.status !== 'rejected';
  const canReject = isVerifier && applicant.status !== 'checked' && applicant.status !== 'rejected';

  const statusColor = {
    in_progress: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', dot: 'bg-orange-400' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', dot: 'bg-red-500' },
    checked: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', dot: 'bg-green-500' },
  };
  const sc = statusColor[applicant.status] || { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', dot: 'bg-gray-400' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-noto-sans-lao">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-blue-500 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">ລາຍລະອຽດເອກະສານ</h2>
              <p className="text-xs text-blue-100">ID: {applicant.applicant_id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
            aria-label="ປິດ"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${sc.bg} ${sc.border}`}>
            <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
            <span className={`text-sm font-semibold ${sc.text}`}>{formatStatus(applicant.status)}</span>
          </div>

          {/* ຂໍ້ມູນສ່ວນຕົວ */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide">ຂໍ້ມູນສ່ວນຕົວ</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'ຊື່-ນາມສະກຸນ', value: `${applicant.applicant_name || '-'} ${applicant.applicant_surname || ''}` },
                { label: 'ເພດ', value: formatGender(applicant.gender) },
                { label: 'ວັນເດືອນປີເກີດ', value: formatDate(applicant.dob) },
                { label: 'ສະຖານະສົມຮົດ', value: formatRelationshipStatus(applicant.relationship_status) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ທີ່ຢູ່ */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide">ທີ່ຢູ່</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'ບ້ານ', value: applicant.village || '-' },
                { label: 'ເມືອງ', value: applicant.district_name || '-' },
                { label: 'ແຂວງ', value: applicant.province_name || '-' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ເອກະສານ */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide">ຂໍ້ມູນເອກະສານ</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'ປະເພດ', value: formatDocType(applicant.doc_type) },
                { label: 'ເລກທີ່', value: applicant.doc_number || '-' },
                { label: 'ອອກໂດຍ', value: applicant.issued_by || '-' },
                { label: 'ວັນທີ່ອອກ', value: formatDate(applicant.issued_date) },
                { label: 'ໝົດອາຍຸ', value: formatDate(applicant.expiry_date) },
                { label: 'Fina CTM Key', value: applicant.fina_ctm_key || '-' },
                { label: 'LBD CTM Key', value: applicant.lbd_ctm_key || '-' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ໄຟລ໌ */}
          {applicant.files?.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide">ໄຟລ໌ທີ່ແນບ</h3>
              </div>
              <div className="space-y-2">
                {applicant.files.map((file, i) => (
                  <a
                    key={i}
                    href={`${API_BASE_URL}/${file.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-200 rounded-lg group-hover:bg-blue-300 transition-colors">
                      <FileText className="w-4 h-4 text-blue-700" />
                    </div>
                    <span className="text-sm text-blue-700 font-medium">{formatFileType(file.file_type)}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* ວັນທີ່ */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide">ເວລາ</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'ວັນທີ່ສ້າງ', value: formatDate(applicant.created_at) },
                { label: 'ວັນທີ່ອັບເດດ', value: formatDate(applicant.updated_at) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ປຸ່ມ Action — ສະແດງສະເພາະ verifier */}
          {isVerifier && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onStatusUpdate(applicant.applicant_id, 'checked')}
                disabled={!canCheck}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all
                  ${canCheck
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg active:scale-95'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <CheckCircle className="w-4 h-4" />
                ກວດສອບ
              </button>
              <button
                onClick={() => onStatusUpdate(applicant.applicant_id, 'rejected')}
                disabled={!canReject}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all
                  ${canReject
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg active:scale-95'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <XCircle className="w-4 h-4" />
                ປະຕິເສດ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ========== Main Component ==========
const Verifier_confirm = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('both');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVerifier, setIsVerifier] = useState(false);

  // Modal state
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOptions = [
    { value: 'both', label: 'ທັງໝົດ (ລໍຖ້າ ແລະ ປະຕິເສດ)' },
    { value: 'in_progress', label: 'ລໍຖ້າການຕິດຕາມ' },
    { value: 'rejected', label: 'ປະຕິເສດ' },
  ];

  // ກວດສອບ role
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsVerifier(payload.role === 'verifier');
      } catch {
        setIsVerifier(false);
      }
    }
  }, []);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ');

      let fetchedApplicants = [];
      let total = 0;
      const limit = 10;
      const statuses = statusFilter === 'both' ? ['in_progress', 'rejected'] : [statusFilter];

      for (const status of statuses) {
        const response = await axios.get(`${API_BASE_URL}/api/follow-report`, {
          headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' },
          params: { page, limit, status },
        });
        fetchedApplicants = [...fetchedApplicants, ...response.data.data];
        total += response.data.total || 0;
      }

      let filteredApplicants = fetchedApplicants;
      if (searchTerm.trim()) {
        filteredApplicants = fetchedApplicants.filter(a =>
          a.applicant_id?.toString().toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
        total = filteredApplicants.length;
      }

      // ✅ ຖືກ - in_progress ກ່ອນ, rejected ຫຼັງ, ແລ້ວ updated_at ASC ໃນແຕ່ລະກຸ່ມ
      const sorted = filteredApplicants.sort((a, b) => {
        const statusOrder = { in_progress: 0, rejected: 1 };
        const aOrder = statusOrder[a.status] ?? 2;
        const bOrder = statusOrder[b.status] ?? 2;

        // ຈັດກຸ່ມກ່ອນ
        if (aOrder !== bOrder) return aOrder - bOrder;

        // ໃນກຸ່ມດຽວກັນ: ເກົ່າສຸດຢູ່ເທີງ (ASC)
        return new Date(a.updated_at) - new Date(b.updated_at);
      });

      const startIndex = (page - 1) * limit;
      setApplicants(sorted.slice(startIndex, startIndex + limit));
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'ບໍ່ສາມາດດຶງຂໍ້ມູນຜູ້ສະໝັກໄດ້');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchTerm]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'error', title: 'ຂໍ້ຜິດພາດ', text: 'ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ',
        confirmButtonText: 'ຕົກລົງ', confirmButtonColor: '#2563eb',
        timer: 4000, timerProgressBar: true,
        customClass: { popup: 'font-noto-sans-lao', title: 'font-bold text-lg', content: 'text-base' },
      }).then(() => navigate('/'));
      return;
    }
    fetchApplicants();
  }, [fetchApplicants, navigate]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error', title: 'ຂໍ້ຜິດພາດ', text: error,
        confirmButtonText: 'ຕົກລົງ', confirmButtonColor: '#2563eb',
        timer: 4000, timerProgressBar: true,
        customClass: { popup: 'font-noto-sans-lao', title: 'font-bold text-lg', content: 'text-base' },
      });
    }
  }, [error]);

  // ເປີດ Modal
  const openModal = (applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  // ປິດ Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };

  // ອັບເດດສະຖານະ
  const handleStatusUpdate = async (applicant_id, status) => {
    if (!isVerifier) return;

    const actionText = status === 'checked' ? 'ກວດສອບ' : 'ປະຕິເສດ';
    let feedback = '';

    if (status === 'rejected') {
      const result = await Swal.fire({
        icon: 'question',
        title: `ຢືນຢັນ${actionText}`,
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
          const v = document.getElementById('reject-feedback').value;
          if (!v || v.trim() === '') { Swal.showValidationMessage('ກະລຸນາລະບຸເຫດຜົນທີ່ປະຕິເສດ'); return false; }
          return v;
        },
      });
      if (!result.isConfirmed) return;
      feedback = result.value;
    } else {
      const result = await Swal.fire({
        icon: 'question', title: `ຢືນຢັນ${actionText}`,
        text: `ທ່ານຕ້ອງການ${actionText}ຜູ້ສະໝັກນີ້ບໍ?`,
        showCancelButton: true,
        confirmButtonText: 'ຕົກລົງ', cancelButtonText: 'ຍົກເລີກ',
        confirmButtonColor: '#2563eb', cancelButtonColor: '#dc2626',
        customClass: { popup: 'font-noto-sans-lao', title: 'font-bold text-lg', content: 'text-base' },
      });
      if (!result.isConfirmed) return;
    }

    try {
      const token = localStorage.getItem('token');
      const endpoint = status === 'checked' ? '/api/check_document' : '/api/reject_document';
      const response = await axios.put(
        `${API_BASE_URL}${endpoint}`,
        { applicant_id, ...(status === 'rejected' && { feedback }) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: 'success', title: 'ສຳເລັດ', text: response.data.message,
        confirmButtonText: 'ຕົກລົງ', confirmButtonColor: '#2563eb',
        timer: 3000, timerProgressBar: true,
        customClass: { popup: 'font-noto-sans-lao', title: 'font-bold text-lg', content: 'text-base' },
      });

      closeModal();
      fetchApplicants();
    } catch (err) {
      Swal.fire({
        icon: 'error', title: 'ຂໍ້ຜິດພາດ',
        text: err.response?.data?.message || 'ບໍ່ສາມາດອັບເດດສະຖານະໄດ້',
        confirmButtonText: 'ຕົກລົງ', confirmButtonColor: '#2563eb',
        timer: 4000, timerProgressBar: true,
        customClass: { popup: 'font-noto-sans-lao', title: 'font-bold text-lg', content: 'text-base' },
      });
    }
  };

  const handleRefresh = () => { setStatusFilter('both'); setPage(1); setSearchTerm(''); fetchApplicants(); };

  // Formatters
  const formatters = {
    formatDate: (date) => { if (!date) return '-'; try { return format(parseISO(date), 'yyyy-MM-dd'); } catch { return '-'; } },
    formatStatus: (s) => ({ in_progress: 'ລໍຖ້າການຕິດຕາມ', rejected: 'ປະຕິເສດ', checked: 'ກວດສອບແລ້ວ' }[s] || '-'),
    formatGender: (g) => g === 'male' ? 'ຊາຍ' : g === 'female' ? 'ຍິງ' : '-',
    formatDocType: (d) => ({ passport: 'ໜັງສືຜ່ານແດນ', id_card: 'ບັດປະຈຳຕົວ', family_book: 'ສຳມະໂນຄົວ', other: 'ອື່ນໆ' }[d] || '-'),
    formatFileType: (f) => ({ customer_request_form: 'ແບບຟອມຄຳຂໍຂອງລູກຄ້າ', request_earmark_account: 'ໃບສະເໜີຂໍ Block ບັນຊີ', registration_form_credit_card: 'ແບບຟອມລົງທະບຽນບັດເຄຣດິດ' }[f] || f || '-'),
    formatRelationshipStatus: (s) => ({ single: 'ໂສດ', married: 'ແຕ່ງງານແລ້ວ', divorced: 'ຢ່າຮ້າງ', widowed: 'ໝ້າຍ/ໝ້າຍຜົວ' }[s] || s || '-'),
  };

  const statusBadge = (status) => {
    const map = {
      in_progress: 'bg-orange-100 text-orange-600',
      rejected: 'bg-red-100 text-red-600',
      checked: 'bg-green-100 text-green-600',
    };
    return map[status] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="font-noto-sans-lao p-6 sm:p-8 w-full mx-auto bg-orange-50">
      {/* Detail Modal */}
      <ApplicantDetailModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onClose={closeModal}
        isVerifier={isVerifier}
        onStatusUpdate={handleStatusUpdate}
        formatters={formatters}
      />

      <Card className="shadow-2xl rounded-2xl border-2 border-blue-500">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-800">ກວດສອບເອກະສານ</CardTitle>
          <p className="text-center text-blue-600">ກວດສອບແລະອັບເດດສະຖານະຂອງເອກະສານ</p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between gap-4">
            <Input
              type="text" placeholder="ຄົ້ນຫາ ID ເອກະສານ" value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full sm:w-48 h-10 border-blue-500 rounded-md px-3 py-2 font-noto-sans-lao"
            />
            <Button onClick={handleRefresh} className="w-full sm:w-10 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-md">
              <RefreshCcw className="h-5 w-5" />
            </Button>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-48 h-10 border-blue-500 text-blue-600 rounded-md font-noto-sans-lao">
                <SelectValue placeholder="ກັ່ນຕອງຕາມສະຖານະ" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(o => (
                  <SelectItem key={o.value} value={o.value} className="text-blue-600">{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center text-blue-600 py-10">ກຳລັງໂຫຼດ...</div>
          ) : applicants.length === 0 ? (
            <div className="text-center text-blue-600 py-10">ບໍ່ມີຂໍ້ມູນຜູ້ສະໝັກສຳລັບສະຖານະນີ້</div>
          ) : (
            <Table className="whitespace-nowrap text-xs">
              <TableHeader>
                <TableRow>
                  {['ID ເອກະສານ', 'ຊື່-ນາມສະກຸນ', 'ວັນເດືອນປີເກີດ', 'ເພດ', 'ບ້ານ', 'ເມືອງ', 'ແຂວງ', 'ສະຖານະ', 'ວັນທີ່ອັບເດດ', 'ລາຍລະອຽດ'].map(h => (
                    <TableHead key={h} className="font-bold text-black">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicants.map((applicant, index) => (
                  <TableRow
                    key={`${applicant.applicant_id}-${index}`}
                    className={applicant.updated_at && isToday(parseISO(applicant.updated_at))
                      ? 'bg-blue-300 text-blue-900 font-semibold hover:bg-blue-300'
                      : 'hover:bg-gray-100'}
                  >
                    <TableCell className="text-black">{applicant.applicant_id}</TableCell>
                    <TableCell className="text-black">{`${applicant.applicant_name || '-'} ${applicant.applicant_surname || '-'}`}</TableCell>
                    <TableCell className="text-black">{formatters.formatDate(applicant.dob)}</TableCell>
                    <TableCell className="text-black">{formatters.formatGender(applicant.gender)}</TableCell>
                    <TableCell className="text-black">{applicant.village || '-'}</TableCell>
                    <TableCell className="text-black">{applicant.district_name || '-'}</TableCell>
                    <TableCell className="text-black">{applicant.province_name || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full font-semibold text-xs ${statusBadge(applicant.status)}`}>
                        {formatters.formatStatus(applicant.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-black">{formatters.formatDate(applicant.updated_at)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline" size="sm"
                        onClick={() => openModal(applicant)}
                        className="border-blue-500 text-blue-500 hover:bg-blue-100"
                      >
                        ລາຍລະອຽດ
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="flex justify-between mt-6">
            <Button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1 || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed">
              ກ່ອນໜ້າ
            </Button>
            <span className="self-center text-blue-600">ໜ້າ {page} / {totalPages}</span>
            <Button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed">
              ຕໍ່ໄປ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verifier_confirm;