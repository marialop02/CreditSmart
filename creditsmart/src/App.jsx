import React from "react";
import { Routes, Route } from "react-router-dom";
import Inicio from "./pages/inicio";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
    </Routes>
  );
}
