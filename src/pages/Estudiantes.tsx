
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  fecha_ingreso: string;
  carrera_id: string;
  carrera?: {
    nombre: string;
  };
}

interface Carrera {
  id: string;
  nombre: string;
}

const Estudiantes: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState<Estudiante[]>([]);
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
        setFormData(prev => ({ ...prev, carrera_id: data[0].id }));
      }
    } catch (error) {
      console.error('Error al cargar carreras:', error);
      toast.error('Error al cargar carreras');
    }
  };

  const fetchEstudiantes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('estudiantes')
        .select(`
          *,
          carrera:carreras(nombre)
        `)
        .order('apellido')
        .order('nombre');
      
      if (error) throw error;
      
      const formattedData = data?.map(estudiante => ({
        ...estudiante,
        carrera: {
          nombre: estudiante.carrera?.nombre || 'Sin carrera'
        }
      })) || [];
      
      setEstudiantes(formattedData);
      setFilteredEstudiantes(formattedData);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      toast.error('Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarreras();
    fetchEstudiantes();
  }, []);

  useEffect(() => {
    // Filtrar por apellido, nombre o DNI
    const filtered = estudiantes.filter(estudiante => 
      estudiante.apellido.toLowerCase().includes(searchQuery.toLowerCase()) || 
      estudiante.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estudiante.dni.includes(searchQuery)
    );
    setFilteredEstudiantes(filtered);
  }, [searchQuery, estudiantes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCarreraChange = (value: string) => {
    setFormData(prev => ({ ...prev, carrera_id: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('estudiantes')
        .insert([formData]);
      
      if (error) throw error;
      
      toast.success('Estudiante registrado exitosamente');
      setFormData({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        fecha_ingreso: new Date().toISOString().split('T')[0],
        carrera_id: carreras.length > 0 ? carreras[0].id : ''
      });
      fetchEstudiantes();
    } catch (error) {
      console.error('Error al registrar estudiante:', error);
      toast.error('Error al registrar estudiante');
    }
  };

  return (
    <MainLayout userRole="admin" userName="Admin Demo">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Estudiantes</h1>
            <p className="text-muted-foreground">Gestión de datos de estudiantes</p>
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
                <DialogTitle>Registrar Estudiante</DialogTitle>
                <DialogDescription>
                  Complete el formulario para registrar un nuevo estudiante
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
                
                <div className="space-y-2">
                  <Label htmlFor="carrera">Carrera</Label>
                  <Select 
                    value={formData.carrera_id} 
                    onValueChange={handleCarreraChange}
                  >
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
            placeholder="Buscar por apellido, nombre o DNI..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p>Cargando estudiantes...</p>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium">Apellido y Nombre</th>
                  <th className="py-3 px-4 text-left font-medium">DNI</th>
                  <th className="py-3 px-4 text-left font-medium">Email</th>
                  <th className="py-3 px-4 text-left font-medium">Carrera</th>
                  <th className="py-3 px-4 text-left font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredEstudiantes.map((estudiante) => (
                  <tr key={estudiante.id} className="hover:bg-muted/30">
                    <td className="py-3 px-4">{estudiante.apellido}, {estudiante.nombre}</td>
                    <td className="py-3 px-4">{estudiante.dni}</td>
                    <td className="py-3 px-4">{estudiante.email}</td>
                    <td className="py-3 px-4">{estudiante.carrera?.nombre}</td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/estudiantes/${estudiante.id}`}>
                          Ver detalle
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredEstudiantes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      No se encontraron estudiantes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Estudiantes;
