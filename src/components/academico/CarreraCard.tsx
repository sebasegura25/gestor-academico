
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type CarreraCardProps = {
  id: string;
  nombre: string;
  duracion: number;
  descripcion: string;
  cantidadMaterias: number;
  className?: string;
};

const CarreraCard: React.FC<CarreraCardProps> = ({
  id,
  nombre,
  duracion,
  descripcion,
  cantidadMaterias,
  className,
}) => {
  return (
    <Card className={`shadow-card overflow-hidden h-full ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{nombre}</CardTitle>
            <CardDescription className="text-sm mt-1">{duracion} años • {cantidadMaterias} materias</CardDescription>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3">
          {descripcion}
        </p>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild variant="outline" className="w-full text-primary border-primary/20">
          <Link to={`/carreras/${id}`}>
            Ver plan de estudios
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarreraCard;
