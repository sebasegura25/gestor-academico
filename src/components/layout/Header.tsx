
import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import NavLinks from './NavLinks';

type HeaderProps = {
  userRole?: 'admin' | 'docente' | 'estudiante';
  userName?: string;
};

const Header: React.FC<HeaderProps> = ({ 
  userRole = 'admin', 
  userName = 'Usuario Demo' 
}) => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Gestor Académico</h1>
            </Link>
          </div>

          {!isMobile ? (
            <div className="flex items-center space-x-4">
              <NavLinks userRole={userRole} className="flex ml-10" />
              <div className="flex items-center ml-6">
                <span className="text-sm text-gray-600 mr-2">{userName}</span>
                <Button variant="outline" size="icon" className="rounded-full">
                  <UserCircle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col h-full">
                  <div className="py-4 border-b">
                    <div className="flex items-center mb-2">
                      <UserCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">{userName}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {userRole === 'admin' && 'Administrador'}
                      {userRole === 'docente' && 'Docente'}
                      {userRole === 'estudiante' && 'Estudiante'}
                    </div>
                  </div>
                  <NavLinks userRole={userRole} className="flex flex-col mt-4 space-y-3" />
                  <div className="mt-auto border-t py-4">
                    <Button variant="outline" className="w-full" size="sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar sesión
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
