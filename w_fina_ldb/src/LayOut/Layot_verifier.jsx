import React, { useEffect, useState, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ClipboardList, Briefcase, User, LogOut,CreditCard,ClipboardPenLine ,FileClock} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ConfirmLogoutDialog = ({ open, onConfirm, onCancel }) => {
  return (
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
            ອອກຈາກລະຬົບ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
            <span>ອອກຈາກລະຬົບ <span className="text-red-600">*</span></span>
          </button>
        </div>
      )}
    </div>
  );
};

const Layout_verifier = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('ບັນຊີຜູ້ໃຊ້');
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  useEffect(() => {
    const employee = JSON.parse(localStorage.getItem('employee'));
    if (employee && employee.name) {
      setUserName(employee.name);
      // redirect หน้า default verifie-check
      navigate('verifie-check', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => setIsLogoutDialogOpen(true);
  const confirmLogout = () => {
    localStorage.removeItem('employee');
    localStorage.removeItem('token');
    setIsLogoutDialogOpen(false);
    navigate('/', { replace: true });
  };
  const cancelLogout = () => setIsLogoutDialogOpen(false);

  return (
    <div className="flex flex-col min-h-screen font-noto-sans-lao bg-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/fina.png" alt="Fina Logo" className="h-10 w-auto" />
            <img src="/im1.png" alt="LDB Logo" className="h-10 w-auto" />
          </div>

          <div className="flex items-center space-x-6">
            <NavLink
              to="verifie-check"
              className={({ isActive }) =>
                `flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold transition-all duration-200 transform hover:scale-105
                ${isActive ? 'bg-orange-500 text-white shadow-lg' : 'text-blue-800 hover:bg-orange-100'}`
              }
            >
              <ClipboardList size={20} />
              <span>ກວດສອບເອກະສານ</span>
            </NavLink>

            <NavLink
              to="verifie-issued"
              className={({ isActive }) =>
                `flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold transition-all duration-200 transform hover:scale-105
                ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-800 hover:bg-blue-100'}`
              }
            >
              <CreditCard size={20} />
              <span>ອອກບັດ VISA</span>
            </NavLink>
             <NavLink
              to="verifie-received"
              className={({ isActive }) =>
                `flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold transition-all duration-200 transform hover:scale-105
                ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-800 hover:bg-blue-100'}`
              }
            >
              <ClipboardPenLine size={20} />
              <span>ມາຣັບເອົາບັດ VISA</span>
            </NavLink>
             
            <UserDropdown userName={userName} onLogout={handleLogout} />
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto p-4 sm:p-8">
        <Outlet />
      </main>

      <ConfirmLogoutDialog
        open={isLogoutDialogOpen}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
};

export default Layout_verifier;
