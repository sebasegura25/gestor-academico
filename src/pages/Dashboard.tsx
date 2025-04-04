
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import BarChartComponent from '@/components/dashboard/BarChartComponent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, BookOpen, Award, Clock } from 'lucide-react';

// Mock data for charts
const estudiantesPorCarreraData = [
  { name: 'Analista de Sistemas', value: 45 },
  { name: 'Administración', value: 35 },
  { name: 'Profesorado', value: 28 },
  { name: 'Diseño', value: 22 },
  { name: 'Enfermería', value: 18 },
];

const materiasAprobacionData = [
  { name: 'Programación I', value: 87 },
  { name: 'Matemática', value: 76 },
  { name: 'Estadística', value: 72 },
  { name: 'Inglés Técnico', value: 68 },
  { name: 'Sistemas Operativos', value: 65 },
];

const proximasInscripcionesData = [
  { nombre: 'Programación II', fecha: '15/04/2025', tipo: 'Cursada' },
  { nombre: 'Análisis Matemático', fecha: '18/04/2025', tipo: 'Examen' },
  { nombre: 'Inglés Técnico', fecha: '22/04/2025', tipo: 'Cursada' },
];

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  
  React.useEffect(() => {
    toast({
      title: "Bienvenido al sistema de gestión académica",
      description: "Período académico: 1er Cuatrimestre 2025",
    });
  }, []);

  return (
    <MainLayout userRole="admin" userName="Admin Demo">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel</h1>
          <p className="text-muted-foreground">Resumen del sistema académico</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total de Estudiantes"
            value="248"
            icon={<Users className="h-4 w-4" />}
            description="+12% desde el período anterior"
          />
          <StatsCard
            title="Carreras Activas"
            value="8"
            icon={<GraduationCap className="h-4 w-4" />}
          />
          <StatsCard
            title="Materias"
            value="64"
            icon={<BookOpen className="h-4 w-4" />}
          />
          <StatsCard
            title="Tasa de Aprobación"
            value="76%"
            icon={<Award className="h-4 w-4" />}
            description="+4% desde el período anterior"
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <BarChartComponent
            title="Estudiantes por Carrera"
            data={estudiantesPorCarreraData}
            dataKey="value"
          />
          <BarChartComponent
            title="Materias con Mayor Tasa de Aprobación"
            data={materiasAprobacionData}
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
                {proximasInscripcionesData.map((item, i) => (
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
                ))}
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
