import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Solicitudes() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const snap = await getDocs(collection(db, "solicitudes"));
                const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setSolicitudes(data);
            } catch (e) {
                console.error("Error cargando solicitudes:", e);
                setError("No se pudieron cargar las solicitudes");
            } finally {
            setLoading(false);
            }
        };
        fetchSolicitudes();
    }, []);

    const cambiarEstado = async (id, nuevoEstado) => {
        await updateDoc(doc(db, "solicitudes", id), { estado: nuevoEstado });
        setSolicitudes(prev =>
            prev.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s)
        );
        setMensaje(`✅ Solicitud ${nuevoEstado}`);
    };

    const eliminarSolicitud = async (id) => {
        await deleteDoc(doc(db, "solicitudes", id));
        setSolicitudes(prev => prev.filter(s => s.id !== id));
        setMensaje("🗑️ Solicitud eliminada");
    };

    return (
        <>
            <Navbar/>

        {/* Contenido principal */}
        <main className="container">
            <section>
                <div className="catalog-title">
                    <h2>SOLICITUDES DE CRÉDITO</h2>
                </div>
            </section>

            <section className="tabla-solicitudes">
                {loading ? (
                    <p>Cargando solicitudes...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <>
                        {mensaje && (
                            <div className="alerta">
                                {mensaje}
                            </div>
                        )}

                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>Monto</th>
                                    <th>Plazo</th>
                                    <th>Cuota</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudes.map(s => (
                                    <tr key={s.id}>
                                        <td data-label="Nombre">{s.nombre}</td>
                                        <td data-label="Tipo">{s.tipo}</td>
                                        <td data-label="Monto">${s.monto.toLocaleString()}</td>
                                        <td data-label="Plazo">{s.plazo} meses</td>
                                        <td data-label="Cuota">${s.cuota.toLocaleString()}</td>
                                        <td data-label="Estado">
                                            <span className={`estado ${s.estado}`}>{s.estado}</span>
                                        </td>
                                        <td data-label="Acciones">
                                            <button className="btn aprobar" onClick={() => cambiarEstado(s.id, "aprobada")}>Aprobar</button>
                                            <button className="btn rechazar" onClick={() => cambiarEstado(s.id, "rechazada")}>Rechazar</button>
                                            <button className="btn eliminar" onClick={() => eliminarSolicitud(s.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </section>
        </main>

        {/* Footer */}
        <section>
            <footer className="footer">
            <div className="content">
                <div className="logo" aria-label="Logo CreditSmart, tu plataforma de crédito">
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
