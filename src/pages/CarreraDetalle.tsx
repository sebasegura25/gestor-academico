
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Carrera {
  id: string;
  nombre: string;
  duracion: number;
  descripcion: string;
}

interface Materia {
  id: string;
  codigo: string;
  nombre: string;
  year: number;
  cuatrimestre: number;
  horas: number;
}

const CarreraDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [carrera, setCarrera] = useState<Carrera | null>(null);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCarrera = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('carreras')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setCarrera(data);
        
        // Cargar materias de la carrera
        const { data: materiasData, error: materiasError } = await supabase
          .from('materias')
          .select('*')
          .eq('carrera_id', id)
          .order('year', { ascending: true })
          .order('cuatrimestre', { ascending: true });
          
        if (materiasError) throw materiasError;
        setMaterias(materiasData || []);
      } catch (error) {
        console.error('Error al cargar carrera:', error);
        toast.error('Error al cargar los datos de la carrera');
        navigate('/carreras');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCarrera();
  }, [id, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (carrera) {
      setCarrera({
        ...carrera,
        [name]: name === 'duracion' ? parseInt(value, 10) : value
      });
    }
  };
  
  const handleGuardar = async () => {
    if (!carrera) return;
    
    try {
      const { error } = await supabase
        .from('carreras')
        .update(carrera)
        .eq('id', carrera.id);
        
      if (error) throw error;
      
      toast.success('Carrera actualizada correctamente');
    } catch (error) {
      console.error('Error al guardar carrera:', error);
      toast.error('Error al guardar los cambios');
    }
  };
  
  const getMateriasByYear = (year: number) => {
    return materias.filter(m => m.year === year);
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="mr-4"
              onClick={() => navigate('/carreras')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Cargando...</h1>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!carrera) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="mr-4"
              onClick={() => navigate('/carreras')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Carrera no encontrada</h1>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="mr-4"
              onClick={() => navigate('/carreras')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{carrera.nombre}</h1>
              <p className="text-muted-foreground">Duración: {carrera.duracion} años</p>
            </div>
          </div>
          <Button onClick={handleGuardar}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
        
        <Tabs defaultValue="datos">
          <TabsList>
            <TabsTrigger value="datos">Datos de la Carrera</TabsTrigger>
            <TabsTrigger value="plan">Plan de Estudios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="datos" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Carrera</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la Carrera</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={carrera.nombre}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duracion">Duración (años)</Label>
                  <Input
                    id="duracion"
                    name="duracion"
                    type="number"
                    min="1"
                    max="6"
                    value={carrera.duracion}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    rows={4}
                    value={carrera.descripcion || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="plan" className="space-y-6 pt-4">
            {materias.length > 0 ? (
              Array.from({ length: carrera.duracion }).map((_, index) => {
                const year = index + 1;
                const materiasYear = getMateriasByYear(year);
                
                if (materiasYear.length === 0) return null;
                
                return (
                  <Card key={year} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <CardTitle className="text-lg">Año {year}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Materia</TableHead>
                            <TableHead>Cuatrimestre</TableHead>
                            <TableHead>Horas Semanales</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {materiasYear.map(materia => (
                            <TableRow key={materia.id}>
                              <TableCell>{materia.codigo}</TableCell>
                              <TableCell className="font-medium">{materia.nombre}</TableCell>
                              <TableCell>{materia.cuatrimestre}°</TableCell>
                              <TableCell>{materia.horas} hs</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <BookOpen className="h-12 w-12 text-gray-300 mb-2" />
                <h3 className="text-lg font-medium">No hay materias registradas</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Esta carrera aún no tiene materias en su plan de estudios
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => navigate('/materias')}
                >
                  Ir a Gestión de Materias
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CarreraDetalle;
