
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/carreras" element={<Carreras />} />
          <Route path="/carreras/:id" element={<CarreraDetalle />} />
          <Route path="/estudiantes" element={<Estudiantes />} />
          <Route path="/estudiantes/:id" element={<EstudianteDetalle />} />
          <Route path="/materias" element={<Materias />} />
          <Route path="/materias/:id" element={<MateriaDetalle />} />
          <Route path="/inscripciones" element={<Inscripciones />} />
          <Route path="/correlatividades" element={<Correlatividades />} />
          <Route path="/legajo" element={<LegajoEstudiantil />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
