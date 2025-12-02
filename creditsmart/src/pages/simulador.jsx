import React, { useState } from "react";
import { creditos } from "../data/creditos";
import CreditCard from "../components/CreditCard";

export default function Simulador() {
    const [busqueda, setBusqueda] = useState("");
    const [monto, setMonto] = useState("");
    const [resultado, setResultado] = useState(null);

  // Filtrar créditos por nombre
    const filtrados = creditos.filter((c) =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

  // Calcular cuota mensual con fórmula de amortización simple
    const calcularCuota = (credito) => {
        const tasaMensual = credito.tasa / 100 / 12;
        const n = credito.plazo;
        const P = monto ? parseFloat(monto) : credito.monto;

        const cuota = (P * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -n));
        setResultado({
            nombre: credito.nombre,
            cuota: cuota.toFixed(2),
        });
    };

    return (
        <section>
            <h2>Simulador de Créditos</h2>

            {/* Buscador */}
            <input
                type="text"
                placeholder="Buscar crédito..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            {/* Monto personalizado */}
            <input
                type="number"
                placeholder="Monto a simular"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
            />

            {/* Lista de créditos filtrados */}
            <div className="credit-list">
                {filtrados.map((c) => (
                    <div key={c.id}>
                        <CreditCard {...c} />
                        <button onClick={() => calcularCuota(c)}>Calcular cuota</button>
                    </div>
                ))}
            </div>

            {/* Resultado */}
            {resultado && (
                <div className="resultado">
                    <h3>Resultado</h3>
                    <p>
                        Crédito: <strong>{resultado.nombre}</strong>
                    </p>
                    <p>
                        Cuota mensual: <strong>${resultado.cuota}</strong>
                    </p>
                </div>
            )}
        </section>
    );
}