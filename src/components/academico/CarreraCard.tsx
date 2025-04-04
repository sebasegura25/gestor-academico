
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Clock, Book, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarreraCardProps {
  id: string;
  nombre: string;
  duracion: number;
  descripcion?: string;
  cantidadMaterias: number;
  planEstudioUrl?: string;
}

const CarreraCard: React.FC<CarreraCardProps> = ({
  id,
  nombre,
  duracion,
  descripcion,
  cantidadMaterias,
  planEstudioUrl
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{nombre}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-4">{descripcion}</p>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Clock className="h-4 w-4 mr-2" />
          <span>Duración: {duracion} años</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Book className="h-4 w-4 mr-2" />
          <span>Materias: {cantidadMaterias}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex gap-2">
        <Button variant="default" asChild className="flex-1">
          <Link to={`/carreras/${id}`}>
            Ver detalle
          </Link>
        </Button>
        {planEstudioUrl && (
          <Button variant="outline" className="flex gap-1" asChild>
            <a href={planEstudioUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span>Plan de estudios</span>
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CarreraCard;
