
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, BookOpen, Users, Calendar, ClipboardList, FileText
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
  const links: NavLink[] = [
    { to: '/', label: 'Dashboard', icon: <Home className="h-4 w-4 mr-2" />, roles: ['admin', 'docente', 'estudiante'] },
    { to: '/carreras', label: 'Carreras', icon: <BookOpen className="h-4 w-4 mr-2" />, roles: ['admin', 'docente', 'estudiante'] },
    { to: '/estudiantes', label: 'Estudiantes', icon: <Users className="h-4 w-4 mr-2" />, roles: ['admin', 'docente'] },
    { to: '/inscripciones', label: 'Inscripciones', icon: <Calendar className="h-4 w-4 mr-2" />, roles: ['admin', 'estudiante'] },
    { to: '/materias', label: 'Materias', icon: <ClipboardList className="h-4 w-4 mr-2" />, roles: ['admin', 'docente'] },
    { to: '/legajo', label: 'Mi Legajo', icon: <FileText className="h-4 w-4 mr-2" />, roles: ['estudiante'] },
  ];

  const filteredLinks = links.filter(link => link.roles.includes(userRole));

  return (
    <nav className={className}>
      {filteredLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
