import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Dashboard</h1>
        <div className="flex space-x-4">
          <button className="px-6 py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors">
            Analytics
          </button>
          <button className="px-6 py-3 rounded-lg text-gray-600 font-semibold bg-gray-200 hover:bg-gray-300 transition-colors">
            Reports
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ตัวอย่างการ์ดแสดงข้อมูล */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-500">ยอดขายรวม</h2>
          <p className="mt-2 text-4xl font-bold text-blue-600">฿ 1,234,567</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-500">ผู้ใช้งานใหม่</h2>
          <p className="mt-2 text-4xl font-bold text-green-600">456</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-500">อัตราการเข้าชม</h2>
          <p className="mt-2 text-4xl font-bold text-orange-600">85%</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;