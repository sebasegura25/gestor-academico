
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Save, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Materia {
  id: string;
  codigo: string;
  nombre: string;
  semestre: number;
  cuatrimestre: number;
  horas: number;
  carrera_id: string;
}

interface Carrera {
  id: string;
  nombre: string;
}

interface Correlatividad {
  id: string;
  materia_id: string;
  materia_requerida_id: string;
  materia_requerida: {
    id: string;
    codigo: string;
    nombre: string;
  }
}

const MateriaDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [materia, setMateria] = useState<Materia | null>(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [correlatividades, setCorrelatividades] = useState<Correlatividad[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMateria = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('materias')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setMateria(data);
        
        const { data: correlativasData, error: correlativasError } = await supabase
          .from('correlatividades')
          .select(`
            id,
            materia_id,
            materia_requerida_id,
            materia_requerida:materias!materia_requerida_id(id, codigo, nombre)
          `)
          .eq('materia_id', id);
          
        if (correlativasError) throw correlativasError;
        
        const formattedData = correlativasData?.map(corr => ({
          id: corr.id,
          materia_id: corr.materia_id,
          materia_requerida_id: corr.materia_requerida_id,
          materia_requerida: {
            id: corr.materia_requerida?.id || '',
            codigo: corr.materia_requerida?.codigo || '',
            nombre: corr.materia_requerida?.nombre || ''
          }
        })) || [];
        
        setCorrelatividades(formattedData);
      } catch (error) {
        console.error('Error al cargar materia:', error);
        toast.error('Error al cargar los datos de la materia');
        navigate('/materias');
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
    
    fetchMateria();
    fetchCarreras();
  }, [id, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (materia) {
      setMateria({
        ...materia,
        [name]: ['semestre', 'cuatrimestre', 'horas'].includes(name) 
          ? parseInt(value, 10) 
          : value
      });
    }
  };
  
  const handleGuardar = async () => {
    if (!materia) return;
    
    try {
      const { error } = await supabase
        .from('materias')
        .update(materia)
        .eq('id', materia.id);
        
      if (error) throw error;
      
      toast.success('Materia actualizada correctamente');
    } catch (error) {
      console.error('Error al guardar materia:', error);
      toast.error('Error al guardar los cambios');
    }
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
              onClick={() => navigate('/materias')}
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
  
  if (!materia) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="mr-4"
              onClick={() => navigate('/materias')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Materia no encontrada</h1>
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
              onClick={() => navigate('/materias')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{materia.codigo} - {materia.nombre}</h1>
              <p className="text-muted-foreground">Año {materia.semestre}, Cuatrimestre {materia.cuatrimestre}</p>
            </div>
          </div>
          <Button onClick={handleGuardar}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Materia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código</Label>
                    <Input
                      id="codigo"
                      name="codigo"
                      value={materia.codigo}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={materia.nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="semestre">Año</Label>
                    <Input
                      id="semestre"
                      name="semestre"
                      type="number"
                      min="1"
                      max="6"
                      value={materia.semestre}
                      onChange={handleInputChange}
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
                      value={materia.cuatrimestre}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horas">Horas Semanales</Label>
                    <Input
                      id="horas"
                      name="horas"
                      type="number"
                      min="1"
                      value={materia.horas}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carrera_id">Carrera</Label>
                  <select
                    id="carrera_id"
                    name="carrera_id"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={materia.carrera_id}
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
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Correlatividades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm font-medium mb-2">
                    Para cursar <span className="text-primary">{materia.nombre}</span> se requiere tener aprobadas:
                  </div>
                  
                  {correlatividades.length > 0 ? (
                    <ul className="space-y-2">
                      {correlatividades.map(corr => (
                        <li key={corr.id} className="flex items-center">
                          <ArrowRight className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <span className="text-sm">{corr.materia_requerida.codigo} - {corr.materia_requerida.nombre}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Esta materia no tiene correlatividades definidas
                    </p>
                  )}
                  
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/correlatividades')}
                    >
                      Gestionar Correlatividades
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MateriaDetalle;
