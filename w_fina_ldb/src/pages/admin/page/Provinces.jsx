/**
 * Provinces Management Page (Refactored)
 * CRUD operations for provinces using senior-level React patterns
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Hooks
import { useAuth } from '@/hooks/auth/useAuth';
import { useForm } from '@/hooks/form/useForm';
import { useToast } from '@/hooks/ui/useToast';
import { useConfirmDialog } from '@/hooks/ui/useConfirmDialog';

// API Services
import { locationAPI } from '@/api/location.api';
import { provinceAPI } from '@/api/admin.api';

// Constants
import { VALIDATION_MESSAGES, TOAST_MESSAGES, DIALOG_MESSAGES } from '@/config/constants';

const Provinces = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasRole } = useAuth();
  const { showSuccess, showError } = useToast();
  const { confirmDelete, confirm } = useConfirmDialog();

  // State
  const [provinces, setProvinces] = useState([]);
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProvince, setEditProvince] = useState(null);
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
    setLoading(true);
    try {
      const response = await locationAPI.getProvinces();
      const provincesList = response.data?.data?.provinces || [];
      setProvinces(provincesList);
      setFilteredProvinces(provincesList);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      showError(TOAST_MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && hasRole('admin')) {
      fetchProvinces();
    }
  }, [isAuthenticated, hasRole]);

  // Filter provinces based on search term
  useEffect(() => {
    setFilteredProvinces(
      provinces.filter((province) =>
        province.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, provinces]);

  /**
   * Handle province creation
   */
  const handleCreate = async (name) => {
    if (!name.trim()) {
      showError(VALIDATION_MESSAGES.REQUIRED);
      return;
    }

    setIsSubmitting(true);

    try {
      await provinceAPI.createProvince({ name: name.trim() });
      showSuccess(TOAST_MESSAGES.SAVE_SUCCESS, 'ເພີ່ມແຂວງສຳເລັດ');
      setShowAddModal(false);
      fetchProvinces();
    } catch (error) {
      console.error('Error creating province:', error);
      showError(error.response?.data?.message || TOAST_MESSAGES.SAVE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle province update
   */
  const handleUpdate = async (id, name) => {
    if (!name.trim()) {
      showError(VALIDATION_MESSAGES.REQUIRED);
      return;
    }

    setIsSubmitting(true);

    try {
      await provinceAPI.updateProvince(id, { name: name.trim() });
      showSuccess(TOAST_MESSAGES.UPDATE_SUCCESS, 'ແກ້ໄຂແຂວງສຳເລັດ');
      setShowEditModal(false);
      setEditProvince(null);
      fetchProvinces();
    } catch (error) {
      console.error('Error updating province:', error);
      showError(error.response?.data?.message || TOAST_MESSAGES.SAVE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle province deletion
   */
  const handleDelete = async (id, name) => {
    const confirmed = await confirmDelete(name);

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      await provinceAPI.deleteProvince(id);
      showSuccess(TOAST_MESSAGES.DELETE_SUCCESS, 'ລຶບແຂວງສຳເລັດ');
      fetchProvinces();
    } catch (error) {
      console.error('Error deleting province:', error);
      showError(error.response?.data?.message || TOAST_MESSAGES.DELETE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Open edit modal
   */
  const openEditModal = (province) => {
    setEditProvince(province);
    setShowEditModal(true);
  };

  return (
    <div className="font-noto-sans-lao p-6 sm:p-8 max-w-5xl mx-auto bg-slate-50 relative">
      <div className="bg-white shadow-2xl rounded-2xl border-2 border-blue-500 p-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-4">ການຈັດການແຂວງ</h1>
        <p className="text-center text-gray-600 text-lg mb-6">ສະແດງແລະຈັດການຂໍ້ມູນແຂວງ</p>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ຄົ້ນຫາຊື່ແຂວງ..."
            className="w-full h-12 border-2 border-blue-500 rounded-md px-4 py-2 text-lg"
            aria-label="ຄົ້ນຫາຊື່ແຂວງ"
          />
        </div>

        {/* Provinces Table */}
        {loading ? (
          <div className="text-center text-gray-600 text-lg">
            <LoadingSpinner />
            ກຳລັງໂຫຼດ...
          </div>
        ) : filteredProvinces.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">ບໍ່ມີຂໍ້ມູນແຂວງ</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-lg text-left text-gray-700 border border-gray-200">
              <thead className="text-base uppercase bg-blue-100">
                <tr>
                  <th className="px-8 py-4 font-bold">ID</th>
                  <th className="px-8 py-4 font-bold">ຊື່ແຂວງ</th>
                  <th className="px-8 py-4 font-bold">ການດຳເນີນການ</th>
                </tr>
              </thead>
              <tbody>
                {filteredProvinces.map((province) => (
                  <tr key={province.id} className="border-b hover:bg-gray-50">
                    <td className="px-8 py-4">{province.id}</td>
                    <td className="px-8 py-4">{province.name}</td>
                    <td className="px-8 py-4 flex gap-4">
                      <Button
                        onClick={() => openEditModal(province)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg"
                        aria-label={`ແກ້ໄຂແຂວງ ${province.name}`}
                      >
                        ແກ້ໄຂ
                      </Button>
                      <Button
                        onClick={() => handleDelete(province.id, province.name)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg"
                        aria-label={`ລຶບແຂວງ ${province.name}`}
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

      {/* Floating Action Button for Add Province */}
      <Button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg"
        aria-label="ເພີ່ມແຂວງໃໝ່"
        size="icon"
      >
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      </Button>

      {/* Add Province Modal */}
      <AddProvinceModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />

      {/* Edit Province Modal */}
      {editProvince && (
        <EditProvinceModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          province={editProvince}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

/**
 * Add Province Modal Component
 */
const AddProvinceModal = ({ open, onOpenChange, onSubmit, isSubmitting }) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    onSubmit(name);
    setName('');
  };

  const handleClose = () => {
    setName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white rounded-lg p-8 w-full max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-gray-700">ເພີ່ມແຂວງໃໝ່</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ປ້ອນຊື່ແຂວງ"
          className="w-full h-14 border-2 border-blue-500 rounded-md px-4 py-2 text-lg"
          aria-label="ປ້ອນຊື່ແຂວງ"
          disabled={isSubmitting}
        />
        <DialogFooter className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md text-lg"
            aria-label="ເພີ່ມແຂວງ"
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
 * Edit Province Modal Component
 */
const EditProvinceModal = ({ open, onOpenChange, province, onSubmit, isSubmitting }) => {
  const [name, setName] = useState(province?.name || '');

  useEffect(() => {
    setName(province?.name || '');
  }, [province]);

  const handleSubmit = () => {
    onSubmit(province.id, name);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white rounded-lg p-8 w-full max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-gray-700">ແກ້ໄຂແຂວງ</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ປ້ອນຊື່ແຂວງ"
          className="w-full h-14 border-2 border-blue-500 rounded-md px-4 py-2 text-lg"
          aria-label="ແກ້ໄຂຊື່ແຂວງ"
          disabled={isSubmitting}
        />
        <DialogFooter className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim()}
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

export default Provinces;
