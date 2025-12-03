import React from "react";
import { Link } from "react-router-dom";
import creditsData from "../data/creditsData";
import CreditCard from "../components/CreditCard";

export default function Inicio() {
    return (
        <>
            {/* HEADER */}
            <header>
                <div className="title">
                    <h2>CreditSmart</h2>
                </div>

                <nav className="top-nav">
                    <Link to ="/">Inicio</Link>
                    <Link to="/simulador">Simulador</Link>
                    <Link to="/solicitar">Solicitar Crédito</Link>
                </nav>
            </header>

            {/* BANNER PRINCIPAL */}
            <main className="container">
                <section className="banner">
                    <div className="banner-content">
                        <h1>CreditSmart</h1>
                        <p>
                        Bienvenido a nuestra plataforma de créditos diseñada para facilitar tus decisiones financieras.
                        Explora nuestras opciones y descubre cuál se ajusta mejor a tus necesidades.
                        </p>

                        <div className="banner-btns">
                            <Link to="/simulador">
                                <button className="simulador">Simulador</button>
                            </Link>

                            <Link to="/solicitar">
                                <button className="request">Solicitar Crédito</button>
                            </Link>
                        </div>
                    </div>

                    <div className="banner-img"></div>
                </section>

                {/* TÍTULO DEL CATÁLOGO */}
                <section>
                    <div className="catalog-title">
                        <h2>OPCIONES DE CRÉDITO</h2>
                    </div>
                </section>

                {/* CATÁLOGO DE TARJETAS — las mismas que ya tenías */}
                <section className="catalog">
                    {creditsData.map((credit) => (
                        <CreditCard key={credit.id} credit={credit} />
                    ))}
                </section>
            </main>

            {/* FOOTER ORIGINAL */}
            <section>
                <footer className="footer">
                    <div className="content">
                        <div className="logo" aria-label="Logo CreditSmart, tu plataforma de credito">
                            <h3>CreditSmart</h3>
                            <p>Tu plataforma de créditos inteligente</p>
                        </div>

                        <nav className="footer-nav" aria-label="Enlaces del sitio">
                            <Link to="/">Inicio</Link>
                            <Link to="/simulador">Simulador</Link>
                            <Link to="/solicitar">Solicitar</Link>
                        </nav>

                        <div className="footer-info">
                            <p>© 2025 CreditSmart. Todos los derechos reservados.</p>
                            <p className="small">Proyecto educativo — no representa una entidad real.</p>
                        </div>
                    </div>
                </footer>
            </section>
        </>
    );
}
