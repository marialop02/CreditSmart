import React from "react";

export default function CreditCard({ nombre, monto, tasa, plazo, descripcion }) {
    return (
        <div className="credit-card">
            <h3>{nombre}</h3>
            <p><strong>Monto:</strong> ${monto.toLocaleString()}</p>
            <p><strong>Tasa:</strong> {tasa}%</p>
            <p><strong>Plazo:</strong> {plazo} meses</p>
            <p>{descripcion}</p>
        </div>
    );
}
