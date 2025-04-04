
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-appBackground">
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Página no encontrada</h2>
        <p className="text-gray-500">
          La página que estás buscando no existe o no está disponible en este momento.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>
      <div className="fixed bottom-0 w-full text-center p-4 text-sm text-gray-500">
        Soluciones Digitales - 2025 - General Madariaga
      </div>
    </div>
  );
};

export default NotFound;
