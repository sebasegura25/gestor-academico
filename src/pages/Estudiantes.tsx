
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger, DialogClose 
} from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  fecha_ingreso: string;
  carrera_id: string | null;
  carrera_nombre?: string;
}

interface Carrera {
  id: string;
  nombre: string;
}

const Estudiantes: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    fecha_ingreso: new Date().toISOString().split('T')[0],
    carrera_id: ''
  });
  
  const fetchEstudiantes = async () => {
    setLoading(true);
    try {
      const { data: estudiantesData, error: estudiantesError } = await supabase
        .from('estudiantes')
        .select('*, carreras(id, nombre)');
      
      if (estudiantesError) throw estudiantesError;
      
      // Transformar los datos para incluir el nombre de la carrera
      const formattedEstudiantes = estudiantesData.map(est => ({
        ...est,
        carrera_nombre: est.carreras?.nombre
      }));
      
      setEstudiantes(formattedEstudiantes);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      toast.error('Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const fetchCarreras = async () => {
    try {
      const { data, error } = await supabase
        .from('carreras')
        .select('id, nombre');
      
      if (error) throw error;
      setCarreras(data || []);
    } catch (error) {
      console.error('Error al cargar carreras:', error);
    }
  };

  useEffect(() => {
    fetchCarreras();
    fetchEstudiantes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('estudiantes')
        .insert([formData])
        .select();
      
      if (error) throw error;
      
      toast.success('Estudiante agregado correctamente');
      setFormData({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        fecha_ingreso: new Date().toISOString().split('T')[0],
        carrera_id: ''
      });
      
      fetchEstudiantes();
    } catch (error) {
      console.error('Error al crear estudiante:', error);
      toast.error('Error al crear estudiante');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro de eliminar este estudiante? Esta acción no se puede deshacer.')) {
      try {
        const { error } = await supabase
          .from('estudiantes')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast.success('Estudiante eliminado correctamente');
        fetchEstudiantes();
      } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        toast.error('Error al eliminar estudiante');
      }
    }
  };

  const filteredEstudiantes = estudiantes.filter(estudiante => 
    estudiante.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    estudiante.apellido.toLowerCase().includes(searchQuery.toLowerCase()) ||
    estudiante.dni.includes(searchQuery)
  );

  return (
    <MainLayout userRole="admin" userName="Admin Demo">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Estudiantes</h1>
            <p className="text-muted-foreground">Administración de estudiantes</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Estudiante
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Agregar Estudiante</DialogTitle>
                <DialogDescription>
                  Complete el formulario para agregar un nuevo estudiante
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input 
                      id="nombre" 
                      name="nombre" 
                      value={formData.nombre} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input 
                      id="apellido" 
                      name="apellido" 
                      value={formData.apellido} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dni">DNI</Label>
                    <Input 
                      id="dni" 
                      name="dni" 
                      value={formData.dni} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha_ingreso">Fecha de Ingreso</Label>
                    <Input 
                      id="fecha_ingreso" 
                      name="fecha_ingreso" 
                      type="date" 
                      value={formData.fecha_ingreso} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carrera_id">Carrera</Label>
                    <select
                      id="carrera_id"
                      name="carrera_id"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.carrera_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione una carrera</option>
                      {carreras.map(carrera => (
                        <option key={carrera.id} value={carrera.id}>
                          {carrera.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
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
            placeholder="Buscar por nombre, apellido o DNI..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead>Fecha Ingreso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Cargando estudiantes...
                    </TableCell>
                  </TableRow>
                ) : filteredEstudiantes.length > 0 ? (
                  filteredEstudiantes.map((estudiante) => (
                    <TableRow key={estudiante.id}>
                      <TableCell className="font-medium">
                        {estudiante.apellido}, {estudiante.nombre}
                      </TableCell>
                      <TableCell>{estudiante.dni}</TableCell>
                      <TableCell>{estudiante.email}</TableCell>
                      <TableCell>{estudiante.carrera_nombre || '-'}</TableCell>
                      <TableCell>
                        {new Date(estudiante.fecha_ingreso).toLocaleDateString('es-AR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            asChild
                          >
                            <Link to={`/estudiantes/${estudiante.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDelete(estudiante.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No se encontraron estudiantes
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Estudiantes;
