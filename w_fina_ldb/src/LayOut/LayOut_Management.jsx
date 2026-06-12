import React, { useEffect, useState, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ClipboardList, Briefcase, User, LogOut } from 'lucide-react';





const LayOut_Management = () => {
    const navigate = useNavigate();
      const [userName, setUserName] = useState('');

    useEffect(() => {
        const employee = JSON.parse(localStorage.getItem('employee'));
        if (employee && employee.name) {
            console.log('Employee loaded from localStorage:', employee);
            setUserName(employee.name);
        }
    }, []);

  //fsfjoifjewoif
 

    return (
        <div className="flex flex-col min-h-screen font-noto-sans-lao bg-blue-50">
            {/* Navbar with two logos */}
            <nav className="bg-white shadow-xl sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Left Section: Logos */}


                    {/* Right Section: Navigation Buttons */}
                    <div className="flex items-center space-x-6">
                        <NavLink
                            to="" end 
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold transition-all duration-200 transform hover:scale-105
                ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-800 hover:bg-blue-100'}`
                            }

                        >
                            <ClipboardList size={20} />
                            <span>ແຂວງ</span>
                        </NavLink>

                        <NavLink
                            to="districts"
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold transition-all duration-200 transform hover:scale-105
                ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-800 hover:bg-blue-100'}`
                            }
                        >
                            <Briefcase size={20} />
                            <span>ເມືອງ</span>
                        </NavLink>
                        <NavLink
                            to="employee"
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold transition-all duration-200 transform hover:scale-105
                ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-800 hover:bg-blue-100'}`
                            }
                        >
                            <Briefcase size={20} />
                            <span>ພະນັກງານ</span>
                        </NavLink>

                    
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 container mx-auto p-4 sm:p-8">
                <Outlet />
            </main>

        </div>
    );
};

export default LayOut_Management;