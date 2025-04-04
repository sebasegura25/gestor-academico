import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, GraduationCap, Plus, Edit, Trash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from '@/components/ui/dialog';
import MateriaCard from '@/components/academico/MateriaCard';

interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  fecha_ingreso: string;
  carrera_id: string | null;
}

interface Carrera {
  id: string;
  nombre: string;
}

interface Materia {
  id: string;
  codigo: string;
  nombre: string;
  year: number;
  cuatrimestre: number;
}

interface EstadoAcademico {
  id: string;
  estudiante_id: string;
  materia_id: string;
  estado: 'Cursando' | 'Regular' | 'Acreditada' | 'Libre';
  fecha_regularizacion: string | null;
  fecha_acreditacion: string | null;
  nota: number | null;
  materia: {
    id: string;
    codigo: string;
    nombre: string;
  };
}

const EstudianteDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [estadosAcademicos, setEstadosAcademicos] = useState<EstadoAcademico[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [selectedMateria, setSelectedMateria] = useState<string>('');
  const [estadoData, setEstadoData] = useState({
    materia_id: '',
    estado: 'Cursando',
    fecha_regularizacion: '',
    fecha_acreditacion: '',
    nota: ''
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEstudiante = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('estudiantes')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setEstudiante(data);
        
        await fetchEstadosAcademicos();
      } catch (error) {
        console.error('Error al cargar estudiante:', error);
        toast.error('Error al cargar los datos del estudiante');
        navigate('/estudiantes');
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
    
    const fetchMaterias = async () => {
      try {
        const { data, error } = await supabase
          .from('materias')
          .select('*');
          
        if (error) throw error;
        setMaterias(data || []);
      } catch (error) {
        console.error('Error al cargar materias:', error);
      }
    };
    
    fetchEstudiante();
    fetchCarreras();
    fetchMaterias();
  }, [id, navigate]);
  
  const fetchEstadosAcademicos = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('estados_academicos')
        .select('*, materia:materias!materia_id(id, codigo, nombre)')
        .eq('estudiante_id', id);
        
      if (error) throw error;
      
      const formattedData = data?.map(estado => ({
        id: estado.id,
        estudiante_id: estado.estudiante_id,
        materia_id: estado.materia_id,
        estado: estado.estado as 'Cursando' | 'Regular' | 'Acreditada' | 'Libre',
        fecha_regularizacion: estado.fecha_regularizacion,
        fecha_acreditacion: estado.fecha_acreditacion,
        nota: estado.nota,
        materia: {
          id: estado.materia?.id || '',
          codigo: estado.materia?.codigo || '',
          nombre: estado.materia?.nombre || ''
        }
      })) || [];
      
      setEstadosAcademicos(formattedData);
    } catch (error) {
      console.error('Error al cargar estados académicos:', error);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (estudiante) {
      setEstudiante({
        ...estudiante,
        [name]: value
      });
    }
  };
  
  const handleEstadoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEstadoData({
      ...estadoData,
      [name]: value
    });
  };
  
  const handleGuardar = async () => {
    if (!estudiante) return;
    
    try {
      const { error } = await supabase
        .from('estudiantes')
        .update(estudiante)
        .eq('id', estudiante.id);
        
      if (error) throw error;
      
      toast.success('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al guardar estudiante:', error);
      toast.error('Error al guardar los cambios');
    }
  };
  
  const handleAgregarEstado = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !estadoData.materia_id) return;
    
    try {
      const nuevoEstado = {
        estudiante_id: id,
        materia_id: estadoData.materia_id,
        estado: estadoData.estado,
        fecha_regularizacion: estadoData.fecha_regularizacion || null,
        fecha_acreditacion: estadoData.fecha_acreditacion || null,
        nota: estadoData.nota ? parseFloat(estadoData.nota) : null
      };
      
      const { error } = await supabase
        .from('estados_academicos')
        .insert([nuevoEstado]);
        
      if (error) throw error;
      
      toast.success('Estado académico agregado correctamente');
      await fetchEstadosAcademicos();
      
      setEstadoData({
        materia_id: '',
        estado: 'Cursando',
        fecha_regularizacion: '',
        fecha_acreditacion: '',
        nota: ''
      });
    } catch (error) {
      console.error('Error al agregar estado académico:', error);
      toast.error('Error al agregar estado académico');
    }
  };
  
  const handleEliminarEstado = async (estadoId: string) => {
    if (confirm('¿Está seguro de eliminar este estado académico?')) {
      try {
        const { error } = await supabase
          .from('estados_academicos')
          .delete()
          .eq('id', estadoId);
          
        if (error) throw error;
        
        toast.success('Estado académico eliminado correctamente');
        await fetchEstadosAcademicos();
      } catch (error) {
        console.error('Error al eliminar estado académico:', error);
        toast.error('Error al eliminar estado académico');
      }
    }
  };
  
  const filteredMaterias = materias.filter(materia => {
    return !estadosAcademicos.some(estado => estado.materia_id === materia.id);
  });
  
  if (loading) {
    return (
      <MainLayout userRole="admin" userName="Admin Demo">
        <div className="space-y-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="mr-4"
              onClick={() => navigate('/estudiantes')}
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
  
  if (!estudiante) {
    return (
      <MainLayout userRole="admin" userName="Admin Demo">
        <div className="space-y-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="mr-4"
              onClick={() => navigate('/estudiantes')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Estudiante no encontrado</h1>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout userRole="admin" userName="Admin Demo">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="mr-4"
              onClick={() => navigate('/estudiantes')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {estudiante.apellido}, {estudiante.nombre}
              </h1>
              <p className="text-muted-foreground">DNI: {estudiante.dni}</p>
            </div>
          </div>
          <Button onClick={handleGuardar}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
        
        <Tabs defaultValue="datos">
          <TabsList>
            <TabsTrigger value="datos">Datos Personales</TabsTrigger>
            <TabsTrigger value="academico">Legajo Académico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="datos" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Datos del Estudiante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={estudiante.nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      name="apellido"
                      value={estudiante.apellido}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dni">DNI</Label>
                    <Input
                      id="dni"
                      name="dni"
                      value={estudiante.dni}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={estudiante.email}
                      onChange={handleInputChange}
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
                      value={estudiante.fecha_ingreso}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carrera_id">Carrera</Label>
                    <select
                      id="carrera_id"
                      name="carrera_id"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={estudiante.carrera_id || ''}
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="academico" className="space-y-4 pt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Estado Académico</h2>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Estado
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Estado Académico</DialogTitle>
                    <DialogDescription>
                      Seleccione una materia y complete la información del estado académico
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleAgregarEstado} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="materia_id">Materia</Label>
                      <select
                        id="materia_id"
                        name="materia_id"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={estadoData.materia_id}
                        onChange={handleEstadoInputChange}
                        required
                      >
                        <option value="">Seleccione una materia</option>
                        {filteredMaterias.map(materia => (
                          <option key={materia.id} value={materia.id}>
                            {materia.codigo} - {materia.nombre}
                          </option>
                        ))}
                      </select>
                      {filteredMaterias.length === 0 && (
                        <p className="text-sm text-yellow-600 mt-1">
                          No hay materias disponibles para agregar
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <select
                        id="estado"
                        name="estado"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={estadoData.estado}
                        onChange={handleEstadoInputChange}
                        required
                      >
                        <option value="Cursando">Cursando</option>
                        <option value="Regular">Regular</option>
                        <option value="Acreditada">Acreditada</option>
                        <option value="Libre">Libre</option>
                      </select>
                    </div>
                    
                    {(estadoData.estado === 'Regular' || estadoData.estado === 'Acreditada') && (
                      <div className="grid grid-cols-2 gap-4">
                        {estadoData.estado === 'Regular' && (
                          <div className="space-y-2">
                            <Label htmlFor="fecha_regularizacion">Fecha de Regularización</Label>
                            <Input
                              id="fecha_regularizacion"
                              name="fecha_regularizacion"
                              type="date"
                              value={estadoData.fecha_regularizacion}
                              onChange={handleEstadoInputChange}
                              required={estadoData.estado === 'Regular'}
                            />
                          </div>
                        )}
                        
                        {estadoData.estado === 'Acreditada' && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="fecha_acreditacion">Fecha de Acreditación</Label>
                              <Input
                                id="fecha_acreditacion"
                                name="fecha_acreditacion"
                                type="date"
                                value={estadoData.fecha_acreditacion}
                                onChange={handleEstadoInputChange}
                                required={estadoData.estado === 'Acreditada'}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="nota">Nota</Label>
                              <Input
                                id="nota"
                                name="nota"
                                type="number"
                                min="4"
                                max="10"
                                step="0.1"
                                value={estadoData.nota}
                                onChange={handleEstadoInputChange}
                                required={estadoData.estado === 'Acreditada'}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button 
                        type="submit" 
                        disabled={!estadoData.materia_id || filteredMaterias.length === 0}
                      >
                        Guardar
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {estadosAcademicos.length > 0 ? (
                estadosAcademicos.map(estado => {
                  let fecha = '';
                  let nota = null;
                  
                  if (estado.estado === 'Regular' && estado.fecha_regularizacion) {
                    fecha = new Date(estado.fecha_regularizacion).toLocaleDateString('es-AR');
                  } else if (estado.estado === 'Acreditada' && estado.fecha_acreditacion) {
                    fecha = new Date(estado.fecha_acreditacion).toLocaleDateString('es-AR');
                    if (estado.nota) nota = estado.nota;
                  }
                  
                  return (
                    <div key={estado.id} className="relative">
                      <MateriaCard
                        id={estado.materia.id}
                        codigo={estado.materia.codigo}
                        nombre={estado.materia.nombre}
                        estado={estado.estado}
                        fecha={fecha}
                        nota={nota}
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEliminarEstado(estado.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
                  <GraduationCap className="h-12 w-12 text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium">Sin registros académicos</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Este estudiante aún no tiene estados académicos registrados
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default EstudianteDetalle;
