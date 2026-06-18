/**
 * Employee Management Page (Refactored)
 * CRUD operations for employees using senior-level React patterns
 */
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
import { employeeAPI } from '@/api/admin.api';

// Constants
import { TOAST_MESSAGES, ROLE_LABELS, EMPLOYEE_ROLES } from '@/config/constants';

const Employee = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasRole } = useAuth();
  const { showSuccess, showError } = useToast();
  const { confirmDelete } = useConfirmDialog();

  // State
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
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

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeAPI.getEmployees();
      const employeesList = response.data?.data?.employees || [];
      setEmployees(employeesList);
      setFilteredEmployees(employeesList);
    } catch (error) {
      console.error('Error fetching employees:', error);
      showError(TOAST_MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && hasRole('admin')) {
      fetchEmployees();
    }
  }, [isAuthenticated, hasRole]);

  // Filter employees
  useEffect(() => {
    setFilteredEmployees(
      employees.filter(
        (emp) =>
          emp?.id?.toString().includes(searchTerm.toLowerCase()) ||
          emp?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, employees]);

  /**
   * Handle employee creation
   */
  const handleCreate = async (data) => {
    const { id, name, last_name, email, role, password } = data;

    if (!id || !name || !last_name || !email || !role || !password) {
      showError('ກະລຸນາປ້ອນຂໍ້ມູນພະນັກງານໃຫ້ຄົບ (ລວມທັງ ID)');
      return;
    }

    setIsSubmitting(true);

    try {
      await employeeAPI.createEmployee({ id, name, last_name, email, role, password });
      showSuccess(TOAST_MESSAGES.SAVE_SUCCESS, 'ເພີ່ມພະນັກງານສຳເລັດ');
      setShowAddModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error creating employee:', error);
      showError(error.response?.data?.message || TOAST_MESSAGES.SAVE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle employee update
   */
  const handleUpdate = async (id, data) => {
    const { name, last_name, email, role, password } = data;

    if (!name || !last_name || !email || !role) {
      showError('ກະລຸນາປ້ອນຂໍ້ມູນພະນັກງານໃຫ້ຄົບ');
      return;
    }

    setIsSubmitting(true);

    try {
      await employeeAPI.updateEmployee(id, { name, last_name, email, role, password });
      showSuccess(TOAST_MESSAGES.UPDATE_SUCCESS, 'ແກ້ໄຂພະນັກງານສຳເລັດ');
      setShowEditModal(false);
      setEditEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
      showError(error.response?.data?.message || TOAST_MESSAGES.SAVE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle employee deletion
   */
  const handleDelete = async (id, name) => {
    const confirmed = await confirmDelete(name);

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      await employeeAPI.deleteEmployee(id);
      showSuccess(TOAST_MESSAGES.DELETE_SUCCESS, 'ລຶບພະນັກງານສຳເລັດ');
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      showError(error.response?.data?.message || TOAST_MESSAGES.DELETE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Open edit modal
   */
  const openEditModal = (employee) => {
    setEditEmployee({ ...employee, password: '' });
    setShowEditModal(true);
  };

  return (
    <div className="font-noto-sans-lao p-6 sm:p-8 max-w-5xl mx-auto bg-slate-50 relative">
      <div className="bg-white shadow-2xl rounded-2xl border-2 border-blue-500 p-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-4">ຈັດການຂໍ້ມູນພະນັກງານ</h1>
        <p className="text-center text-gray-600 text-lg mb-6">ສະແດງແລະຈັດການຂໍ້ມູນພະນັກງານ</p>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ຄົ້ນຫາດ້ວຍ ID/ຊື່/ອີເມວ..."
            className="w-full h-12 border-2 border-blue-500 rounded-md px-4 py-2 text-lg"
            aria-label="ຄົ້ນຫາພະນັກງານ"
          />
        </div>

        {/* Employees Table */}
        {loading ? (
          <div className="text-center text-gray-600 text-lg">
            <LoadingSpinner />
            ກຳລັງໂຫຼດ...
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">ບໍ່ມີຂໍ້ມູນພະນັກງານ</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-lg text-left text-gray-700 border border-gray-200">
              <thead className="text-base uppercase bg-blue-100">
                <tr>
                  <th className="px-6 py-4 font-bold">ID</th>
                  <th className="px-6 py-4 font-bold">ຊື່</th>
                  <th className="px-6 py-4 font-bold">ນາມສະກຸນ</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">ການດຳເນີນການ</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{emp.id}</td>
                    <td className="px-6 py-4">{emp.name}</td>
                    <td className="px-6 py-4">{emp.last_name}</td>
                    <td className="px-6 py-4">{emp.email}</td>
                    <td className="px-6 py-4">{ROLE_LABELS[emp.role] || emp.role}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button
                        onClick={() => openEditModal(emp)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-base"
                        aria-label={`ແກ້ໄຂ ${emp.name}`}
                      >
                        ແກ້ໄຂ
                      </Button>
                      <Button
                        onClick={() => handleDelete(emp.id, emp.name)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-base"
                        aria-label={`ລຶບ ${emp.name}`}
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

      {/* Floating Action Button */}
      <Button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg"
        aria-label="ເພີ່ມພະນັກງານໃໝ່"
        size="icon"
      >
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      </Button>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />

      {/* Edit Employee Modal */}
      {editEmployee && (
        <EditEmployeeModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          employee={editEmployee}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

/**
 * Add Employee Modal Component
 */
const AddEmployeeModal = ({ open, onOpenChange, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    last_name: '',
    email: '',
    role: '',
    password: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ id: '', name: '', last_name: '', email: '', role: '', password: '' });
  };

  const handleClose = () => {
    setFormData({ id: '', name: '', last_name: '', email: '', role: '', password: '' });
    onOpenChange(false);
  };

  const roleOptions = [
    { value: EMPLOYEE_ROLES.ADMIN, label: ROLE_LABELS.admin },
    { value: EMPLOYEE_ROLES.VERIFIER, label: ROLE_LABELS.verifier },
    { value: EMPLOYEE_ROLES.DATA_ENTRY, label: ROLE_LABELS.data_entry },
    { value: EMPLOYEE_ROLES.RECEIVER, label: ROLE_LABELS.receiver },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white rounded-lg p-8 w-full max-w-lg font-noto-sans-lao">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-gray-700">ເພີ່ມພະນັກງານໃໝ່</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            value={formData.id}
            onChange={(e) => handleChange('id', e.target.value)}
            placeholder="ID"
            className="w-full h-12 border-2 border-blue-500 rounded-md px-4 py-2 text-lg"
            disabled={isSubmitting}
          />
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="ຊື່"
            className="w-full h-12 border-2 border-blue-500 rounded-md px-4 py-2 text-lg"
            disabled={isSubmitting}
          />
          <Input
            type="text"
            value={formData.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
            placeholder="ນາມສະກຸນ"
            className="w-full h-12 border-2 border-blue-500 rounded-md px-4 py-2 text-lg"
            disabled={isSubmitting}
          />
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Email"
            className="w-full h-12 border-2 border-blue-500 rounded-md px-4 py-2 text-lg"
            disabled={isSubmitting}
          />
          <Select value={formData.role} onValueChange={(value) => handleChange('role', value)} disabled={isSubmitting}>
            <SelectTrigger className="w-full h-12 border-2 border-blue-500 rounded-md px-4 py-2 text-lg">
              <SelectValue placeholder="-- ເລືອກສິດ --" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Password"
            className="w-full h-12 border-2 border-blue-500 rounded-md px-4 py-2 text-lg"
            disabled={isSubmitting}
          />
        </div>
        <DialogFooter className="flex gap-4 mt-6">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.id || !formData.name || !formData.last_name || !formData.email || !formData.role || !formData.password}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md text-lg"
            aria-label="ເພີ່ມພະນັກງານ"
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
 * Edit Employee Modal Component
 */
const EditEmployeeModal = ({ open, onOpenChange, employee, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    role: '',
    password: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        role: employee.role || '',
        password: employee.password || '',
      });
    }
  }, [employee]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(employee.id, formData);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const roleOptions = [
    { value: EMPLOYEE_ROLES.ADMIN, label: ROLE_LABELS.admin },
    { value: EMPLOYEE_ROLES.VERIFIER, label: ROLE_LABELS.verifier },
    { value: EMPLOYEE_ROLES.DATA_ENTRY, label: ROLE_LABELS.data_entry },
    { value: EMPLOYEE_ROLES.RECEIVER, label: ROLE_LABELS.receiver },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white rounded-lg p-8 w-full max-w-lg font-noto-sans-lao">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-gray-700">ແກ້ໄຂພະນັກງານ</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            value={employee?.id || ''}
            disabled
            className="w-full h-12 border-2 border-gray-300 rounded-md px-4 py-2 text-lg bg-gray-100"
          />
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="ຊື່"
            className="w-full h-12 border-2 border-blue-500 rounded-md px-4 py-2 text-lg"
            disabled={isSubmitting}
          />
          <Input
            type="text"
            value={formData.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
            placeholder="ນາມສະກຸນ"
            className="w-full h-12 border-2 border-blue-500 rounded-md px-4 py-2 text-lg"
            disabled={isSubmitting}
          />
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Email"
            className="w-full h-12 border-2 border-blue-500 rounded-md px-4 py-2 text-lg"
            disabled={isSubmitting}
          />
          <Select value={formData.role} onValueChange={(value) => handleChange('role', value)} disabled={isSubmitting}>
            <SelectTrigger className="w-full h-12 border-2 border-blue-500 rounded-md px-4 py-2 text-lg">
              <SelectValue placeholder="-- ເລືອກສິດ --" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Password (ຖ້າຈະປ່ຽນ)"
            className="w-full h-12 border-2 border-blue-500 rounded-md px-4 py-2 text-lg"
            disabled={isSubmitting}
          />
        </div>
        <DialogFooter className="flex gap-4 mt-6">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name || !formData.last_name || !formData.email || !formData.role}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md text-lg"
            aria-label="ບັນທຶກ"
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

export { Employee };
export default Employee;
