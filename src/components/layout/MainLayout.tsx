
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Header from './Header';
import Footer from './Footer';
import NavLinks from './NavLinks';
import { useMediaQuery } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
  userRole?: 'admin' | 'docente' | 'estudiante';
  userName?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className,
  userRole = 'admin',
  userName = 'Usuario'
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header userRole={userRole} userName={userName} />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={cn(
          "bg-slate-50 w-64 border-r transition-all",
          isMobile ? "fixed inset-y-0 -left-64 z-50" : ""
        )}>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-900">Panel Académico</h2>
            <p className="text-sm text-slate-500 mt-1">Gestión de estudiantes</p>
          </div>
          <NavLinks userRole={userRole} />
        </aside>
        
        {/* Main content */}
        <main className={cn(
          "flex-1 bg-white",
          className
        )}>
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
