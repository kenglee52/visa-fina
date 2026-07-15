import React, { useEffect, useState, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ClipboardList, Briefcase, User, LogOut, CreditCard, ClipboardPenLine, FileClock, Menu, X, Lock, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { API_BASE_URL } from '@/config/env.config';
import { useAuth } from '@/hooks/auth/useAuth';

// ========== Confirm Logout Dialog ==========
const ConfirmLogoutDialog = ({ open, onConfirm, onCancel }) => (
  <Dialog open={open} onOpenChange={onCancel}>
    <DialogContent className="max-w-md font-noto-sans-lao animate-in fade-in duration-200 bg-white rounded-xl shadow-2xl z-[1000]">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-blue-800">ຢືນຢັນການອອກຈາກລະບົບ</DialogTitle>
      </DialogHeader>
      <div className="py-4 text-center">
        <p className="text-base text-gray-700">ທ່ານຕ້ອງການອອກຈາກລະບົບບໍ?</p>
      </div>
      <DialogFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="h-10 px-6 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 font-noto-sans-lao"
        >
          ຍົກເລີກ
        </Button>
        <Button
          onClick={onConfirm}
          className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 active:scale-95 font-noto-sans-lao"
        >
          ອອກຈາກລະບົບ
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// ========== Receiver Login Dialog ==========
const ReceiverLoginDialog = ({ open, onClose, onSuccess }) => {
  const [receiverId, setReceiverId] = useState('');
  const [receiverPassword, setReceiverPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setReceiverId('');
    setReceiverPassword('');
    setError('');
    setLoading(false);
    onClose();
  };

  const handleLogin = async () => {
    if (!receiverId || !receiverPassword) {
      setError('ກະລຸນາກອກ ID ແລະ ລະຫັດຜ່ານ');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/verify-receiver-password`, {
        id: receiverId,
        password: receiverPassword,
        requiredRole: 'receiver', // ✅ ໃຫ້ backend ກວດ role ໃຫ້ນຳ
      });

      // const { employee } = response.data.data || response.data;

      // if (employee?.role !== 'receiver') {
      //   setError('ໜ້ານີ້ສຳລັບ Receiver ເທົ່ານັ້ນ — ບັນຊີຂອງທ່ານບໍ່ມີສິດເຂົ້າໃຊ້');
      //   setLoading(false);
      //   return;
      // }

      // // Store receiver session separately (don't overwrite the current verifier session)
      // sessionStorage.setItem('receiver_token', token);
      // sessionStorage.setItem('receiver_employee', JSON.stringify(employee));

      handleClose();
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'ID ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md font-noto-sans-lao animate-in fade-in duration-200 bg-white rounded-xl shadow-2xl z-[1000]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-100 rounded-full">
              <Lock size={20} className="text-blue-700" />
            </div>
            <DialogTitle className="text-xl font-bold text-blue-800">
              ເຂົ້າສູ່ລະບົບ Receiver
            </DialogTitle>
          </div>
          <p className="text-sm text-gray-500 pl-1">
            ໜ້ານີ້ສຳລັບ <span className="font-semibold text-blue-700">Receiver</span> ເທົ່ານັ້ນ — ກະລຸນາ Login ດ້ວຍບັນຊີ Receiver
          </p>
        </DialogHeader>

        <div className="py-2 space-y-4">
          {/* Employee ID */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">ID ພະນັກງານ</label>
            <Input
              placeholder="ກອກ ID ພະນັກງານ..."
              value={receiverId}
              onChange={(e) => { setReceiverId(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              className="h-10 border-blue-300 focus:border-blue-500 font-noto-sans-lao"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">ລະຫັດຜ່ານ</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="ກອກລະຫັດຜ່ານ..."
                value={receiverPassword}
                onChange={(e) => { setReceiverPassword(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                className="h-10 border-blue-300 focus:border-blue-500 font-noto-sans-lao pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="h-10 px-6 border-gray-300 text-gray-700 hover:bg-gray-100 font-noto-sans-lao"
          >
            ຍົກເລີກ
          </Button>
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white active:scale-95 font-noto-sans-lao"
          >
            {loading ? 'ກຳລັງກວດສອບ...' : 'ເຂົ້າລະບົບ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ========== User Dropdown ==========
const UserDropdown = ({ userName, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold transition-all duration-200 transform hover:scale-105 hover:bg-gray-100 text-blue-800 focus:outline-none"
      >
        <User size={20} />
        <span>{userName}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[1000]">
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut size={16} />
            <span>ອອກຈາກລະບົບ <span className="text-red-600">*</span></span>
          </button>
        </div>
      )}
    </div>
  );
};

// ========== Main Layout ==========
const Layout_verifier = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState('ບັນຊີຜູ້ໃຊ້');
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Receiver login popup state
  const [receiverLoginOpen, setReceiverLoginOpen] = useState(false);
  const [receiverUnlocked, setReceiverUnlocked] = useState(false);

  useEffect(() => {
    const employee = JSON.parse(localStorage.getItem('employee'));
    if (employee && employee.name) {
      setUserName(employee.name);
      navigate('verifie-check', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
    // Clear receiver session on layout mount
    sessionStorage.removeItem('receiver_token');
    sessionStorage.removeItem('receiver_employee');
  }, [navigate]);

  // Watch route: if navigated away from verifie-received, lock it again
  useEffect(() => {
    if (!location.pathname.includes('verifie-received')) {
      setReceiverUnlocked(false);
      sessionStorage.removeItem('receiver_token');
      sessionStorage.removeItem('receiver_employee');
    }
  }, [location.pathname]);

  // const handleLogout = () => setIsLogoutDialogOpen(true);
  // const confirmLogout = () => {
  //   localStorage.removeItem('employee');
  //   localStorage.removeItem('token');
  //   sessionStorage.removeItem('receiver_token');
  //   sessionStorage.removeItem('receiver_employee');
  //   setIsLogoutDialogOpen(false);
  //   navigate('/', { replace: true });
  // };
  const { logout } = useAuth(); // ✅ ດຶງມາໃຊ້

  const handleLogout = () => setIsLogoutDialogOpen(true);

  const confirmLogout = async () => {
    await logout(); // ✅ ຮ້ອງຜ່ານ hook (ຈະ redirect ໄປໜ້າ login ໃຫ້ອັດຕະໂນມັດ)

    // ✅ ຍັງລຶບ receiver token ເພີ່ມ ຖ້າ role ນັ້ນມີ storage ແຍກຕ່າງຫາກ
    sessionStorage.removeItem('receiver_token');
    sessionStorage.removeItem('receiver_employee');

    setIsLogoutDialogOpen(false);
    // ✅ ບໍ່ຈຳເປັນຕ້ອງ navigate('/') ຊ້ຳອີກ ເພາະ logout() ໃນ useAuth navigate ໄປ ROUTES.LOGIN ໃຫ້ແລ້ວ
  };
  const cancelLogout = () => setIsLogoutDialogOpen(false);

  // Called when user clicks "ມາຮັບເອົາບັດ VISA"
  const handleReceivedMenuClick = (e) => {
    if (!receiverUnlocked) {
      e.preventDefault(); // block NavLink navigation
      setReceiverLoginOpen(true);
    }
    // if already unlocked, let NavLink navigate normally
  };

  // Called after successful receiver login
  const handleReceiverLoginSuccess = () => {
    setReceiverUnlocked(true);
    setMobileMenuOpen(false);
    navigate('verifie-received');
  };

  // Shared nav link style fn
  const navClass = (isActive, activeColor) =>
    `flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold transition-all duration-200 transform hover:scale-105
    ${isActive ? `${activeColor} text-white shadow-lg` : 'text-blue-800 hover:bg-blue-100'}`;

  return (
    <div className="flex flex-col min-h-screen font-noto-sans-lao bg-blue-50">
      {/* ===== Navbar ===== */}
      <nav className="bg-white shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logos */}
          <div className="flex items-center space-x-4">
            <img src="/fina.png" alt="Fina Logo" className="h-10 w-auto" />
            <img src="/im1.png" alt="LDB Logo" className="h-10 w-auto" />
            <img src="/laoloca.png" alt="LOCA Logo" className="h-10 w-auto" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="verifie-check"
              className={({ isActive }) => navClass(isActive, 'bg-orange-500')}
            >
              <ClipboardList size={20} />
              <span>ກວດສອບເອກະສານ</span>
            </NavLink>

            <NavLink
              to="verifie-issued"
              className={({ isActive }) => navClass(isActive, 'bg-blue-600')}
            >
              <CreditCard size={20} />
              <span>ອອກບັດ VISA</span>
            </NavLink>

            {/* ===== ມາຮັບເອົາບັດ VISA — guarded ===== */}
            <NavLink
              to="verifie-received"
              onClick={handleReceivedMenuClick}
              className={({ isActive }) => navClass(isActive, 'bg-blue-600')}
            >
              <ClipboardPenLine size={20} />
              <span>ມາຮັບເອົາບັດ VISA</span>
              {!receiverUnlocked && (
                <Lock size={14} className="ml-1 opacity-60" />
              )}
            </NavLink>

            <UserDropdown userName={userName} onLogout={handleLogout} />
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-blue-800 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 space-y-2">
            <NavLink
              to="verifie-check"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => navClass(isActive, 'bg-orange-500')}
            >
              <ClipboardList size={20} />
              <span>ກວດສອບເອກະສານ</span>
            </NavLink>

            <NavLink
              to="verifie-issued"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => navClass(isActive, 'bg-blue-600')}
            >
              <CreditCard size={20} />
              <span>ອອກບັດ VISA</span>
            </NavLink>

            {/* ===== Mobile: ມາຮັບເອົາບັດ VISA — guarded ===== */}
            <NavLink
              to="verifie-received"
              onClick={handleReceivedMenuClick}
              className={({ isActive }) => navClass(isActive, 'bg-blue-600')}
            >
              <ClipboardPenLine size={20} />
              <span>ມາຮັບເອົາບັດ VISA</span>
              {!receiverUnlocked && (
                <Lock size={14} className="ml-1 opacity-60" />
              )}
            </NavLink>

            {/* User + Logout */}
            <div className="border-t border-gray-100 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 text-blue-800 font-semibold">
                <User size={18} />
                <span>{userName}</span>
              </div>
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl"
              >
                <LogOut size={16} />
                <span>ອອກຈາກລະບົບ</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ===== Main Content ===== */}
      <main className="flex-1 container mx-auto p-4 sm:p-8">
        <Outlet />
      </main>

      {/* ===== Dialogs ===== */}
      <ConfirmLogoutDialog
        open={isLogoutDialogOpen}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />

      <ReceiverLoginDialog
        open={receiverLoginOpen}
        onClose={() => setReceiverLoginOpen(false)}
        onSuccess={handleReceiverLoginSuccess}
      />
    </div>
  );
};

export default Layout_verifier;