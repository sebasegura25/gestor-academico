
import React, { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Header from './Header';
import Footer from './Footer';
import NavLinks from './NavLinks';
import { useToast } from '@/hooks/use-toast';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Home, BookOpen, Users, Calendar, ClipboardList, FileText, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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
  const { toast } = useToast();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(true);

  // Show welcome toast on dashboard
  React.useEffect(() => {
    if (location.pathname === '/') {
      toast({
        title: "Bienvenido al sistema de gestión académica",
      });
    }
  }, [location.pathname, toast]);

  const links = [
    { to: '/', label: 'Panel', icon: <Home className="h-4 w-4" />, roles: ['admin', 'docente', 'estudiante'] },
    { to: '/carreras', label: 'Carreras', icon: <BookOpen className="h-4 w-4" />, roles: ['admin', 'docente', 'estudiante'] },
    { to: '/estudiantes', label: 'Estudiantes', icon: <Users className="h-4 w-4" />, roles: ['admin', 'docente'] },
    { to: '/materias', label: 'Materias', icon: <ClipboardList className="h-4 w-4" />, roles: ['admin', 'docente'] },
    { to: '/inscripciones', label: 'Inscripciones', icon: <Calendar className="h-4 w-4" />, roles: ['admin', 'estudiante'] },
    { to: '/legajo', label: 'Mi Legajo', icon: <FileText className="h-4 w-4" />, roles: ['estudiante'] },
    { to: '/correlatividades', label: 'Correlatividades', icon: <ArrowRight className="h-4 w-4" />, roles: ['admin'] },
  ];

  const filteredLinks = links.filter(link => link.roles.includes(userRole));

  return (
    <SidebarProvider defaultOpen={showSidebar}>
      <div className="flex flex-col min-h-screen w-full">
        <Header userRole={userRole} userName={userName} />
        
        <div className="flex flex-1 bg-slate-100">
          {/* Regular sidebar without hover behavior */}
          <Sidebar 
            collapsible="none" 
            variant="floating"
          >
            <SidebarHeader>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-slate-900">Panel Académico</h2>
                <p className="text-sm text-slate-500 mt-1">Gestión de estudiantes</p>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navegación</SidebarGroupLabel>
                <SidebarMenu>
                  {filteredLinks.map((link) => (
                    <SidebarMenuItem key={link.to}>
                      <SidebarMenuButton 
                        asChild
                        isActive={location.pathname === link.to}
                        tooltip={link.label}
                      >
                        <Link to={link.to}>
                          {link.icon}
                          <span>{link.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarRail />
          </Sidebar>

          {/* Main content */}
          <main className={cn("flex-1 bg-white", className)}>
            <div className="container mx-auto p-6">
              {children}
            </div>
          </main>
        </div>
        
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
