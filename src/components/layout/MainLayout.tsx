
import React, { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Header from './Header';
import Footer from './Footer';
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
} from '@/components/ui/sidebar';
import { Home, BookOpen, Users, Calendar, ClipboardList, FileText, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className,
}) => {
  const { toast } = useToast();
  const location = useLocation();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch auth session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    
    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  // Show welcome toast on dashboard
  useEffect(() => {
    if (location.pathname === '/' && !loading) {
      toast({
        title: "Bienvenido al sistema de gestión académica",
      });
    }
  }, [location.pathname, toast, loading]);

  const userRole = 'admin'; // For now all authenticated users are admins
  const userName = session?.user?.email?.split('@')[0] || 'Usuario';

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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-col min-h-screen w-full">
        <Header userName={userName} userEmail={session?.user?.email} />
        
        <div className="flex flex-1 bg-slate-100">
          {/* Sidebar fixed */}
          <Sidebar 
            collapsible="none" 
            variant="sidebar"
            className="h-full"
          >
            <SidebarHeader>
              <h2 className="text-xl font-semibold text-slate-900">Panel Académico</h2>
              <p className="text-sm text-slate-500 mt-1">Gestión de estudiantes</p>
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
