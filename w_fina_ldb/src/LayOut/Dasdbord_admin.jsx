import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ClipboardList, Briefcase, User, LogOut, Menu, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ConfirmLogoutDialog = ({ open, onConfirm, onCancel }) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-md font-noto-sans-lao animate-in fade-in duration-300 bg-white rounded-xl shadow-2xl z-[1000]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-800">
            ຢືນຢັນການອອກຈາກລະບົບ
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center">
          <p className="text-base text-gray-700">ທ່ານຕ້ອງການອອກຈາກລະບົບບໍ?</p>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="h-10 px-6 border-gray-300 text-gray-700 hover:bg-gray-100 font-noto-sans-lao"
            >
              ຍົກເລີກ
            </Button>
          </DialogClose>
          <Button
            onClick={onConfirm}
            className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white active:scale-95 font-noto-sans-lao"
          >
            ອອກຈາກລະບົບ
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
        className="flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold transition-all duration-200 hover:scale-105 hover:bg-gray-100 text-blue-800 focus:outline-none"
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

const Dasdbord_admin = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Admin');
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ເພີ່ມ

  useEffect(() => {
    const employee = JSON.parse(localStorage.getItem('employee'));
    if (employee && employee.name) setUserName(employee.name);
  }, []);

  const handleLogout = () => setIsLogoutDialogOpen(true);
  const confirmLogout = () => {
    localStorage.removeItem('employee');
    localStorage.removeItem('token');
    setIsLogoutDialogOpen(false);
    navigate('/');
  };
  const cancelLogout = () => setIsLogoutDialogOpen(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="flex justify-between items-center px-6 py-4">

          {/* ຊ້າຍ: Logos */}
          <div className="flex items-center space-x-4">
            <img src="/fina.png" alt="Fina Logo" className="h-10 w-auto" />
            <img src="/im1.png" alt="LDB Logo" className="h-10 w-auto" />
          </div>

          {/* ຂວາ Desktop */}
          <div className="hidden md:flex space-x-4 items-center">
            <NavLink
              to=""
              end
              className={({ isActive }) =>
                `px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 bg-gray-200 hover:bg-gray-300'
                }`
              }
            >
              Audit Log
            </NavLink>

            <NavLink
              to="management"
              className={({ isActive }) =>
                `px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 bg-gray-200 hover:bg-gray-300'
                }`
              }
            >
              Management
            </NavLink>

            <UserDropdown userName={userName} onLogout={handleLogout} />
          </div>

          {/* Hamburger Mobile */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 space-y-2">
            <NavLink
              to=""
              end
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`
              }
            >
              Audit Log
            </NavLink>

            <NavLink
              to="management"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`
              }
            >
              Management
            </NavLink>

            {/* User + Logout */}
            <div className="border-t border-gray-100 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 text-gray-700 font-semibold">
                <User size={18} />
                <span>{userName}</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl"
              >
                <LogOut size={16} />
                <span>ອອກຈາກລະບົບ</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="p-8">
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

export default Dasdbord_admin;