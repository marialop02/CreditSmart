import { NavLink } from "react-router-dom";
export default function Navbar() {
    return (
        <header>
            <div className="title"><h2>CreditSmart</h2></div>
            <nav className="top-nav">
                <NavLink to="/">Inicio</NavLink>
                <NavLink to="/simulador">Simulador</NavLink>
                <NavLink to="/solicitar">Solicitar Crédito</NavLink>
                <NavLink to="/solicitudes">Solicitudes</NavLink>
            </nav>
        </header>
    );
}

