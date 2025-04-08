
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Clock, User, CheckCircle2, AlertCircle, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface MateriaCardProps {
  id?: string;
  codigo: string;
  nombre: string;
  semestre?: number;
  cuatrimestre?: number;
  horas?: number;
  carrera?: string;
  docente?: string;
  estado?: 'Acreditada' | 'Regular' | 'Cursando' | 'Libre';
  fecha?: string;
  nota?: number;
}

const MateriaCard: React.FC<MateriaCardProps> = ({ 
  id, 
  codigo, 
  nombre, 
  semestre, 
  cuatrimestre, 
  horas, 
  carrera,
  docente,
  estado,
  fecha,
  nota
}) => {
  // Function to get the appropriate icon based on the estado
  const getEstadoIcon = () => {
    switch (estado) {
      case 'Acreditada':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Regular':
        return <Clock3 className="h-4 w-4 text-blue-500" />;
      case 'Cursando':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'Libre':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Function to get the appropriate color for the estado badge
  const getEstadoColor = () => {
    switch (estado) {
      case 'Acreditada':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Regular':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Cursando':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'Libre':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return '';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="text-xs font-medium text-muted-foreground mb-1">{codigo}</div>
        <CardTitle className="text-lg">{nombre}</CardTitle>
        {estado && (
          <div className="mt-2">
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1 ${getEstadoColor()}`}
            >
              {getEstadoIcon()}
              <span>{estado}</span>
              {nota && <span className="ml-1">({nota})</span>}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        {(semestre && cuatrimestre) && (
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {semestre}° año - {cuatrimestre}° cuatrimestre
            </div>
            {horas && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>{horas}h</span>
              </div>
            )}
          </div>
        )}
        {carrera && (
          <div className="text-sm text-muted-foreground flex items-center">
            <Book className="h-4 w-4 mr-1" />
            <span>{carrera}</span>
          </div>
        )}
        {docente && (
          <div className="text-sm text-muted-foreground flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{docente}</span>
          </div>
        )}
        {fecha && (
          <div className="text-sm text-muted-foreground">
            Fecha: {fecha}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        {id ? (
          <Button variant="default" asChild className="w-full">
            <Link to={`/materias/${id}`}>
              Ver detalle
            </Link>
          </Button>
        ) : (
          <div className="w-full"></div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MateriaCard;
