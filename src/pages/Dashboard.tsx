
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import BarChartComponent from '@/components/dashboard/BarChartComponent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, BookOpen, Award, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';

// Types for our data
type EstudiantesPorCarrera = {
  name: string;
  value: number;
}

type MateriaAprobacion = {
  name: string;
  value: number;
}

type ProximaInscripcion = {
  nombre: string;
  fecha: string;
  tipo: string;
}

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [totalCarreras, setTotalCarreras] = useState(0);
  const [totalMaterias, setTotalMaterias] = useState(0);
  const [tasaAprobacion, setTasaAprobacion] = useState(0);
  const [estudiantesPorCarrera, setEstudiantesPorCarrera] = useState<EstudiantesPorCarrera[]>([]);
  const [materiasAprobacion, setMateriasAprobacion] = useState<MateriaAprobacion[]>([]);
  const [proximasInscripciones, setProximasInscripciones] = useState<ProximaInscripcion[]>([]);
  
  // Check for authentication session
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
  
  // Fetch dashboard data
  useEffect(() => {
    if (!session) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch total estudiantes
        const { count: countEstudiantes } = await supabase
          .from('estudiantes')
          .select('*', { count: 'exact', head: true });
          
        setTotalEstudiantes(countEstudiantes || 0);
        
        // Fetch total carreras
        const { count: countCarreras } = await supabase
          .from('carreras')
          .select('*', { count: 'exact', head: true });
          
        setTotalCarreras(countCarreras || 0);
        
        // Fetch total materias
        const { count: countMaterias } = await supabase
          .from('materias')
          .select('*', { count: 'exact', head: true });
          
        setTotalMaterias(countMaterias || 0);
        
        // Fetch estudiantes por carrera
        const { data: carrerasData } = await supabase
          .from('carreras')
          .select('id, nombre');
        
        if (carrerasData) {
          const carrerasWithCount = await Promise.all(
            carrerasData.map(async (carrera) => {
              const { count } = await supabase
                .from('estudiantes')
                .select('*', { count: 'exact', head: true })
                .eq('carrera_id', carrera.id);
                
              return {
                name: carrera.nombre,
                value: count || 0
              };
            })
          );
          
          setEstudiantesPorCarrera(carrerasWithCount);
        }
        
        // Fetch materias con mayor tasa de aprobación
        const { data: materiasData } = await supabase
          .from('materias')
          .select('id, nombre, codigo')
          .limit(5);
          
        if (materiasData) {
          const materiasWithApproval = await Promise.all(
            materiasData.map(async (materia) => {
              const { count: totalEstados } = await supabase
                .from('estados_academicos')
                .select('*', { count: 'exact', head: true })
                .eq('materia_id', materia.id);
                
              const { count: aprobados } = await supabase
                .from('estados_academicos')
                .select('*', { count: 'exact', head: true })
                .eq('materia_id', materia.id)
                .eq('estado', 'Acreditada');
                
              const aprobacionRate = totalEstados ? Math.round((aprobados || 0) / totalEstados * 100) : 0;
              
              return {
                name: materia.codigo,
                value: aprobacionRate
              };
            })
          );
          
          setMateriasAprobacion(materiasWithApproval.sort((a, b) => b.value - a.value));
        }
        
        // Calculate overall approval rate
        const { count: totalEstados } = await supabase
          .from('estados_academicos')
          .select('*', { count: 'exact', head: true });
          
        const { count: totalAprobados } = await supabase
          .from('estados_academicos')
          .select('*', { count: 'exact', head: true })
          .eq('estado', 'Acreditada');
          
        setTasaAprobacion(totalEstados ? Math.round((totalAprobados || 0) / totalEstados * 100) : 0);
        
        // Fetch próximas inscripciones
        const { data: inscripcionesData } = await supabase
          .from('inscripciones')
          .select('id, fecha, tipo, materia_id')
          .gt('fecha', new Date().toISOString())
          .order('fecha', { ascending: true })
          .limit(3);
          
        if (inscripcionesData) {
          const inscripcionesWithMateria = await Promise.all(
            inscripcionesData.map(async (inscripcion) => {
              const { data: materia } = await supabase
                .from('materias')
                .select('nombre')
                .eq('id', inscripcion.materia_id)
                .single();
                
              return {
                nombre: materia?.nombre || 'Materia no encontrada',
                fecha: new Date(inscripcion.fecha).toLocaleDateString(),
                tipo: inscripcion.tipo
              };
            })
          );
          
          setProximasInscripciones(inscripcionesWithMateria);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [session]);

  // If loading, show a loading indicator
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!session) {
    return <Navigate to="/auth" />;
  }

  return (
    <MainLayout userRole="admin" userName={session?.user?.email?.split('@')[0] || 'Admin'}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel</h1>
          <p className="text-muted-foreground">Resumen del sistema académico</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total de Estudiantes"
            value={totalEstudiantes.toString()}
            icon={<Users className="h-4 w-4" />}
          />
          <StatsCard
            title="Carreras Activas"
            value={totalCarreras.toString()}
            icon={<GraduationCap className="h-4 w-4" />}
          />
          <StatsCard
            title="Materias"
            value={totalMaterias.toString()}
            icon={<BookOpen className="h-4 w-4" />}
          />
          <StatsCard
            title="Tasa de Aprobación"
            value={`${tasaAprobacion}%`}
            icon={<Award className="h-4 w-4" />}
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <BarChartComponent
            title="Estudiantes por Carrera"
            data={estudiantesPorCarrera.length > 0 ? estudiantesPorCarrera : [
              { name: 'Cargando datos...', value: 0 }
            ]}
            dataKey="value"
          />
          <BarChartComponent
            title="Materias con Mayor Tasa de Aprobación"
            data={materiasAprobacion.length > 0 ? materiasAprobacion : [
              { name: 'Cargando datos...', value: 0 }
            ]}
            dataKey="value"
            barColor="#10b981"
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-medium">Próximas Fechas de Inscripción</CardTitle>
              <CardDescription>Calendario de inscripciones abiertas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proximasInscripciones.length > 0 ? 
                  proximasInscripciones.map((item, i) => (
                    <div key={i} className="flex items-center">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {item.nombre}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.fecha} • {item.tipo}
                        </p>
                      </div>
                    </div>
                  ))
                : 
                  <p className="text-sm text-muted-foreground">No hay inscripciones próximas</p>
                }
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-medium">Resumen de Estado Académico</CardTitle>
              <CardDescription>Estado actual de los estudiantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cursando</span>
                  <div className="flex items-center">
                    <div className="h-2 w-32 rounded-full bg-gray-200">
                      <div className="h-2 w-[70%] rounded-full bg-blue-500"></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">70%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Regular</span>
                  <div className="flex items-center">
                    <div className="h-2 w-32 rounded-full bg-gray-200">
                      <div className="h-2 w-[15%] rounded-full bg-yellow-500"></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">15%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Acreditada</span>
                  <div className="flex items-center">
                    <div className="h-2 w-32 rounded-full bg-gray-200">
                      <div className="h-2 w-[55%] rounded-full bg-green-500"></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">55%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Libre</span>
                  <div className="flex items-center">
                    <div className="h-2 w-32 rounded-full bg-gray-200">
                      <div className="h-2 w-[10%] rounded-full bg-red-500"></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">10%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
