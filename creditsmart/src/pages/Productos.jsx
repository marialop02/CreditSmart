import Navbar from "../components/NavBar";
import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc
} from "firebase/firestore";
import { db } from "../firebase"; // asegúrate que tu archivo firebase.js exporte db

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [nuevoProducto, setNuevoProducto] = useState({
        id: "",
        nombre: "",
        descripcion: "",
        imagen: "",
        interes: "",
        minAmount: "",
        maxAmount: "",
        termOptions: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [editando, setEditando] = useState(null); // estado para edición
    const [productoEditado, setProductoEditado] = useState({}); // producto en edición

    const cargarProductos = async () => {
        const snap = await getDocs(collection(db, "productos"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const ordenados = data.sort((a, b) => (a.idNum || 0) - (b.idNum || 0));
        setProductos(ordenados);
    };

  // Leer productos al cargar
    useEffect(() => {
    const fetchProductos = async () => {
        try {
            const snap = await getDocs(collection(db, "productos"));
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

            // Ordenar por el ID automático de Firestore (alfabético)
            const ordenados = data.sort((a, b) => {
                if (a.id < b.id) return -1;
                if (a.id > b.id) return 1;
                return 0;
            });

            setProductos(ordenados);
        } catch (e) {
            setError("Error cargando productos");
        console.error(e);
        } finally {
            setLoading(false);
        }
    };

    fetchProductos();
    }, []);


    // Crear producto
    const crearProducto = async (e) => {
        e.preventDefault();
        setError(""); // limpiar error
        setMensaje(""); // limpiar mensaje
        setLoading(true);

        try {
        await addDoc(collection(db, "productos"), {
            idNum: Number(nuevoProducto.id), // idNum para ordenar
            nombre: nuevoProducto.nombre,
            descripcion: nuevoProducto.descripcion,
            imagen: nuevoProducto.imagen,
            interes: Number(nuevoProducto.interes),
            minAmount: Number(nuevoProducto.minAmount),
            maxAmount: Number(nuevoProducto.maxAmount),
            termOptions: nuevoProducto.termOptions
        });

        setMensaje("Producto creado correctamente");

        // Resetear formulario
        setNuevoProducto({
            id: "",
            nombre: "",
            descripcion: "",
            imagen: "",
            interes: "",
            minAmount: "",
            maxAmount: "",
            termOptions: []
        });

        // Refrescar lista
        const snap = await getDocs(collection(db, "productos"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const ordenados = data.sort((a, b) => (a.idNum || 0) - (b.idNum || 0));
        setProductos(ordenados);
        } catch (err) {
        setError("Error al crear producto");
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    // Eliminar producto
    const eliminarProducto = async (id) => {
        try {
        await deleteDoc(doc(db, "productos", id));
        setProductos(productos.filter((p) => p.id !== id));
        setMensaje("🗑️ Producto eliminado");
        } catch (err) {
        setError("Error al eliminar producto");
        console.error(err);
        }
    };

    // Iniciar edición
    const iniciarEdicion = (producto) => {
        setEditando(producto.id);
        setProductoEditado({ ...producto });
    };

    // Actualizar producto
    const actualizarProducto = async (e) => {
        e.preventDefault();
        try {
        const ref = doc(db, "productos", editando);
        await updateDoc(ref, {
            name: productoEditado.name.trim(),
            description: productoEditado.description.trim(),
            image: productoEditado.image.trim(),
            interest: Number(productoEditado.interest),
            minAmount: Number(productoEditado.minAmount),
            maxAmount: Number(productoEditado.maxAmount),
            termOptions: productoEditado.termOptions
        });

        setMensaje("✏️ Producto actualizado");
        setEditando(null);
        setProductoEditado(null);

        await cargarProductos(); // refrescar y ordenar
        } catch (err) {
        setError("Error al actualizar producto");
        console.error(err);
        }
    };

    return (
        <>
            <Navbar/>

            <main className="productos-container">
                <h2>Gestión de Productos Crediticios</h2>

                {mensaje && <div className="alerta">{mensaje}</div>} {/* 🆕 feedback visual */}
                {error && <div className="error">{error}</div>}     {/* 🆕 feedback visual */}

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
                            value={nuevoProducto.nombre} // 🆕 antes era name
                            onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                            required
                        />
                        <textarea
                            placeholder="Descripción"
                            value={nuevoProducto.descripcion} // 🆕 antes era description
                            onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
                            required
                        ></textarea>
                        <input
                            type="text"
                            placeholder="Imagen (ej. /img/compracartera.jpg)"
                            value={nuevoProducto.imagen} // 🆕 antes era image
                            onChange={(e) => setNuevoProducto({ ...nuevoProducto, imagen: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Interés (%)"
                            value={nuevoProducto.interes} // 🆕 antes era interest
                            onChange={(e) => setNuevoProducto({ ...nuevoProducto, interes: e.target.value })}
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
                                        <td data-label="Monto mínimo">${p.minAmount.toLocaleString()}</td>
                                        <td data-label="Monto máximo">${p.maxAmount.toLocaleString()}</td>
                                        <td data-label="Plazos">{Array.isArray(p.termOptions) ? p.termOptions.join(", ") : ""}</td>
                                        <td data-label="Acciones">
                                        <button
                                            type="button"
                                            className="btn eliminar"
                                            aria-label={`Eliminar ${p.name}`}
                                            onClick={() => eliminarProducto(p.id)}
                                        >
                                            Eliminar
                                        </button>
                                        <button
                                            type="button"
                                            className="btn editar"
                                            aria-label={`Editar ${p.name}`}
                                            onClick={() => iniciarEdicion(p)}
                                        >
                                            Editar
                                        </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )} 
                </section>

                {editando && (
                    <section className="formulario-editar">
                        <h3>Editar producto</h3>
                        <form onSubmit={actualizarProducto}>
                            <input
                                type="text"
                                value={productoEditado.nombre}
                                onChange={(e) => setProductoEditado({ ...productoEditado, nombre: e.target.value })}
                                required
                            />
                            <textarea
                                value={productoEditado.descripcion}
                                onChange={(e) => setProductoEditado({ ...productoEditado, descripcion: e.target.value })}
                                required
                            ></textarea>
                            <input
                                type="text"
                                value={productoEditado.imagen}
                                onChange={(e) => setProductoEditado({ ...productoEditado, imagen: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                value={productoEditado.interes}
                                onChange={(e) => setProductoEditado({ ...productoEditado, interes: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                value={productoEditado.minAmount}
                                onChange={(e) => setProductoEditado({ ...productoEditado, minAmount: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                value={productoEditado.maxAmount}
                                onChange={(e) => setProductoEditado({ ...productoEditado, maxAmount: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                value={productoEditado.termOptions}
                                onChange={(e) =>
                                    setProductoEditado({
                                        ...productoEditado,
                                        termOptions: e.target.value.split(",").map(num => parseInt(num.trim()))
                                    })
                                }
                                required
                            />
                            <button type="submit">Guardar cambios</button>
                            <button type="button" onClick={() => setEditando(null)}>Cancelar</button>
                        </form>
                    </section>
                )}
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
