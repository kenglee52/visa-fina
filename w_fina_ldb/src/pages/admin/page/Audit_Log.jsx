import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { url } from '@/componet/unity/Part';
import 'sweetalert2/dist/sweetalert2.min.css';
import { API_BASE_URL } from '@/config/env.config';

const actionOptions = [
  { value: '', label: '-- ເລືອກການກະທຳ --' },
  { value: 'check_document', label: 'ກວດເອກະສານ' },
  { value: 'issue_card', label: 'ອອກບັດ' },
  { value: 'receive_card', label: 'ຮັບບັດ' },
  { value: 'upload_documents', label: 'ອັບໂຫຼດເອກະສານ' },
  { value: 'edit_documents', label: 'ແກ້ໄຂເອກະສານ' },
  { value: 'rejected', label: 'ປະຕິເສດ' },
];

const statusOptions = [
  { value: '', label: '-- ເລືອກສະຖານະ --' },
  { value: 'in_progress', label: 'ກຳລັງດຳເນີນການ' },
  { value: 'checked', label: 'ກວດແລ້ວ' },
  { value: 'rejected', label: 'ບໍ່ຜ່ານ' },
  { value: 'issued', label: 'ອອກບັດແລ້ວ' },
  { value: 'received', label: 'ຮັບບັດແລ້ວ' },
];

const Audit_Log = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    applicant_id: '',
    action: '',
    status: '',
    date_from: '',
    date_to: '',
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchLogs = () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ');
      setLoading(false);
      return;
    }

    if (filters.date_from && filters.date_to && new Date(filters.date_from) > new Date(filters.date_to)) {
      setError('ວັນທີ່ເລີ່ມຕ້ອງກ່ອນຫຼືເທົ່າກັບວັນທີ່ສິ້ນສຸດ');
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/log-report`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...filters, page, limit },
      })
      .then((res) => {
        setLogs(res.data.data || []);
        setTotal(res.data.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'ບໍ່ສາມາດດຶງຂໍ້ມູນ log ໄດ້');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [page]);

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
        customClass: { popup: 'font-blacked-black', title: 'font-blacked-black text-lg', content: 'font-blacked-black text-base' },
      });
    }
  }, [error]);

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const handleReset = () => {
    setFilters({
      applicant_id: '',
      action: '',
      status: '',
      date_from: '',
      date_to: '',
    });
    setPage(1);
    fetchLogs();
  };

  const totalPages = Math.ceil(total / limit);

  const formatField = (value) => (value === null || value === '' ? '-' : value);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    if (isNaN(date)) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="font-blacked-black p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">ປະຫວັດການທຳງານ (Audit Log)</h1>
      <p className="text-center text-base sm:text-lg mb-8">ຄົ້ນຫາ ແລະ ຕິດຕາມການກະທຳທຸກຢ່າງໃນລະບົບ</p>

      {/* Filter Form */}
      <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <input
          type="text"
          value={filters.applicant_id}
          onChange={(e) => setFilters({ ...filters, applicant_id: e.target.value })}
          placeholder="Applicant ID"
          className="h-12 border-2 border-blue-500 rounded-md px-4 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 font-blacked-black"
        />
        <select
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          className="h-12 border-2 border-blue-500 rounded-md px-4 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 font-blacked-black"
        >
          {actionOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="font-blacked-black">
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="h-12 border-2 border-blue-500 rounded-md px-4 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 font-blacked-black"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="font-blacked-black">
              {opt.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filters.date_from}
          onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
          className="h-12 border-2 border-blue-500 rounded-md px-4 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 font-blacked-black"
          max={filters.date_to || undefined}
        />
        <input
          type="date"
          value={filters.date_to}
          onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
          className="h-12 border-2 border-blue-500 rounded-md px-4 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 font-blacked-black"
          min={filters.date_from || undefined}
        />
        <button
          type="submit"
          className="h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-base sm:text-lg font-blacked-black"
        >
          ຄົ້ນຫາ
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="h-12 bg-gray-300 text-black rounded-md hover:bg-gray-400 text-base sm:text-lg font-blacked-black"
        >
          ຣີເຊັດ
        </button>
      </form>

      {/* Results Info */}
      {!loading && logs.length > 0 && (
        <p className="text-center mb-4 text-base sm:text-lg font-blacked-black">
          ພົບ {total} ລາຍການ (ໜ້າທີ່ {page} ຈາກ {totalPages})
        </p>
      )}

      {/* Log Table */}
      {loading ? (
        <div className="text-center text-base sm:text-lg font-blacked-black">ກຳລັງໂຫຼດ...</div>
      ) : logs.length === 0 ? (
        <div className="text-center text-base sm:text-lg font-blacked-black">ບໍ່ພົບຂໍ້ມູນ log</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left text-base sm:text-lg font-blacked-black">ID</th>
                <th className="p-3 text-left text-base sm:text-lg font-blacked-black">Applicant ID</th>
                <th className="p-3 text-left text-base sm:text-lg font-blacked-black">Name</th>
                <th className="p-3 text-left text-base sm:text-lg font-blacked-black">Surname</th>
                <th className="p-3 text-left text-base sm:text-lg font-blacked-black">Data Entry</th>
                {/* ✅ ປ່ຽນ header ຈາກ "verifie" -> "Verifier" */}
                <th className="p-3 text-left text-base sm:text-lg font-blacked-black">Verifier</th>
                <th className="p-3 text-left text-base sm:text-lg font-blacked-black">Action</th>
                <th className="p-3 text-left text-base sm:text-lg font-blacked-black">Status</th>
                <th className="p-3 text-left text-base sm:text-lg font-blacked-black">Timestamp</th>
                <th className="p-3 text-left text-base sm:text-lg font-blacked-black">Receiver</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.log_id} className="border-b hover:bg-gray-100">
                  <td className="p-3 text-base sm:text-lg font-blacked-black">{formatField(log.log_id)}</td>
                  <td className="p-3 text-base sm:text-lg font-blacked-black">{formatField(log.applicant_id)}</td>
                  <td className="p-3 text-base sm:text-lg font-blacked-black">{formatField(log.applicant_name)}</td>
                  <td className="p-3 text-base sm:text-lg font-blacked-black">{formatField(log.applicant_surname)}</td>
                  <td className="p-3 text-base sm:text-lg font-blacked-black">{formatField(log.data_entry_employee_id)}</td>
                  {/* ✅ ປ່ຽນຈາກ log.employee_id -> log.verifier_id */}
                  <td className="p-3 text-base sm:text-lg font-blacked-black">{formatField(log.verifier_id)}</td>
                  <td className="p-3 text-base sm:text-lg font-blacked-black">
                    {formatField(actionOptions.find((a) => a.value === log.action)?.label || log.action)}
                  </td>
                  <td className="p-3 text-base sm:text-lg font-blacked-black">
                    {formatField(statusOptions.find((s) => s.value === log.status)?.label || log.status)}
                  </td>
                  <td className="p-3 text-base sm:text-lg font-blacked-black">{formatTimestamp(log.timestamp)}</td>
                  <td className="p-3 text-base sm:text-lg font-blacked-black">{formatField(log.receiver_id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-base sm:text-lg font-blacked-black"
          >
            {'<'}
          </button>
          <span className="text-base sm:text-lg font-blacked-black">{page} / {totalPages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-base sm:text-lg font-blacked-black"
          >
            {'>'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Audit_Log;