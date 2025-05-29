import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-slate-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
              <line x1="6" y1="6" x2="6" y2="6"></line>
              <line x1="6" y1="18" x2="6" y2="18"></line>
            </svg>
            <h1 className="text-xl font-bold">서버 구성 시스템</h1>
          </div>
          <div className="flex space-x-4">
            <button className="px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-700 transition">저장</button>
            <button className="px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-700 transition">불러오기</button>
            <button className="px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-700 transition">내보내기</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white p-4">
        <div className="container mx-auto text-center text-sm">
          <p>서버 구성 시스템 데모 - 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
