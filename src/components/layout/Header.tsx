
import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeaderProps = {
  userRole?: 'admin' | 'docente' | 'estudiante';
  userName?: string;
};

const Header: React.FC<HeaderProps> = ({ 
  userRole = 'admin', 
  userName = 'Usuario Demo' 
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Gestor Académico</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">{userName}</span>
              <Button variant="outline" size="icon" className="rounded-full">
                <UserCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
