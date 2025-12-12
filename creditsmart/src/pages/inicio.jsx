import React from "react";
import { Link } from "react-router-dom";
import CreditCard from "../components/CreditCard";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/NavBar";

export default function Inicio() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const snap = await getDocs(collection(db, "productos"));
                const data = snap.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => a.name.localeCompare(b.name));
                setProductos(data);
            } catch (err) {
                console.error("Error cargando productos:", err);
                setError("No fue posible cargar los productos. Intenta de nuevo.");
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, []);

    return (
        <>
            <Navbar />
            
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

                {/* CATÁLOGO DE TARJETAS — las mismas que ya tenía */}
                <section className="catalog">
                    {loading ? (
                        <p>Cargando productos...</p>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : productos.length === 0 ? (
                        <p>No hay productos disponibles.</p>
                    ) : (
                        productos.map((credit) => (
                            <CreditCard key={credit.id} credit={credit} />
                        ))
                    )}
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
                            <a href="/">Inicio</a>
                            <a href="/simulador">Simulador</a>
                            <a href="/solicitar">Solicitar</a>
                            <a href="/solicitudes">Solicitudes</a>
                            <a href="/productos">Productos</a>
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
