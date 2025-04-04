
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MateriaCardProps {
  id: string;
  codigo: string;
  nombre: string;
  year: number;
  cuatrimestre: number;
  horas: number;
  carrera: string;
  docente?: string;
}

const MateriaCard: React.FC<MateriaCardProps> = ({ 
  id, 
  codigo, 
  nombre, 
  year, 
  cuatrimestre, 
  horas, 
  carrera,
  docente
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="text-xs font-medium text-muted-foreground mb-1">{codigo}</div>
        <CardTitle className="text-lg">{nombre}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <div className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {year}° año - {cuatrimestre}° cuatrimestre
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{horas}h</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground flex items-center">
          <Book className="h-4 w-4 mr-1" />
          <span>{carrera}</span>
        </div>
        {docente && (
          <div className="text-sm text-muted-foreground flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{docente}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="default" asChild className="w-full">
          <Link to={`/materias/${id}`}>
            Ver detalle
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MateriaCard;
