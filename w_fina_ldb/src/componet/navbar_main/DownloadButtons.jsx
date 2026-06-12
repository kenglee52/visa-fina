import React from 'react';

const DownloadButtons = () => {
  return (
    <div className="flex flex-col items-center space-y-0 p-2">
   

      <div className="flex space-x-0">
        {/* ปุ่มสำหรับ Google Play Store */}
        <a 
          href="https://play.google.com/store/apps/details?id=com.fina.subscriber.production" 
          target="_blank" 
          rel="noopener noreferrer"
          
        >
         <img
              src="/googleplay.png"
              alt="logo"
              className="w-28 h-24 object-contain"
              />
        </a>

        {/* ปุ่มสำหรับ Apple App Store */}
        <a 
          href="https://apps.apple.com/us/app/your-app-name/id123456789" 
          target="_blank" 
          rel="noopener noreferrer"
          
        >
         <img 
              src="/logoappstore.svg"
              alt="logo"
              className="w-28 h-24 object-contain"
              />
              
        </a>
      </div>
    </div>
  );
};

export default DownloadButtons;