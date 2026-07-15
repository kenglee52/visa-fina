import React from 'react';
import { X, User, FileText, MapPin, CreditCard, Clock } from 'lucide-react';
import { API_BASE_URL } from '@/config/env.config';

const formatDate = (date) => {
  if (!date) return '-';
  try {
    const d = new Date(date);
    if (isNaN(d)) return '-';
    return d.toISOString().split('T')[0];
  } catch { return '-'; }
};

const formatGender = (g) => g === 'male' ? 'ຊາຍ' : g === 'female' ? 'ຍິງ' : '-';

const formatDocType = (d) => ({
  passport: 'ໜັງສືຜ່ານແດນ',
  id_card: 'ບັດປະຈຳຕົວ',
  family_book: 'ສຳມະໂນຄົວ',
  other: 'ອື່ນໆ',
}[d] || '-');

const formatFileType = (f) => ({
  customer_request_form: 'ແບບຟອມຂໍເປີດບັນຊີ - ສ່ວນບຸກຄົນ',
  request_earmark_account: 'ແບບຟອມອື່ນໆ',
  registration_form_credit_card: 'ແບບຟອມລົງທະບຽນຂໍນຳໃຊ້ບັດສາກົນ',
  registration_form_gif_fina: 'ແບບຟອມອື່ນໆ',
  file_typ_5: 'ແບບຟອມອື່ນໆ',
}[f] || f || '-');

const formatRelationshipStatus = (s) => ({
  single: 'ໂສດ',
  married: 'ແຕ່ງງານແລ້ວ',
  divorced: 'ຢ່າຮ້າງ',
  widowed: 'ໝ້າຍ/ໝ້າຍຜົວ',
}[s] || s || '-');

const formatStatus = (s) => ({
  in_progress: 'ລໍຖ້າການຕິດຕາມ',
  rejected: 'ປະຕິເສດ',
  checked: 'ກວດສອບແລ້ວ',
  issued: 'ອອກບັດແລ້ວ',
  received: 'ຮັບບັດແລ້ວ',
}[s] || '-');

const statusColor = {
  in_progress: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', dot: 'bg-orange-400' },
  rejected:    { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-300',    dot: 'bg-red-500'    },
  checked:     { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-300',  dot: 'bg-green-500'  },
  issued:      { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-300',   dot: 'bg-blue-500'   },
  received:    { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', dot: 'bg-purple-500' },
};

/**
 * ApplicantDetailModal - Reusable modal for applicant details
 * 
 * Props:
 * - applicant: object (required)
 * - isOpen: boolean
 * - onClose: function
 * - extraActions: JSX (optional) - e.g. ປຸ່ມ ກວດສອບ/ປະຕິເສດ/ອອກບັດ
 */
const ApplicantDetailModal = ({ applicant, isOpen, onClose, extraActions }) => {
  if (!isOpen || !applicant) return null;

  const sc = statusColor[applicant.status] || {
    bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', dot: 'bg-gray-400'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-noto-sans-lao">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

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

          {/* ຂໍ້ມູນເອກະສານ */}
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
                { label: 'FINA Customer ID', value: applicant.fina_ctm_key || '-' },
                { label: 'LBB Customer ID', value: applicant.lbd_ctm_key || '-' },
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

          {/* ເວລາ */}
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

          {/* Extra Actions (ເຊັ່ນ: ປຸ່ມ ອອກບັດ, ກວດສອບ, ປະຕິເສດ) */}
          {extraActions && (
            <div className="pt-2">
              {extraActions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailModal;