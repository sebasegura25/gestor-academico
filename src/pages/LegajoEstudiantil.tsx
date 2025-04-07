import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MateriaCard from '@/components/academico/MateriaCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, BookOpen, GraduationCap, CalendarDays } from 'lucide-react';

// Datos de ejemplo para el legajo estudiantil
const datosEstudiante = {
  nombre: 'Juan Pérez',
  dni: '38456789',
  email: 'juan.perez@estudiantes.edu.ar',
  fechaIngreso: '12/03/2022',
  carrera: 'Técnico Superior en Análisis de Sistemas',
  promedio: 7.8,
  materiasCursadas: 12,
  materiasAprobadas: 8,
};

const materiasData = [
  {
    id: "mat101",
    codigo: 'MAT101',
    nombre: 'Álgebra I',
    estado: 'Acreditada',
    fecha: '15/12/2023',
    nota: 8,
    year: 1,
    cuatrimestre: 1
  },
  {
    id: "prog101",
    codigo: 'PROG101',
    nombre: 'Programación I',
    estado: 'Acreditada',
    fecha: '20/07/2023',
    nota: 9,
    year: 1,
    cuatrimestre: 1
  },
  {
    id: "bd101",
    codigo: 'BD101',
    nombre: 'Bases de Datos',
    estado: 'Acreditada',
    fecha: '18/12/2023',
    nota: 7,
    year: 1,
    cuatrimestre: 2
  },
  {
    id: "eng101",
    codigo: 'ENG101',
    nombre: 'Inglés Técnico I',
    estado: 'Acreditada',
    fecha: '12/07/2023',
    nota: 8,
    year: 1,
    cuatrimestre: 1
  },
  {
    id: "mat201",
    codigo: 'MAT201',
    nombre: 'Análisis Matemático',
    estado: 'Regular',
    fecha: '10/12/2024',
    year: 1,
    cuatrimestre: 2
  },
  {
    id: "prog201",
    codigo: 'PROG201',
    nombre: 'Programación II',
    estado: 'Cursando',
    year: 2,
    cuatrimestre: 1
  },
  {
    id: "os101",
    codigo: 'OS101',
    nombre: 'Sistemas Operativos',
    estado: 'Libre',
    year: 2,
    cuatrimestre: 1
  },
  {
    id: "net101",
    codigo: 'NET101',
    nombre: 'Redes',
    estado: 'Cursando',
    year: 2,
    cuatrimestre: 1
  },
];

const LegajoEstudiantil: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mi Legajo Académico</h1>
          <p className="text-muted-foreground">Estado académico y progreso en la carrera</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-card md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{datosEstudiante.nombre}</p>
                  <p className="text-sm text-muted-foreground">DNI: {datosEstudiante.dni}</p>
                </div>
              </div>
              <div className="pt-2 border-t text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{datosEstudiante.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ingreso:</span>
                  <span className="font-medium">{datosEstudiante.fechaIngreso}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carrera:</span>
                  <span className="font-medium">{datosEstudiante.carrera}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Resumen Académico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">{datosEstudiante.promedio}</div>
                  <div className="text-xs text-muted-foreground text-center">Promedio General</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-1">{datosEstudiante.materiasAprobadas}</div>
                  <div className="text-xs text-muted-foreground text-center">Materias Aprobadas</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{datosEstudiante.materiasCursadas}</div>
                  <div className="text-xs text-muted-foreground text-center">Materias Cursadas</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center mb-2">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Progreso de la Carrera</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-primary rounded-full" 
                    style={{ width: `${(datosEstudiante.materiasAprobadas / 24) * 100}%` }} 
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{datosEstudiante.materiasAprobadas} de 24 materias</span>
                  <span>{Math.round((datosEstudiante.materiasAprobadas / 24) * 100)}% completado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Estado de Materias</CardTitle>
            <CardDescription>Vista detallada de todas las materias y su estado académico</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="todas">
              <TabsList className="mb-4">
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="acreditadas">Acreditadas</TabsTrigger>
                <TabsTrigger value="regulares">Regulares</TabsTrigger>
                <TabsTrigger value="cursando">Cursando</TabsTrigger>
                <TabsTrigger value="libres">Libres</TabsTrigger>
              </TabsList>
              
              <TabsContent value="todas" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materiasData.map((materia, index) => (
                    <MateriaCard
                      key={index}
                      id={materia.id}
                      codigo={materia.codigo}
                      nombre={materia.nombre}
                      estado={materia.estado as 'Acreditada' | 'Regular' | 'Cursando' | 'Libre'}
                      fecha={materia.fecha}
                      nota={materia.nota}
                      year={materia.year}
                      cuatrimestre={materia.cuatrimestre}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="acreditadas" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materiasData.filter(m => m.estado === 'Acreditada').map((materia, index) => (
                    <MateriaCard
                      key={index}
                      id={materia.id}
                      codigo={materia.codigo}
                      nombre={materia.nombre}
                      estado={materia.estado as 'Acreditada' | 'Regular' | 'Cursando' | 'Libre'}
                      fecha={materia.fecha}
                      nota={materia.nota}
                      year={materia.year}
                      cuatrimestre={materia.cuatrimestre}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="regulares" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materiasData.filter(m => m.estado === 'Regular').map((materia, index) => (
                    <MateriaCard
                      key={index}
                      id={materia.id}
                      codigo={materia.codigo}
                      nombre={materia.nombre}
                      estado={materia.estado as 'Acreditada' | 'Regular' | 'Cursando' | 'Libre'}
                      fecha={materia.fecha}
                      nota={materia.nota}
                      year={materia.year}
                      cuatrimestre={materia.cuatrimestre}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="cursando" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materiasData.filter(m => m.estado === 'Cursando').map((materia, index) => (
                    <MateriaCard
                      key={index}
                      id={materia.id}
                      codigo={materia.codigo}
                      nombre={materia.nombre}
                      estado={materia.estado as 'Acreditada' | 'Regular' | 'Cursando' | 'Libre'}
                      fecha={materia.fecha}
                      nota={materia.nota}
                      year={materia.year}
                      cuatrimestre={materia.cuatrimestre}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="libres" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materiasData.filter(m => m.estado === 'Libre').map((materia, index) => (
                    <MateriaCard
                      key={index}
                      id={materia.id}
                      codigo={materia.codigo}
                      nombre={materia.nombre}
                      estado={materia.estado as 'Acreditada' | 'Regular' | 'Cursando' | 'Libre'}
                      fecha={materia.fecha}
                      nota={materia.nota}
                      year={materia.year}
                      cuatrimestre={materia.cuatrimestre}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default LegajoEstudiantil;
