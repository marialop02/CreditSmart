import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="navbar">
            <h1>CreditSmart</h1>
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/simulador">Simulador</Link></li>
                <li><Link to="/solicitar">Solicitar</Link></li>
            </ul>
        </nav>
    );
}
