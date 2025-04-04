
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

type EstadoAcademico = 'Cursando' | 'Regular' | 'Acreditada' | 'Libre';

type MateriaCardProps = {
  codigo: string;
  nombre: string;
  estado: EstadoAcademico;
  fecha?: string;
  nota?: number;
  className?: string;
};

const getEstadoColor = (estado: EstadoAcademico) => {
  switch (estado) {
    case 'Acreditada': return 'bg-green-500';
    case 'Regular': return 'bg-yellow-500';
    case 'Cursando': return 'bg-blue-500';
    case 'Libre': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getEstadoIcon = (estado: EstadoAcademico) => {
  switch (estado) {
    case 'Acreditada': return '🟢';
    case 'Regular': return '🟡';
    case 'Cursando': return '🔵';
    case 'Libre': return '🔴';
    default: return '⚪';
  }
};

const MateriaCard: React.FC<MateriaCardProps> = ({
  codigo,
  nombre,
  estado,
  fecha,
  nota,
  className,
}) => {
  return (
    <Card className={`shadow-card hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="font-medium text-gray-900">
            {codigo} - {nombre}
          </div>
          <div className="flex items-center space-x-1.5">
            <span>
              {getEstadoIcon(estado)}
            </span>
            <Badge className={`${getEstadoColor(estado)}`}>
              {estado} {nota ? `(${nota})` : ''}
            </Badge>
          </div>
          {fecha && (
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              {fecha}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MateriaCard;
