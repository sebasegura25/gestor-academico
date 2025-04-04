
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger, DialogClose 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar, Plus, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
}

interface Materia {
  id: string;
  codigo: string;
  nombre: string;
  year: number;
  cuatrimestre: number;
  carrera_id: string;
}

interface EstadoAcademico {
  materia_id: string;
  estado: string;
}

interface Inscripcion {
  id: string;
  estudiante_id: string;
  materia_id: string;
  tipo: 'Cursada' | 'Examen';
  periodo: string;
  fecha: string;
  materia: {
    codigo: string;
    nombre: string;
  };
}

interface Correlatividad {
  materia_id: string;
  materia_requerida_id: string;
}

const Inscripciones: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [estadosAcademicos, setEstadosAcademicos] = useState<EstadoAcademico[]>([]);
  const [correlatividades, setCorrelatividades] = useState<Correlatividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    estudiante_id: '',
    materia_id: '',
    tipo: 'Cursada',
    periodo: '1er Cuatrimestre 2025',
    fecha: new Date().toISOString().split('T')[0]
  });
  const [currentEstudiante, setCurrentEstudiante] = useState<string>('');
  const [errorCorrelativas, setErrorCorrelativas] = useState<string[]>([]);
  
  useEffect(() => {
    fetchEstudiantes();
    fetchMaterias();
    fetchCorrelatividades();
  }, []);
  
  useEffect(() => {
    if (currentEstudiante) {
      fetchInscripciones(currentEstudiante);
      fetchEstadosAcademicos(currentEstudiante);
    }
  }, [currentEstudiante]);
  
  const fetchEstudiantes = async () => {
    try {
      const { data, error } = await supabase
        .from('estudiantes')
        .select('id, nombre, apellido, dni');
      
      if (error) throw error;
      setEstudiantes(data || []);
      
      // Si hay estudiantes, seleccionar el primero por defecto
      if (data && data.length > 0) {
        setCurrentEstudiante(data[0].id);
        setFormData(prev => ({ ...prev, estudiante_id: data[0].id }));
      }
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      toast.error('Error al cargar estudiantes');
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
      toast.error('Error al cargar materias');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchInscripciones = async (estudianteId: string) => {
    try {
      const { data, error } = await supabase
        .from('inscripciones')
        .select('*, materia:materia_id(codigo, nombre)')
        .eq('estudiante_id', estudianteId);
      
      if (error) throw error;
      setInscripciones(data || []);
    } catch (error) {
      console.error('Error al cargar inscripciones:', error);
    }
  };
  
  const fetchEstadosAcademicos = async (estudianteId: string) => {
    try {
      const { data, error } = await supabase
        .from('estados_academicos')
        .select('materia_id, estado')
        .eq('estudiante_id', estudianteId);
      
      if (error) throw error;
      setEstadosAcademicos(data || []);
    } catch (error) {
      console.error('Error al cargar estados académicos:', error);
    }
  };
  
  const fetchCorrelatividades = async () => {
    try {
      const { data, error } = await supabase
        .from('correlatividades')
        .select('materia_id, materia_requerida_id');
      
      if (error) throw error;
      setCorrelatividades(data || []);
    } catch (error) {
      console.error('Error al cargar correlatividades:', error);
    }
  };
  
  const handleEstudianteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const estudianteId = e.target.value;
    setCurrentEstudiante(estudianteId);
    setFormData(prev => ({ ...prev, estudiante_id: estudianteId }));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'materia_id') {
      validateCorrelatividades(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateCorrelatividades = (materiaId: string) => {
    const correlativasMateria = correlatividades.filter(c => c.materia_id === materiaId);
    
    if (correlativasMateria.length === 0) {
      setErrorCorrelativas([]);
      return true;
    }
    
    const materiasAprobadas = estadosAcademicos
      .filter(ea => ea.estado === 'Acreditada')
      .map(ea => ea.materia_id);
    
    const correlativasFaltantes = correlativasMateria.filter(
      corr => !materiasAprobadas.includes(corr.materia_requerida_id)
    );
    
    if (correlativasFaltantes.length > 0) {
      const materiasRequeridas = correlativasFaltantes.map(cf => 
        materias.find(m => m.id === cf.materia_requerida_id)
      ).filter(Boolean) as Materia[];
      
      setErrorCorrelativas(materiasRequeridas.map(m => `${m.codigo} - ${m.nombre}`));
      return false;
    }
    
    setErrorCorrelativas([]);
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (errorCorrelativas.length > 0 && !confirm('No cumple con todas las correlatividades. ¿Desea continuar de todas formas?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('inscripciones')
        .insert([formData]);
      
      if (error) throw error;
      
      toast.success('Inscripción registrada correctamente');
      fetchInscripciones(currentEstudiante);
      
      // Reiniciar el formulario
      setFormData(prev => ({
        ...prev,
        materia_id: '',
        tipo: 'Cursada',
        periodo: '1er Cuatrimestre 2025',
        fecha: new Date().toISOString().split('T')[0]
      }));
      setErrorCorrelativas([]);
    } catch (error) {
      console.error('Error al registrar inscripción:', error);
      toast.error('Error al registrar inscripción');
    }
  };
  
  const getEstudiante = (id: string) => {
    const estudiante = estudiantes.find(e => e.id === id);
    return estudiante ? `${estudiante.apellido}, ${estudiante.nombre}` : 'Desconocido';
  };
  
  const getMateriasDisponibles = () => {
    // Excluir materias ya inscriptas en el mismo período
    const materiasInscriptas = inscripciones
      .filter(i => i.periodo === formData.periodo && i.tipo === formData.tipo)
      .map(i => i.materia_id);
    
    return materias.filter(m => !materiasInscriptas.includes(m.id));
  };
  
  return (
    <MainLayout userRole="admin" userName="Admin Demo">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inscripciones</h1>
            <p className="text-muted-foreground">Gestión de inscripciones a cursadas y exámenes</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Inscripción
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Registrar Inscripción</DialogTitle>
                <DialogDescription>
                  Complete el formulario para registrar una inscripción
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="estudiante_id">Estudiante</Label>
                  <select
                    id="estudiante_id"
                    name="estudiante_id"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.estudiante_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione un estudiante</option>
                    {estudiantes.map(estudiante => (
                      <option key={estudiante.id} value={estudiante.id}>
                        {estudiante.apellido}, {estudiante.nombre} - DNI: {estudiante.dni}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Inscripción</Label>
                  <select
                    id="tipo"
                    name="tipo"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Cursada">Cursada</option>
                    <option value="Examen">Examen</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="periodo">Período</Label>
                  <select
                    id="periodo"
                    name="periodo"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.periodo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="1er Cuatrimestre 2025">1er Cuatrimestre 2025</option>
                    <option value="2do Cuatrimestre 2025">2do Cuatrimestre 2025</option>
                    <option value="Verano 2025">Verano 2025</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <input
                    id="fecha"
                    name="fecha"
                    type="date"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="materia_id">Materia</Label>
                  <select
                    id="materia_id"
                    name="materia_id"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.materia_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione una materia</option>
                    {getMateriasDisponibles().map(materia => (
                      <option key={materia.id} value={materia.id}>
                        {materia.codigo} - {materia.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                
                {errorCorrelativas.length > 0 && (
                  <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Correlatividades no cumplidas
                        </p>
                        <ul className="mt-1 text-sm text-yellow-700 space-y-1 list-disc list-inside">
                          {errorCorrelativas.map((materia, index) => (
                            <li key={index}>{materia}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button 
                    type="submit"
                    disabled={!formData.estudiante_id || !formData.materia_id}
                  >
                    Guardar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Seleccionar Estudiante</CardTitle>
                <CardDescription>Ver inscripciones por estudiante</CardDescription>
              </CardHeader>
              <CardContent>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={currentEstudiante}
                  onChange={handleEstudianteChange}
                >
                  <option value="">Seleccione un estudiante</option>
                  {estudiantes.map(estudiante => (
                    <option key={estudiante.id} value={estudiante.id}>
                      {estudiante.apellido}, {estudiante.nombre}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Inscripciones de {getEstudiante(currentEstudiante)}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-6">Cargando inscripciones...</p>
                ) : inscripciones.length > 0 ? (
                  <div className="space-y-4">
                    {inscripciones.map(inscripcion => (
                      <div key={inscripcion.id} className="flex items-center p-3 border rounded-md">
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {inscripcion.materia.codigo} - {inscripcion.materia.nombre}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(inscripcion.fecha).toLocaleDateString('es-AR')} • {inscripcion.tipo} • {inscripcion.periodo}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    {currentEstudiante ? 
                      'Este estudiante no tiene inscripciones registradas' :
                      'Seleccione un estudiante para ver sus inscripciones'
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Inscripciones;
