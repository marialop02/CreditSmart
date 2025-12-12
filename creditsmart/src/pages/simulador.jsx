import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import CreditCard from "../components/CreditCard";

export default function Simulator() {
    const [search, setSearch] = useState("");
    const [range, setRange] = useState(""); // rango de monto
    const [sort, setSort] = useState("");   // orden por tasa
    const [sortAmount, setSortAmount] = useState("");
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const snap = await getDocs(collection(db, "productos"));
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProductos(data);
            } catch (err) {
                console.error("Error cargando productos:", err);
                setError("No se pudieron cargar los productos");
            } finally {
            setLoading(false);
            }
        };
        fetchProductos();
        }, []);
    
    // Función para filtrar créditos
    const filteredCredits = productos
        .filter((credit) =>
            credit.name.toLowerCase().includes(search.toLowerCase())
        )
        .filter((credit) => {
            if (!range) return true;
            const [min, max] = range.split("-").map(Number);
            return (
                credit.minAmount >= min * 1000000 &&
                credit.maxAmount <= max * 1000000
            );
        })
        .sort((a, b) => {
            if (sort === "menor-tasa") return a.interest - b.interest;
            if (sort === "mayor-tasa") return b.interest - a.interest;
            return 0;
        });
    
    return(
        <>
            <header>
                <div className="title">
                    <h2>CreditSmart</h2>
                </div>

                <nav className="top-nav">
                    <Link to="/">Inicio</Link>
                    <Link to="/simulador">Simulador</Link>
                    <Link to="/solicitar">Solicitar Crédito</Link>
                    <Link to="/solicitudes">Solicitudes</Link> {/* 🔹 nuevo enlace */}
                </nav>
            </header>

            <main className="container">
                {/* Banner */}
                <section className="banner-simulador">
                    <div className="banner-content">
                        <h1>CreditSmart</h1>
                        <p>
                        Con nuestro simulador podrás calcular fácilmente el valor de tu cuota mensual
                        según el monto, plazo y tasa de interés que elijas. Descubre cómo se ajusta
                        el crédito a tus necesidades y toma decisiones financieras con mayor seguridad.
                        </p>
                    </div>
                </section>

                {/* Título */}
                <section>
                    <div className="catalog-title">
                        <h2>OPCIONES DE CRÉDITO</h2>
                    </div>
                </section>

                {/* Buscador */}
                <section className="buscador-creditos">
                    <form className="buscador-form" aria-label="Buscador de productos y créditos">
                        <div className="buscador-campos">
                            <input
                                type="text"
                                placeholder="Buscar por nombre de producto"
                                className="buscador-input"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <select 
                                className="buscador-select"
                                value={range}
                                onChange={(e) => setRange(e.target.value)}
                            >
                                <option value="">Rango de monto: Todos</option>
                                <option value="1-10">$1M - $10M</option>
                                <option value="10-50">$10M - $50M</option>
                                <option value="50-100">$50M - $100M</option>
                            </select>

                            {/* Orden por tasa */}
                            <select
                                className="buscador-select"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="">Ordenar por</option>
                                <option value="menor-tasa">Menor tasa</option>
                                <option value="mayor-tasa">Mayor tasa</option>
                            </select>
                        </div>

                        <div className="buscador-botones">
                            <button type="reset" className="btn-limpiar">
                                Limpiar
                            </button>
                            <button type="submit" className="btn-solicitar">
                                Solicitar crédito
                            </button>
                        </div>
                    </form>
                </section>

                {/* CATÁLOGO */}
                <section className="catalog">
                    {loading ? (
                        <p>Cargando productos...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : filteredCredits.length === 0 ? (
                        <p>No hay créditos disponibles</p>
                    ) : (
                        filteredCredits.map((credit) => (
                            <CreditCard key={credit.id} credit={credit} />
                        ))
                    )}
                </section>

            </main>

        {/* Footer */}
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
