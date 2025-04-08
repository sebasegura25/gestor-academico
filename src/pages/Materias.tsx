import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MateriaCard from '@/components/academico/MateriaCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Plus, Search } from 'lucide-react';
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
  docente?: string;
  carrera?: {
    nombre: string;
  };
}
interface Carrera {
  id: string;
  nombre: string;
}
const Materias: React.FC = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [filteredMaterias, setFilteredMaterias] = useState<Materia[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    semestre: 1,
    cuatrimestre: 1,
    horas: 4,
    carrera_id: '',
    docente: ''
  });
  const fetchCarreras = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('carreras').select('id, nombre').order('nombre');
      if (error) throw error;
      setCarreras(data || []);
      if (data && data.length > 0) {
        setFormData(prev => ({
          ...prev,
          carrera_id: data[0].id
        }));
      }
    } catch (error) {
      console.error('Error al cargar carreras:', error);
      toast.error('Error al cargar carreras');
    }
  };
  const fetchMaterias = async () => {
    try {
      setLoading(true);
      const {
        data,
        error
      } = await supabase.from('materias').select(`
          *,
          carrera:carreras(nombre)
        `).order('semestre').order('cuatrimestre').order('nombre');
      if (error) throw error;
      const formattedData = data?.map(materia => ({
        ...materia,
        carrera: {
          nombre: materia.carrera?.nombre || 'Sin carrera asignada'
        }
      })) || [];
      setMaterias(formattedData);
      setFilteredMaterias(formattedData);
    } catch (error) {
      console.error('Error al cargar materias:', error);
      toast.error('Error al cargar materias');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCarreras();
    fetchMaterias();
  }, []);
  useEffect(() => {
    const filtered = materias.filter(materia => materia.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || materia.codigo.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredMaterias(filtered);
  }, [searchQuery, materias]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semestre' || name === 'cuatrimestre' || name === 'horas' ? parseInt(value) : value
    }));
  };
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cuatrimestre' && value === 'anual' ? 0 : value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        codigo: formData.codigo,
        nombre: formData.nombre,
        semestre: formData.semestre,
        cuatrimestre: formData.cuatrimestre,
        horas: formData.horas,
        carrera_id: formData.carrera_id,
        docente: formData.docente
      };
      const {
        error
      } = await supabase.from('materias').insert([dataToSubmit]);
      if (error) throw error;
      toast.success('Materia creada exitosamente');
      setFormData({
        codigo: '',
        nombre: '',
        semestre: 1,
        cuatrimestre: 1,
        horas: 4,
        carrera_id: formData.carrera_id,
        docente: ''
      });
      fetchMaterias();
    } catch (error) {
      console.error('Error al crear materia:', error);
      toast.error('Error al crear materia');
    }
  };
  return <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Materias</h1>
            <p className="text-muted-foreground">Gestión del catálogo de materias</p>
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
                <DialogTitle>Crear nueva materia</DialogTitle>
                <DialogDescription>
                  Complete el formulario para crear una nueva materia
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código</Label>
                    <Input id="codigo" name="codigo" value={formData.codigo} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  
                  <div className="space-y-2">
                    <Label htmlFor="cuatrimestre">Cuatrimestre</Label>
                    <Select value={formData.cuatrimestre === 0 ? "anual" : formData.cuatrimestre.toString()} onValueChange={value => handleSelectChange('cuatrimestre', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Cuatrimestre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1° cuatrimestre</SelectItem>
                        <SelectItem value="2">2° cuatrimestre</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horas">Horas semanales</Label>
                    <Input id="horas" name="horas" type="number" min="1" max="20" value={formData.horas} onChange={handleInputChange} required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carrera_id">Carrera</Label>
                  <Select value={formData.carrera_id} onValueChange={value => handleSelectChange('carrera_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una carrera" />
                    </SelectTrigger>
                    <SelectContent>
                      {carreras.map(carrera => <SelectItem key={carrera.id} value={carrera.id}>
                          {carrera.nombre}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="docente">Docente a cargo</Label>
                  <Input id="docente" name="docente" placeholder="Apellido y nombre del docente" value={formData.docente} onChange={handleInputChange} />
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
          <Input placeholder="Buscar materias por código o nombre..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>

        {loading ? <div className="text-center py-10">
            <p>Cargando materias...</p>
          </div> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMaterias.map(materia => <MateriaCard key={materia.id} id={materia.id} codigo={materia.codigo} nombre={materia.nombre} semestre={materia.semestre} cuatrimestre={materia.cuatrimestre} horas={materia.horas} carrera={materia.carrera?.nombre || ''} docente={materia.docente} />)}
            {filteredMaterias.length === 0 && <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No se encontraron materias con ese nombre o código</p>
              </div>}
          </div>}
      </div>
    </MainLayout>;
};
export default Materias;