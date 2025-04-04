import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger, DialogClose 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Materia {
  id: string;
  codigo: string;
  nombre: string;
  year: number;
  cuatrimestre: number;
  carrera_id: string;
  carrera_nombre?: string;
}

interface Correlatividad {
  id: string;
  materia_id: string;
  materia_requerida_id: string;
  materia: {
    codigo: string;
    nombre: string;
  };
  materia_requerida: {
    codigo: string;
    nombre: string;
  };
}

interface Carrera {
  id: string;
  nombre: string;
}

const Correlatividades: React.FC = () => {
  const [correlatividades, setCorrelatividades] = useState<Correlatividad[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredMaterias, setFilteredMaterias] = useState<Materia[]>([]);
  const [formData, setFormData] = useState({
    carrera_id: '',
    materia_id: '',
    materia_requerida_id: ''
  });
  const [selectedCarrera, setSelectedCarrera] = useState<string | null>(null);

  const fetchCorrelatividades = async () => {
    setLoading(true);
    try {
      const { data: correlativasData, error: correlativasError } = await supabase
        .from('correlatividades')
        .select(`
          id,
          materia_id,
          materia_requerida_id,
          materia:materias!materia_id(codigo, nombre),
          materia_requerida:materias!materia_requerida_id(codigo, nombre)
        `);
      
      if (correlativasError) throw correlativasError;
      
      const formattedData = correlativasData.map(c => ({
        id: c.id,
        materia_id: c.materia_id,
        materia_requerida_id: c.materia_requerida_id,
        materia: {
          codigo: c.materia?.codigo || '',
          nombre: c.materia?.nombre || ''
        },
        materia_requerida: {
          codigo: c.materia_requerida?.codigo || '',
          nombre: c.materia_requerida?.nombre || ''
        }
      }));
      
      setCorrelatividades(formattedData);
    } catch (error) {
      console.error('Error al cargar correlatividades:', error);
      toast.error('Error al cargar correlatividades');
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterias = async () => {
    try {
      const { data: materiasData, error: materiasError } = await supabase
        .from('materias')
        .select('*, carreras(id, nombre)');
      
      if (materiasError) throw materiasError;
      
      const formattedMaterias = materiasData.map(mat => ({
        ...mat,
        carrera_nombre: mat.carreras?.nombre
      }));
      
      setMaterias(formattedMaterias);
    } catch (error) {
      console.error('Error al cargar materias:', error);
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
    fetchCorrelatividades();
    fetchMaterias();
    fetchCarreras();
  }, []);

  const filtrarPorCarrera = (carreraId: string) => {
    setSelectedCarrera(carreraId);
    if (!carreraId) {
      setFilteredMaterias([]);
      return;
    }
    
    const materiasDeCarrera = materias.filter(m => m.carrera_id === carreraId);
    setFilteredMaterias(materiasDeCarrera);
    
    setFormData(prev => ({
      ...prev,
      carrera_id: carreraId,
      materia_id: '',
      materia_requerida_id: ''
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.materia_id === formData.materia_requerida_id) {
      toast.error('Una materia no puede ser correlativa de sí misma');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('correlatividades')
        .insert([{
          materia_id: formData.materia_id,
          materia_requerida_id: formData.materia_requerida_id
        }]);
      
      if (error) throw error;
      
      toast.success('Correlatividad agregada correctamente');
      await fetchCorrelatividades();
      
      setFormData(prev => ({
        ...prev,
        materia_id: '',
        materia_requerida_id: ''
      }));
    } catch (error) {
      console.error('Error al crear correlatividad:', error);
      toast.error('Error al crear correlatividad');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro de eliminar esta correlatividad?')) {
      try {
        const { error } = await supabase
          .from('correlatividades')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast.success('Correlatividad eliminada correctamente');
        await fetchCorrelatividades();
      } catch (error) {
        console.error('Error al eliminar correlatividad:', error);
        toast.error('Error al eliminar correlatividad');
      }
    }
  };

  const getCorrelativasFiltradas = () => {
    if (!selectedCarrera) return [];
    
    return correlatividades.filter(corr => 
      (corr.materia as any).carrera_id === selectedCarrera
    );
  };

  return (
    <MainLayout userRole="admin" userName="Admin Demo">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Correlatividades</h1>
            <p className="text-muted-foreground">Gestión de materias correlativas</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Correlatividad
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Agregar Correlatividad</DialogTitle>
                <DialogDescription>
                  Seleccione las materias para establecer la correlatividad
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="carrera_id">Carrera</Label>
                  <select
                    id="carrera_id"
                    name="carrera_id"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.carrera_id}
                    onChange={(e) => filtrarPorCarrera(e.target.value)}
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
                
                {formData.carrera_id && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="materia_id">Para cursar</Label>
                      <select
                        id="materia_id"
                        name="materia_id"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.materia_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccione una materia</option>
                        {filteredMaterias.map(materia => (
                          <option key={materia.id} value={materia.id}>
                            {materia.codigo} - {materia.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-center my-2">
                      <div className="border-t border-gray-200 w-1/3"></div>
                      <div className="px-3 text-gray-500 text-sm">Deberá tener aprobada</div>
                      <div className="border-t border-gray-200 w-1/3"></div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="materia_requerida_id">Materia requerida</Label>
                      <select
                        id="materia_requerida_id"
                        name="materia_requerida_id"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.materia_requerida_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccione una materia</option>
                        {filteredMaterias.map(materia => (
                          <option 
                            key={materia.id} 
                            value={materia.id}
                            disabled={materia.id === formData.materia_id}
                          >
                            {materia.codigo} - {materia.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button 
                    type="submit"
                    disabled={!formData.materia_id || !formData.materia_requerida_id}
                  >
                    Guardar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex gap-4 items-center">
              <Label htmlFor="filtro-carrera">Filtrar por carrera:</Label>
              <select
                id="filtro-carrera"
                className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedCarrera || ''}
                onChange={(e) => filtrarPorCarrera(e.target.value)}
              >
                <option value="">Seleccione una carrera</option>
                {carreras.map(carrera => (
                  <option key={carrera.id} value={carrera.id}>
                    {carrera.nombre}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Para cursar</TableHead>
                  <TableHead></TableHead>
                  <TableHead>Requiere tener aprobada</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      Cargando correlatividades...
                    </TableCell>
                  </TableRow>
                ) : selectedCarrera ? (
                  getCorrelativasFiltradas().length > 0 ? (
                    getCorrelativasFiltradas().map((corr) => (
                      <TableRow key={corr.id}>
                        <TableCell>
                          <div className="font-medium">{corr.materia.codigo} - {corr.materia.nombre}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{corr.materia_requerida.codigo} - {corr.materia_requerida.nombre}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDelete(corr.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        No hay correlatividades definidas para esta carrera
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      Seleccione una carrera para ver sus correlatividades
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

export default Correlatividades;
