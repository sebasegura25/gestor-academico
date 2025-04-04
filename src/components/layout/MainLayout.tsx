
import React from 'react';
import Header from './Header';
import Footer from './Footer';

type MainLayoutProps = {
  children: React.ReactNode;
  userRole?: 'admin' | 'docente' | 'estudiante';
  userName?: string;
};

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  userRole = 'admin',
  userName = 'Usuario Demo' 
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-appBackground">
      <Header userRole={userRole} userName={userName} />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
