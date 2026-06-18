/**
 * Districts Management Page (Refactored)
 * CRUD operations for districts using senior-level React patterns
 */
import { API_BASE_URL } from '@/config/env.config';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Hooks
import { useAuth } from '@/hooks/auth/useAuth';
import { useToast } from '@/hooks/ui/useToast';
import { useConfirmDialog } from '@/hooks/ui/useConfirmDialog';

// API Services
import { locationAPI } from '@/api/location.api';
import { districtAPI } from '@/api/admin.api';

// Constants
import { TOAST_MESSAGES } from '@/config/constants';

const Districts = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasRole } = useAuth();
  const { showSuccess, showError } = useToast();
  const { confirmDelete } = useConfirmDialog();

  // State
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDistrict, setEditDistrict] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check authentication and role
  useEffect(() => {
    if (!isAuthenticated) {
      showError(TOAST_MESSAGES.LOGIN_FAILED);
      navigate('/');
    } else if (!hasRole('admin')) {
      showError('ບໍ່ມີສິດເຂົ້າເຖິງຫນ້ານີ້');
      navigate('/');
    }
  }, [isAuthenticated, hasRole, navigate, showError]);

  // Fetch provinces
  const fetchProvinces = async () => {
    try {
      const response = await locationAPI.getProvinces();
      setProvinces(response.data?.data?.provinces || []);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  // Fetch districts
  const fetchDistricts = async () => {
    setLoading(true);
    try {
      // Note: This assumes there's a GET all districts endpoint
      // If not, you might need to get all districts grouped by province
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/districts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const districtsList = data.data?.districts || [];
      setDistricts(districtsList);
      setFilteredDistricts(districtsList);
    } catch (error) {
      console.error('Error fetching districts:', error);
      showError(TOAST_MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && hasRole('admin')) {
      fetchProvinces();
      fetchDistricts();
    }
  }, [isAuthenticated, hasRole]);

  // Filter districts based on search term
  useEffect(() => {
    setFilteredDistricts(
      districts.filter((district) =>
        district.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, districts]);

  /**
   * Handle district creation
   */
  const handleCreate = async (name, provinceId) => {
    if (!name.trim() || !provinceId) {
      showError('ກະລຸນາປ້ອນຊື່ເມືອງ ແລະ ເລືອກແຂວງ');
      return;
    }

    setIsSubmitting(true);

    try {
      await districtAPI.createDistrict({ name: name.trim(), province_id: provinceId });
      showSuccess(TOAST_MESSAGES.SAVE_SUCCESS, 'ເພີ່ມເມືອງສຳເລັດ');
      setShowAddModal(false);
      fetchDistricts();
    } catch (error) {
      console.error('Error creating district:', error);
      showError(error.response?.data?.message || TOAST_MESSAGES.SAVE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle district update
   */
  const handleUpdate = async (id, name, provinceId) => {
    if (!name.trim() || !provinceId) {
      showError('ກະລຸນາປ້ອນຊື່ເມືອງ ແລະ ເລືອກແຂວງ');
      return;
    }

    setIsSubmitting(true);

    try {
      await districtAPI.updateDistrict(id, { name: name.trim(), province_id: provinceId });
      showSuccess(TOAST_MESSAGES.UPDATE_SUCCESS, 'ແກ້ໄຂເມືອງສຳເລັດ');
      setShowEditModal(false);
      setEditDistrict(null);
      fetchDistricts();
    } catch (error) {
      console.error('Error updating district:', error);
      showError(error.response?.data?.message || TOAST_MESSAGES.SAVE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle district deletion
   */
  const handleDelete = async (id, name) => {
    const confirmed = await confirmDelete(name);

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      await districtAPI.deleteDistrict(id);
      showSuccess(TOAST_MESSAGES.DELETE_SUCCESS, 'ລຶບເມືອງສຳເລັດ');
      fetchDistricts();
    } catch (error) {
      console.error('Error deleting district:', error);
      showError(error.response?.data?.message || TOAST_MESSAGES.DELETE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Open edit modal
   */
  const openEditModal = (district) => {
    setEditDistrict(district);
    setShowEditModal(true);
  };

  /**
   * Get province name by ID
   */
  const getProvinceName = (provinceId) => {
    const province = provinces.find((p) => String(p.id) === String(provinceId));
    return province ? province.name : '';
  };

  return (
    <div className="font-noto-sans-lao p-6 sm:p-8 max-w-5xl mx-auto bg-slate-50 relative">
      <div className="bg-white shadow-2xl rounded-2xl border-2 border-blue-500 p-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-4">ຈັດການຂໍ້ມູນເມືອງ</h1>
        <p className="text-center text-gray-600 text-lg mb-6">ສະແດງແລະຈັດການຂໍ້ມູນເມືອງ</p>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ຄົ້ນຫາຊື່ເມືອງ..."
            className="w-full h-12 border-2 border-blue-500 rounded-md px-4 py-2 text-lg"
            aria-label="ຄົ້ນຫາຊື່ເມືອງ"
          />
        </div>

        {/* Districts Table */}
        {loading ? (
          <div className="text-center text-gray-600 text-lg">
            <LoadingSpinner />
            ກຳລັງໂຫຼດ...
          </div>
        ) : filteredDistricts.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">ບໍ່ມີຂໍ້ມູນເມືອງ</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-lg text-left text-gray-700 border border-gray-200">
              <thead className="text-base uppercase bg-blue-100">
                <tr>
                  <th className="px-8 py-4 font-bold">ID</th>
                  <th className="px-8 py-4 font-bold">ຊື່ເມືອງ</th>
                  <th className="px-8 py-4 font-bold">ແຂວງ</th>
                  <th className="px-8 py-4 font-bold">ການດຳເນີນການ</th>
                </tr>
              </thead>
              <tbody>
                {filteredDistricts.map((district) => (
                  <tr key={district.id} className="border-b hover:bg-gray-50">
                    <td className="px-8 py-4">{district.id}</td>
                    <td className="px-8 py-4">{district.name}</td>
                    <td className="px-8 py-4">{getProvinceName(district.province_id)}</td>
                    <td className="px-8 py-4 flex gap-4">
                      <Button
                        onClick={() => openEditModal(district)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg"
                        aria-label={`ແກ້ໄຂເມືອງ ${district.name}`}
                      >
                        ແກ້ໄຂ
                      </Button>
                      <Button
                        onClick={() => handleDelete(district.id, district.name)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg"
                        aria-label={`ລຶບເມືອງ ${district.name}`}
                      >
                        ລຶບ
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Action Button for Add District */}
      <Button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg"
        aria-label="ເພີ່ມເມືອງໃໝ່"
        size="icon"
      >
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      </Button>

      {/* Add District Modal */}
      <AddDistrictModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        provinces={provinces}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />

      {/* Edit District Modal */}
      {editDistrict && (
        <EditDistrictModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          district={editDistrict}
          provinces={provinces}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

/**
 * Add District Modal Component
 */
const AddDistrictModal = ({ open, onOpenChange, provinces, onSubmit, isSubmitting }) => {
  const [name, setName] = useState('');
  const [provinceId, setProvinceId] = useState('');

  const handleSubmit = () => {
    onSubmit(name, provinceId);
    setName('');
    setProvinceId('');
  };

  const handleClose = () => {
    setName('');
    setProvinceId('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white rounded-lg p-8 w-full max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-gray-700">ເພີ່ມເມືອງໃໝ່</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={provinceId} onValueChange={setProvinceId} disabled={isSubmitting}>
            <SelectTrigger className="w-full h-14 border-2 border-blue-500">
              <SelectValue placeholder="ເລືອກແຂວງ" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ປ້ອນຊື່ເມືອງ"
            className="w-full h-14 border-2 border-blue-500 rounded-md px-4 py-2 text-lg"
            aria-label="ປ້ອນຊື່ເມືອງ"
            disabled={isSubmitting}
          />
        </div>
        <DialogFooter className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim() || !provinceId}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md text-lg"
            aria-label="ເພີ່ມເມືອງ"
          >
            {isSubmitting ? 'ກຳລັງບັນທຶກ...' : 'ເພີ່ມ'}
          </Button>
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            variant="outline"
            className="w-full font-semibold px-6 py-3 rounded-md text-lg"
            aria-label="ຍົກເລີກ"
          >
            ຍົກເລີກ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Edit District Modal Component
 */
const EditDistrictModal = ({ open, onOpenChange, district, provinces, onSubmit, isSubmitting }) => {
  const [name, setName] = useState('');
  const [provinceId, setProvinceId] = useState('');

  useEffect(() => {
    if (district) {
      setName(district.name || '');
      setProvinceId(district.province_id ? String(district.province_id) : '');
    }
  }, [district]);

  const handleSubmit = () => {
    onSubmit(district.id, name, provinceId);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white rounded-lg p-8 w-full max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-gray-700">ແກ້ໄຂເມືອງ</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={provinceId} onValueChange={setProvinceId} disabled={isSubmitting}>
            <SelectTrigger className="w-full h-14 border-2 border-blue-500">
              <SelectValue placeholder="ເລືອກແຂວງ" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ປ້ອນຊື່ເມືອງ"
            className="w-full h-14 border-2 border-blue-500 rounded-md px-4 py-2 text-lg"
            aria-label="ແກ້ໄຂຊື່ເມືອງ"
            disabled={isSubmitting}
          />
        </div>
        <DialogFooter className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim() || !provinceId}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md text-lg"
            aria-label="ບັນທຶກການແກ້ໄຂ"
          >
            {isSubmitting ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </Button>
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            variant="outline"
            className="w-full font-semibold px-6 py-3 rounded-md text-lg"
            aria-label="ຍົກເລີກ"
          >
            ຍົກເລີກ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Districts;
