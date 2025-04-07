
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CarreraCard from '@/components/academico/CarreraCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Trash, ExternalLink } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Carrera {
  id: string;
  nombre: string;
  duracion: number;
  descripcion: string;
  planEstudioUrl?: string;
  cantidadMaterias?: number;
}

const Carreras: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [filteredCarreras, setFilteredCarreras] = useState<Carrera[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    duracion: 3,
    descripcion: '',
    planEstudioUrl: ''
  });

  const fetchCarreras = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('carreras')
        .select('*');
      
      if (error) throw error;
      
      // Obtener cantidad de materias para cada carrera
      const carrerasWithCount = await Promise.all(
        (data || []).map(async (carrera) => {
          const { count, error: countError } = await supabase
            .from('materias')
            .select('*', { count: 'exact', head: true })
            .eq('carrera_id', carrera.id);
          
          return {
            ...carrera,
            cantidadMaterias: count || 0
          };
        })
      );
      
      setCarreras(carrerasWithCount);
      setFilteredCarreras(carrerasWithCount);
    } catch (error) {
      console.error('Error al cargar carreras:', error);
      toast.error('Error al cargar carreras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarreras();
  }, []);

  useEffect(() => {
    const filtered = carreras.filter(carrera => 
      carrera.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCarreras(filtered);
  }, [searchQuery, carreras]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'duracion' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('carreras')
        .insert([formData])
        .select();
      
      if (error) throw error;
      
      toast.success('Carrera creada exitosamente');
      setFormData({
        nombre: '',
        duracion: 3,
        descripcion: '',
        planEstudioUrl: ''
      });
      fetchCarreras();
    } catch (error) {
      console.error('Error al crear carrera:', error);
      toast.error('Error al crear carrera');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Verificar si hay materias asociadas
      const { count: materiasCount, error: materiasError } = await supabase
        .from('materias')
        .select('*', { count: 'exact', head: true })
        .eq('carrera_id', id);
      
      if (materiasError) throw materiasError;
      
      if (materiasCount && materiasCount > 0) {
        toast.error('No se puede eliminar la carrera porque tiene materias asociadas');
        return;
      }
      
      // Verificar si hay estudiantes asociados
      const { count: estudiantesCount, error: estudiantesError } = await supabase
        .from('estudiantes')
        .select('*', { count: 'exact', head: true })
        .eq('carrera_id', id);
      
      if (estudiantesError) throw estudiantesError;
      
      if (estudiantesCount && estudiantesCount > 0) {
        toast.error('No se puede eliminar la carrera porque tiene estudiantes asociados');
        return;
      }
      
      const { error } = await supabase
        .from('carreras')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Carrera eliminada exitosamente');
      fetchCarreras();
    } catch (error) {
      console.error('Error al eliminar carrera:', error);
      toast.error('Error al eliminar carrera');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Carreras</h1>
            <p className="text-muted-foreground">Gestión de carreras y planes de estudio</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-appBlue hover:bg-appBlue-hover">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Carrera
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Crear nueva carrera</DialogTitle>
                <DialogDescription>
                  Complete el formulario para crear una nueva carrera
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la carrera</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duracion">Duración (años)</Label>
                  <Input
                    id="duracion"
                    name="duracion"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.duracion}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Input
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="planEstudioUrl">URL del Plan de Estudios</Label>
                  <Input
                    id="planEstudioUrl"
                    name="planEstudioUrl"
                    placeholder="https://ejemplo.com/plan-estudios.pdf"
                    value={formData.planEstudioUrl}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ingrese la URL donde se encuentra el PDF del plan de estudios
                  </p>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit">Guardar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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

        {loading ? (
          <div className="text-center py-10">
            <p>Cargando carreras...</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCarreras.map((carrera) => (
              <div key={carrera.id} className="relative">
                <CarreraCard
                  id={carrera.id}
                  nombre={carrera.nombre}
                  duracion={carrera.duracion}
                  descripcion={carrera.descripcion}
                  cantidadMaterias={carrera.cantidadMaterias || 0}
                  planEstudioUrl={carrera.planEstudioUrl}
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  {carrera.planEstudioUrl && (
                    <a 
                      href={carrera.planEstudioUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-100 p-1.5 rounded-full hover:bg-blue-200 transition-colors"
                      title="Ver plan de estudios"
                    >
                      <ExternalLink className="h-4 w-4 text-blue-700" />
                    </a>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="bg-red-100 p-1.5 rounded-full hover:bg-red-200 transition-colors">
                        <Trash className="h-4 w-4 text-red-700" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar esta carrera?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Si existen materias o estudiantes asociados a esta carrera, no podrá ser eliminada.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(carrera.id)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
            {filteredCarreras.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No se encontraron carreras con ese nombre</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Carreras;
