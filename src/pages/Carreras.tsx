
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CarreraCard from '@/components/academico/CarreraCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

// Datos de ejemplo para carreras
const carrerasData = [
  {
    id: '1',
    nombre: 'Técnico Superior en Análisis de Sistemas',
    duracion: 3,
    descripcion: 'Carrera orientada al desarrollo de software y la implementación de sistemas informáticos en diferentes entornos empresariales.',
    cantidadMaterias: 24,
  },
  {
    id: '2',
    nombre: 'Técnico Superior en Administración',
    duracion: 3,
    descripcion: 'Formación en gestión administrativa, recursos humanos, y procesos organizacionales para diferentes tipos de empresas.',
    cantidadMaterias: 20,
  },
  {
    id: '3',
    nombre: 'Profesorado en Educación Primaria',
    duracion: 4,
    descripcion: 'Formación docente para la enseñanza en el nivel primario, con énfasis en didáctica y pedagogía moderna.',
    cantidadMaterias: 30,
  },
  {
    id: '4',
    nombre: 'Técnico Superior en Desarrollo de Software',
    duracion: 3,
    descripcion: 'Especialización en programación, arquitectura de software y desarrollo de aplicaciones web y móviles.',
    cantidadMaterias: 22,
  },
  {
    id: '5',
    nombre: 'Técnico Superior en Diseño Gráfico',
    duracion: 3,
    descripcion: 'Formación en diseño visual, identidad corporativa, y producción de contenidos para medios digitales e impresos.',
    cantidadMaterias: 18,
  },
  {
    id: '6',
    nombre: 'Técnico Superior en Enfermería',
    duracion: 3,
    descripcion: 'Capacitación profesional para el cuidado de la salud, con prácticas en instituciones sanitarias y formación en emergentología.',
    cantidadMaterias: 26,
  },
];

const Carreras: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredCarreras, setFilteredCarreras] = React.useState(carrerasData);

  React.useEffect(() => {
    const filtered = carrerasData.filter(carrera => 
      carrera.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCarreras(filtered);
  }, [searchQuery]);

  return (
    <MainLayout userRole="admin" userName="Admin Demo">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Carreras</h1>
            <p className="text-muted-foreground">Gestión de carreras y planes de estudio</p>
          </div>
          <Button className="bg-appBlue hover:bg-appBlue-hover">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Carrera
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar carreras..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCarreras.map((carrera) => (
            <CarreraCard
              key={carrera.id}
              id={carrera.id}
              nombre={carrera.nombre}
              duracion={carrera.duracion}
              descripcion={carrera.descripcion}
              cantidadMaterias={carrera.cantidadMaterias}
            />
          ))}
          {filteredCarreras.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No se encontraron carreras con ese nombre</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Carreras;
