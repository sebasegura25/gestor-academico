import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Materia {
  id: string;
  codigo: string;
  nombre: string;
  semestre: number;
  cuatrimestre: number;
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
  materia: {
    codigo: string;
    nombre: string;
  };
  materia_requerida: {
    id: string;
    codigo: string;
    nombre: string;
  };
}

const Correlatividades: React.FC = () => {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [correlatividades, setCorrelatividades] = useState<Correlatividad[]>([]);
  const [selectedCarrera, setSelectedCarrera] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  // Cargar carreras al iniciar
  useEffect(() => {
    fetchCarreras();
  }, []);
  
  // Cargar materias cuando se selecciona una carrera
  useEffect(() => {
    if (selectedCarrera) {
      fetchMaterias(selectedCarrera);
    }
  }, [selectedCarrera]);
  
  const fetchCarreras = async () => {
    try {
      const { data, error } = await supabase
        .from('carreras')
        .select('id, nombre')
        .order('nombre');
      
      if (error) throw error;
      
      setCarreras(data || []);
      
      // Si hay carreras, seleccionar la primera por defecto
      if (data && data.length > 0) {
        setSelectedCarrera(data[0].id);
      }
    } catch (error) {
      console.error('Error al cargar carreras:', error);
      toast.error('Error al cargar carreras');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMaterias = async (carreraId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('materias')
        .select('id, codigo, nombre, semestre, cuatrimestre, carrera_id')
        .eq('carrera_id', carreraId)
        .order('semestre')
        .order('cuatrimestre')
        .order('nombre');
      
      if (error) throw error;
      
      setMaterias(data || []);
      fetchCorrelatividades(data?.map(m => m.id) || []);
    } catch (error) {
      console.error('Error al cargar materias:', error);
      toast.error('Error al cargar materias');
      setLoading(false);
    }
  };
  
  const fetchCorrelatividades = async (materiaIds: string[]) => {
    if (materiaIds.length === 0) {
      setCorrelatividades([]);
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('correlatividades')
        .select(`
          id, 
          materia_id, 
          materia_requerida_id,
          materia:materias!correlatividades_materia_id_fkey(codigo, nombre),
          materia_requerida:materias!correlatividades_materia_requerida_id_fkey(id, codigo, nombre)
        `)
        .in('materia_id', materiaIds);
      
      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        id: item.id,
        materia_id: item.materia_id,
        materia_requerida_id: item.materia_requerida_id,
        materia: {
          codigo: item.materia?.codigo || '',
          nombre: item.materia?.nombre || ''
        },
        materia_requerida: {
          id: item.materia_requerida?.id || '',
          codigo: item.materia_requerida?.codigo || '',
          nombre: item.materia_requerida?.nombre || ''
        }
      })) || [];
      
      setCorrelatividades(formattedData);
    } catch (error) {
      console.error('Error al cargar correlatividades:', error);
      toast.error('Error al cargar correlatividades');
    } finally {
      setLoading(false);
    }
  };
  
  const materiasPorSemestreCuatrimestre = materias.reduce((acc, materia) => {
    const key = `${materia.semestre}-${materia.cuatrimestre}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(materia);
    return acc;
  }, {} as Record<string, Materia[]>);
  
  const getCorrelatividades = (materiaId: string) => {
    return correlatividades.filter(c => c.materia_id === materiaId);
  };
  
  const handleCarreraChange = (carreraId: string) => {
    setSelectedCarrera(carreraId);
  };
  
  const semestresCuatrimestres = Object.keys(materiasPorSemestreCuatrimestre).sort();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Correlatividades</h1>
          <p className="text-muted-foreground">Plan de correlatividades por carrera</p>
        </div>
        
        <div className="max-w-xs">
          <Label htmlFor="carrera">Seleccione una carrera</Label>
          <Select value={selectedCarrera} onValueChange={handleCarreraChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una carrera" />
            </SelectTrigger>
            <SelectContent>
              {carreras.map(carrera => (
                <SelectItem key={carrera.id} value={carrera.id}>
                  {carrera.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <p>Cargando plan de correlatividades...</p>
          </div>
        ) : materias.length === 0 ? (
          <div className="text-center py-10">
            <p>Esta carrera no tiene materias registradas</p>
          </div>
        ) : (
          <div className="space-y-8">
            {semestresCuatrimestres.map(key => {
              const [semestre, cuatrimestre] = key.split('-');
              return (
                <div key={key}>
                  <h2 className="text-lg font-semibold mb-4">
                    {semestre}° semestre - {cuatrimestre}° cuatrimestre
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {materiasPorSemestreCuatrimestre[key].map(materia => {
                      const correlativas = getCorrelatividades(materia.id);
                      return (
                        <Card key={materia.id} className="h-full">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-md">
                              {materia.codigo} - {materia.nombre}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {correlativas.length > 0 ? (
                              <div>
                                <p className="font-medium text-sm mb-2">Requiere haber aprobado:</p>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                  {correlativas.map(correlativa => (
                                    <li key={correlativa.id}>
                                      • {correlativa.materia_requerida.codigo}{" "}
                                      {correlativa.materia_requerida.nombre}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No tiene correlatividades
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Correlatividades;
