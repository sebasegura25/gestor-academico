
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Materia {
  id: string;
  codigo: string;
  nombre: string;
  year: number;
  cuatrimestre: number;
  horas: number;
  carrera_id: string;
  carrera_nombre?: string;
}

interface Carrera {
  id: string;
  nombre: string;
}

const Materias: React.FC = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    year: 1,
    cuatrimestre: 1,
    horas: 4,
    carrera_id: ''
  });

  const fetchMaterias = async () => {
    setLoading(true);
    try {
      const { data: materiasData, error: materiasError } = await supabase
        .from('materias')
        .select('*, carreras(id, nombre)');
      
      if (materiasError) throw materiasError;
      
      // Transformar los datos para incluir el nombre de la carrera
      const formattedMaterias = materiasData.map(mat => ({
        ...mat,
        carrera_nombre: mat.carreras?.nombre
      }));
      
      setMaterias(formattedMaterias);
    } catch (error) {
      console.error('Error al cargar materias:', error);
      toast.error('Error al cargar materias');
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
    fetchMaterias();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'year' || name === 'cuatrimestre' || name === 'horas' 
        ? parseInt(value, 10) 
        : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('materias')
        .insert([formData])
        .select();
      
      if (error) throw error;
      
      toast.success('Materia agregada correctamente');
      setFormData({
        codigo: '',
        nombre: '',
        year: 1,
        cuatrimestre: 1,
        horas: 4,
        carrera_id: ''
      });
      
      fetchMaterias();
    } catch (error) {
      console.error('Error al crear materia:', error);
      toast.error('Error al crear materia');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro de eliminar esta materia? Esta acción no se puede deshacer.')) {
      try {
        const { error } = await supabase
          .from('materias')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast.success('Materia eliminada correctamente');
        fetchMaterias();
      } catch (error) {
        console.error('Error al eliminar materia:', error);
        toast.error('Error al eliminar materia');
      }
    }
  };

  const filteredMaterias = materias.filter(materia => 
    materia.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    materia.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout userRole="admin" userName="Admin Demo">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Materias</h1>
            <p className="text-muted-foreground">Administración de materias y asignaturas</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Materia
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Agregar Materia</DialogTitle>
                <DialogDescription>
                  Complete el formulario para agregar una nueva materia
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código</Label>
                    <Input 
                      id="codigo" 
                      name="codigo" 
                      value={formData.codigo} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
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
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Año</Label>
                    <Input 
                      id="year" 
                      name="year" 
                      type="number"
                      min="1"
                      max="6"
                      value={formData.year} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cuatrimestre">Cuatrimestre</Label>
                    <Input 
                      id="cuatrimestre" 
                      name="cuatrimestre" 
                      type="number"
                      min="1"
                      max="2"
                      value={formData.cuatrimestre} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horas">Horas Semanales</Label>
                    <Input 
                      id="horas" 
                      name="horas" 
                      type="number"
                      min="1"
                      value={formData.horas} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carrera_id">Carrera</Label>
                  <select
                    id="carrera_id"
                    name="carrera_id"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.carrera_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione una carrera</option>
                    {carreras.map(carrera => (
                      <option key={carrera.id} value={carrera.id}>
                        {carrera.nombre}
                      </option>
                    ))}
                  </select>
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
            placeholder="Buscar por código o nombre..."
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
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Cuatrimestre</TableHead>
                  <TableHead>Horas</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Cargando materias...
                    </TableCell>
                  </TableRow>
                ) : filteredMaterias.length > 0 ? (
                  filteredMaterias.map((materia) => (
                    <TableRow key={materia.id}>
                      <TableCell>{materia.codigo}</TableCell>
                      <TableCell className="font-medium">{materia.nombre}</TableCell>
                      <TableCell>{materia.year}°</TableCell>
                      <TableCell>{materia.cuatrimestre}°</TableCell>
                      <TableCell>{materia.horas} hs</TableCell>
                      <TableCell>{materia.carrera_nombre || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            asChild
                          >
                            <Link to={`/materias/${materia.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDelete(materia.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No se encontraron materias
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

export default Materias;
