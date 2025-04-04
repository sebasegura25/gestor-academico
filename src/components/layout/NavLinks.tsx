
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, BookOpen, Users, Calendar, ClipboardList, FileText, ArrowRight
} from 'lucide-react';

type NavLinksProps = {
  userRole: 'admin' | 'docente' | 'estudiante';
  className?: string;
};

type NavLink = {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles: ('admin' | 'docente' | 'estudiante')[];
};

const NavLinks: React.FC<NavLinksProps> = ({ userRole, className = '' }) => {
  const location = useLocation();
  
  const links: NavLink[] = [
    { to: '/', label: 'Panel', icon: <Home className="h-4 w-4 mr-2" />, roles: ['admin', 'docente', 'estudiante'] },
    { to: '/carreras', label: 'Carreras', icon: <BookOpen className="h-4 w-4 mr-2" />, roles: ['admin', 'docente', 'estudiante'] },
    { to: '/estudiantes', label: 'Estudiantes', icon: <Users className="h-4 w-4 mr-2" />, roles: ['admin', 'docente'] },
    { to: '/materias', label: 'Materias', icon: <ClipboardList className="h-4 w-4 mr-2" />, roles: ['admin', 'docente'] },
    { to: '/inscripciones', label: 'Inscripciones', icon: <Calendar className="h-4 w-4 mr-2" />, roles: ['admin', 'estudiante'] },
    { to: '/legajo', label: 'Mi Legajo', icon: <FileText className="h-4 w-4 mr-2" />, roles: ['estudiante'] },
    { to: '/correlatividades', label: 'Correlatividades', icon: <ArrowRight className="h-4 w-4 mr-2" />, roles: ['admin'] },
  ];

  const filteredLinks = links.filter(link => link.roles.includes(userRole));

  return (
    <nav className={className}>
      {filteredLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors ${
            location.pathname === link.to ? 'bg-gray-50 text-primary' : ''
          }`}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
