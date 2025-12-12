import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar.jsx"
import Inicio from "./pages/Inicio.jsx";
import Simulador from "./pages/Simulador.jsx";
import Solicitar from "./pages/Solicitar.jsx";
import Solicitudes from "./pages/Solicitudes";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/simulador" element={<Simulador />} />
        <Route path="/solicitar" element={<Solicitar />} />
        
        {/* Si escriben una ruta que no existe → redirige al inicio */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/solicitudes" element={<Solicitudes />} />
      </Routes>
    </>
  );
}
