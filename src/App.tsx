
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "./pages/Dashboard";
import Carreras from "./pages/Carreras";
import Estudiantes from "./pages/Estudiantes";
import Materias from "./pages/Materias";
import Inscripciones from "./pages/Inscripciones";
import Correlatividades from "./pages/Correlatividades";
import LegajoEstudiantil from "./pages/LegajoEstudiantil";
import EstudianteDetalle from "./pages/EstudianteDetalle";
import CarreraDetalle from "./pages/CarreraDetalle";
import MateriaDetalle from "./pages/MateriaDetalle";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setAuthenticated(!!data.session);
      setLoading(false);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthenticated(!!session);
        setLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!authenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/carreras" element={
            <ProtectedRoute>
              <Carreras />
            </ProtectedRoute>
          } />
          <Route path="/carreras/:id" element={
            <ProtectedRoute>
              <CarreraDetalle />
            </ProtectedRoute>
          } />
          <Route path="/estudiantes" element={
            <ProtectedRoute>
              <Estudiantes />
            </ProtectedRoute>
          } />
          <Route path="/estudiantes/:id" element={
            <ProtectedRoute>
              <EstudianteDetalle />
            </ProtectedRoute>
          } />
          <Route path="/materias" element={
            <ProtectedRoute>
              <Materias />
            </ProtectedRoute>
          } />
          <Route path="/materias/:id" element={
            <ProtectedRoute>
              <MateriaDetalle />
            </ProtectedRoute>
          } />
          <Route path="/inscripciones" element={
            <ProtectedRoute>
              <Inscripciones />
            </ProtectedRoute>
          } />
          <Route path="/correlatividades" element={
            <ProtectedRoute>
              <Correlatividades />
            </ProtectedRoute>
          } />
          <Route path="/legajo" element={
            <ProtectedRoute>
              <LegajoEstudiantil />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
