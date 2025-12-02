import React from "react";
import { creditos } from "../data/creditos";
import CreditCard from "../components/CreditCard";

export default function Inicio() {
    return (
        <section>
            <h2>Productos Crediticios</h2>
            <div className="credit-list">
                {creditos.map((c) => (
                    <CreditCard key={c.id} {...c} />
                ))}
            </div>
        </section>
    );
}
