import Navbar from "../components/NavBar";
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; // asegúrate que tu archivo firebase.js exporte db

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        tasa: "",
        plazoMaximo: "",
        descripcion: ""
    });
    const [loading, setLoading] = useState(true);

    // Leer productos al cargar
    useEffect(() => {
        const fetchProductos = async () => {
            const snap = await getDocs(collection(db, "productos"));
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Ordenar por id numérico ascendente
            const ordenados = data.sort((a, b) => a.id - b.id);

            setProductos(ordenados);
            setLoading(false);
        };
        fetchProductos();
    }, []);

    // Crear producto
    const crearProducto = async (e) => {
        e.preventDefault();
        setLoading(true);
        await addDoc(collection(db, "productos"), {
            id: Number(nuevoProducto.id),
            name: nuevoProducto.name,
            description: nuevoProducto.description,
            image: nuevoProducto.image,
            interest: Number(nuevoProducto.interest),
            minAmount: Number(nuevoProducto.minAmount),
            maxAmount: Number(nuevoProducto.maxAmount),
            termOptions: nuevoProducto.termOptions
        });
        setNuevoProducto({
            id: "",
            name: "",
            description: "",
            image: "",
            interest: "",
            minAmount: "",
            maxAmount: "",
            termOptions: []
        });

        const snap = await getDocs(collection(db, "productos"));
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const ordenados = data.sort((a, b) => a.id - b.id);
        setProductos(ordenados);
        setLoading(false);
    };

    // Eliminar producto
    const eliminarProducto = async (id) => {
        await deleteDoc(doc(db, "productos", id));
        setProductos(productos.filter(p => p.id !== id));
    };

    return (
        <>
            <Navbar/>

        <main className="productos-container">
            <h2>Gestión de Productos Crediticios</h2>

            <section className="formulario-producto">
                <h3>Crear nuevo producto</h3>
                <form onSubmit={crearProducto} className="form-producto">
                    <input
                        type="number"
                        placeholder="ID"
                        value={nuevoProducto.id}
                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, id: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nuevoProducto.name}
                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, name: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Descripción"
                        value={nuevoProducto.description}
                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, description: e.target.value })}
                        required
                    ></textarea>
                    <input
                        type="text"
                        placeholder="Imagen (ej. /img/compracartera.jpg)"
                        value={nuevoProducto.image}
                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, image: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Interés (%)"
                        value={nuevoProducto.interest}
                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, interest: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Monto mínimo"
                        value={nuevoProducto.minAmount}
                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, minAmount: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Monto máximo"
                        value={nuevoProducto.maxAmount}
                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, maxAmount: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Opciones de plazo (ej. 12,24,36,48,60)"
                        value={nuevoProducto.termOptions}
                        onChange={(e) =>
                            setNuevoProducto({
                            ...nuevoProducto,
                            termOptions: e.target.value.split(",").map(num => parseInt(num.trim()))
                            })
                        }
                        required
                    />
                    <button type="submit">Crear Producto</button>
                </form>
            </section>


            <section className="tabla-productos">
                <h3>Listado de productos</h3>
                {loading ? (
                    <p className="mensaje-cargando">Cargando productos...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Imagen</th>
                                <th>Interés</th>
                                <th>Monto mínimo</th>
                                <th>Monto máximo</th>
                                <th>Plazos</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map(p => (
                                <tr key={p.id}>
                                    <td data-label="ID">{p.id}</td>
                                    <td data-label="Nombre">{p.name}</td>
                                    <td data-label="Descripción">{p.description}</td>
                                    <td data-label="Imagen">{p.image}</td>
                                    <td data-label="Interés">{p.interest}%</td>
                                    <td data-label="Monto mínimo">${p.minAmount}</td>
                                    <td data-label="Monto máximo">${p.maxAmount}</td>
                                    <td data-label="Plazos">{p.termOptions?.join(", ")}</td>
                                    <td data-label="Acciones">
                                        <button className="btn eliminar" onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
