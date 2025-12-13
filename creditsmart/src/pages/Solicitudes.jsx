import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";

export default function Solicitudes() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [editando, setEditando] = useState(null); // id de la solicitud en edición
    const [solicitudEditada, setSolicitudEditada] = useState({
        id: "",
        nombre: "",
        cedula: "",
        cargo: "",
        empresa: "",
        email: "",
        telefono: "",
        ingresos: "",
        monto: "",
        plazo: "",
        destino: "",
        tipo: "",
        cuota: "",
        estado: "pendiente",
    });

    // Estado para creación
    const [nuevaSolicitud, setNuevaSolicitud] = useState({
        nombre: "",
        cedula: "",
        cargo: "",
        empresa: "",
        email: "",
        telefono: "",
        ingresos: "",
        monto: "",
        plazo: "",
        destino: "",
        tipo: "Crédito Libre Inversión",
        cuota: "",
        estado: "pendiente",
    });
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapSolicitudes = await getDocs(collection(db, "solicitudes"));
                const dataSolicitudes = snapSolicitudes.docs.map(d => ({ id: d.id, ...d.data() }));
                setSolicitudes(dataSolicitudes);

                // 🔹 Cargar productos
                const snapProductos = await getDocs(collection(db, "productos"));
                const dataProductos = snapProductos.docs.map(d => ({ id: d.id, ...d.data() }));
                setProductos(dataProductos);

                // 🔹 Calcular cuota si hay monto y plazo
                const producto = dataProductos.find(p => p.nombre === nuevaSolicitud.tipo);
                if (producto && nuevaSolicitud.monto && nuevaSolicitud.plazo) {
                    const montoNum = Number(nuevaSolicitud.monto);
                    const plazoNum = Number(nuevaSolicitud.plazo);
                    const cuotaCalc = calcularCuota(montoNum, producto.interes, plazoNum);
                    setNuevaSolicitud(prev => ({ ...prev, cuota: cuotaCalc }));
                }

            } catch (e) {
                console.error("Error cargando datos:", e);
                setError("No se pudieron cargar las solicitudes/productos");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [nuevaSolicitud.monto, nuevaSolicitud.plazo, nuevaSolicitud.tipo]);


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

    const iniciarEdicion = (solicitud) => {
        setEditando(solicitud.id);
        setSolicitudEditada({
            id: solicitud.id,
            nombre: solicitud.nombre,
            cedula: solicitud.cedula,
            cargo: solicitud.cargo,
            empresa: solicitud.empresa,
            email: solicitud.email,
            telefono: solicitud.telefono,
            ingresos: solicitud.ingresos,
            monto: solicitud.monto,
            plazo: solicitud.plazo,
            destino: solicitud.destino,
            tipo: solicitud.tipo,
            cuota: solicitud.cuota,
            estado: solicitud.estado || "pendiente",
        });
    };
    
    const crearSolicitud = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            const productosRef = collection(db, "productos");   // 🔴 AQUÍ declaras productosRef
            const q = query(productosRef, where("nombre", "==", nuevaSolicitud.tipo));
            const querySnap = await getDocs(q);

            if (querySnap.empty) {
                setError("El producto seleccionado no existe");
                return;
            }

            const producto = querySnap.docs[0].data();

            // ✅ Validar monto contra producto
            const montoNum = Number(nuevaSolicitud.monto);
                if (montoNum < producto.minAmount || montoNum > producto.maxAmount) {
                setError(`El monto debe estar entre ${producto.minAmount} y ${producto.maxAmount}`);
                return;
            }

            // ✅ Validar plazo contra producto
            const plazoNum = Number(nuevaSolicitud.plazo);
                if (!producto.termOptions.includes(plazoNum)) {
                setError(`El plazo debe ser uno de: ${producto.termOptions.join(", ")}`);
                return;
            }

            // ✅ Validar usuario
            const auth = getAuth();
            const user = auth.currentUser;
                if (!user) {
                setError("Debes iniciar sesión para crear la solicitud");
            return;
            }

            // ✅ Validaciones adicionales
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevaSolicitud.email)) {
                setError("El email no tiene un formato válido");
                return;
            }
            if (!/^\+57\d{10}$/.test(nuevaSolicitud.telefono)) {
                setError("El teléfono debe comenzar con +57 y tener 10 dígitos");
                return;
            }
            if (!/^\d{6,10}$/.test(nuevaSolicitud.cedula)) {
                setError("La cédula debe tener entre 6 y 10 dígitos numéricos");
                return;
            }
            if (Number(nuevaSolicitud.ingresos) <= 0) {
                setError("Los ingresos deben ser mayores a 0");
                return;
            }
            if (Number(nuevaSolicitud.cuota) <= 0) {
                setError("La cuota debe ser mayor a 0");
                return;
            }
            if (
                !nuevaSolicitud.cargo ||
                !nuevaSolicitud.empresa ||
                !nuevaSolicitud.destino ||
                !nuevaSolicitud.tipo
            ) {
            setError("Todos los campos de cargo, empresa, destino y tipo son obligatorios");
            return;
            }

            // ✅ Crear solicitud en Firestore
            await addDoc(collection(db, "solicitudes"), {
            ...nuevaSolicitud,
            monto: montoNum,
            plazo: plazoNum,
            usuarioId: user.uid,
            estado: nuevaSolicitud.estado || "pendiente",
            tipo: producto.nombre,
            cuota: calcularCuota(montoNum, producto.interes, plazoNum),
            createdAt: serverTimestamp(), // persistencia con timestamp
            });

            setMensaje("📥 Solicitud creada");

            // ✅ Resetear formulario
            setNuevaSolicitud({
                nombre: "",
                cedula: "",
                cargo: "",
                empresa: "",
                email: "",
                telefono: "",
                ingresos: "",
                monto: "",
                plazo: "",
                destino: "",
                tipo: "",
                cuota: "",
                estado: "pendiente",
                productoId: "",
            });

            // ✅ Refrescar lista
            const snap = await getDocs(collection(db, "solicitudes"));
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setSolicitudes(data);

        } catch (err) {
            setError("Error al crear la solicitud");
            console.error("Error en crearSolicitud:", err); // ✅ log para depuración
        }
    };

    // Actualizar solicitud
    const actualizarSolicitud = async (e) => {
        e.preventDefault();
        setError(null);

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(solicitudEditada.email)) {
            setError("El email no tiene un formato válido");
            return;
        }
        if (!/^\+57\d{10}$/.test(solicitudEditada.telefono)) {
            setError("El teléfono debe comenzar con +57 y tener 10 dígitos");
            return;
        }
        if (!/^\d{6,10}$/.test(solicitudEditada.cedula)) {
            setError("La cédula debe tener entre 6 y 10 dígitos numéricos");
            return;
        }
        if (solicitudEditada.ingresos <= 0) {
            setError("Los ingresos deben ser mayores a 0");
            return;
        }
        if (solicitudEditada.monto <= 0) {
            setError("El monto debe ser mayor a 0");
            return;
        }
        if (solicitudEditada.cuota <= 0) {
            setError("La cuota debe ser mayor a 0");
            return;
        }
        if (
            !solicitudEditada.cargo ||
            !solicitudEditada.empresa ||
            !solicitudEditada.destino ||
            !solicitudEditada.tipo
        ) {
            setError("Todos los campos de cargo, empresa, destino y tipo son obligatorios");
            return;
        }

        try {
            await updateDoc(doc(db, "solicitudes", solicitudEditada.id), {
                ...solicitudEditada,
            });
            setSolicitudEditada(null);
        } catch (err) {
            setError("Error al actualizar la solicitud");
        }
    };

    const calcularCuota = (monto, interes, plazo) => {
        const tasaMensual = interes / 100 / 12;
        return Math.round((monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo)));
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
                {/* Bloque centralizado de mensajes */}
                {mensaje && <div className="alerta">{mensaje}</div>}
                {error && <div className="error">{error}</div>}
            </section>

            <section className="formulario-crear">
                <h3>Crear nueva solicitud</h3>

                <form onSubmit={crearSolicitud}>
                    <div>
                        <label htmlFor="nombre">Nombre completo</label>
                        <input
                            id="nombre"
                            type="text"
                            placeholder="Juan Pérez"
                            value={nuevaSolicitud.nombre}
                            onChange={(e) => setNuevaSolicitud({ ...nuevaSolicitud, nombre: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="cedula">Cédula</label>
                        <input
                            id="cedula"
                            type="number"
                            placeholder="12345678"
                            value={nuevaSolicitud.cedula}
                            onChange={(e) => setNuevaSolicitud({ ...nuevaSolicitud, cedula: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="juan@ejemplo.com"
                            value={nuevaSolicitud.email}
                            onChange={(e) => setNuevaSolicitud({ ...nuevaSolicitud, email: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="telefono">Teléfono</label>
                        <input
                            id="telefono"
                            type="tel"
                            placeholder="+57 300 000 0000"
                            value={nuevaSolicitud.telefono}
                            onChange={(e) => setNuevaSolicitud({ ...nuevaSolicitud, telefono: e.target.value })}
                            required
                        />
                    </div>

                    {/* Tipo de crédito */}
                    <div className="full">
                        <label htmlFor="tipo">Tipo de crédito</label>
                        <select
                            id="tipo"
                            value={nuevaSolicitud.tipo}
                            onChange={(e) => setNuevaSolicitud({ ...nuevaSolicitud, tipo: e.target.value })}
                        >
                            <option value="Crédito Libre Inversión">Crédito Libre Inversión</option>
                            <option value="Crédito Vehicular">Crédito Vehicular</option>
                            <option value="Crédito Vivienda">Crédito Vivienda</option>
                            <option value="Crédito Educativo">Crédito Educativo</option>
                            <option value="Crédito Empresarial">Crédito Empresarial</option>
                            <option value="Crédito Hipotecario">Crédito Hipotecario</option>
                            <option value="Crédito de Compra de Cartera">Crédito de Compra de Cartera</option>
                        </select>
                    </div>

                    {/* Datos financieros */}
                    <div>
                        <label htmlFor="monto">Monto solicitado</label>
                        <input
                            id="monto"
                            type="number"
                            placeholder="10000000"
                            value={nuevaSolicitud.monto}
                            onChange={(e) => setNuevaSolicitud({ ...nuevaSolicitud, monto: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="plazo">Plazo en meses</label>
                        <select
                            id="plazo"
                            value={nuevaSolicitud.plazo}
                            onChange={(e) => setNuevaSolicitud({ ...nuevaSolicitud, plazo: e.target.value })}
                        >
                            {productos.find((c) => c.nombre === nuevaSolicitud.tipo)?.termOptions.map((p) => (
                                <option key={p} value={p}>{p} meses</option>
                            )) || <option value="12">12 meses</option>}
                        </select>
                    </div>

                    <div>
                        <label>Cuota mensual estimada:</label>
                        <p>{nuevaSolicitud.cuota ? `$${nuevaSolicitud.cuota}` : "Ingrese monto y plazo"}</p>
                    </div>

                    <div className="full">
                        <label htmlFor="destino">Destino del crédito</label>
                        <textarea
                            id="destino"
                            placeholder="Describa el uso del crédito..."
                            value={nuevaSolicitud.destino}
                            onChange={(e) => setNuevaSolicitud({ ...nuevaSolicitud, destino: e.target.value })}
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="empresa">Empresa donde trabaja</label>
                        <input
                            id="empresa"
                            type="text"
                            placeholder="Compañía S.A.S"
                            value={nuevaSolicitud.empresa}
                            onChange={(e) => setNuevaSolicitud({ ...nuevaSolicitud, empresa: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="cargo">Cargo</label>
                        <input
                            id="cargo"
                            type="text"
                            placeholder="Analista"
                            value={nuevaSolicitud.cargo}
                            onChange={(e) => setNuevaSolicitud({ ...nuevaSolicitud, cargo: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="ingresos">Ingresos mensuales</label>
                        <input
                            id="ingresos"
                            type="number"
                            placeholder="2500000"
                            value={nuevaSolicitud.ingresos}
                            onChange={(e) => setNuevaSolicitud({ ...nuevaSolicitud, ingresos: e.target.value })}
                            required
                        />
                    </div>

                    <div className="buscador-botones">
                        <button
                            type="reset"
                            className="btn-limpiar"
                            onClick={() =>
                                setNuevaSolicitud({
                                    nombre: "",
                                    cedula: "",
                                    email: "",
                                    telefono: "",
                                    tipo: "Crédito Libre Inversión",
                                    monto: "",
                                    plazo: "12",
                                    destino: "",
                                    empresa: "",
                                    cargo: "",
                                    ingresos: "",
                                    cuota: null,
                                    estado: "pendiente",
                                })
                            }
                        >
                            Limpiar
                        </button>
                        <button type="submit" className="btn-solicitar">
                            Solicitar crédito
                        </button>
                    </div>
                </form>
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
                                            <button className="btn editar" onClick={() => iniciarEdicion(s)}>Editar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {editando && (
                            <section className="formulario-editar">
                                <h3>Editar solicitud</h3>
                                <form onSubmit={actualizarSolicitud}>
                                    <input
                                        type="text"
                                        value={solicitudEditada.nombre}
                                        onChange={(e) => setSolicitudEditada({ ...solicitudEditada, nombre: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="number"
                                        value={solicitudEditada.monto}
                                        onChange={(e) => setSolicitudEditada({ ...solicitudEditada, monto: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="number"
                                        value={solicitudEditada.plazo}
                                        onChange={(e) => setSolicitudEditada({ ...solicitudEditada, plazo: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        value={solicitudEditada.productoId}
                                        onChange={(e) => setSolicitudEditada({ ...solicitudEditada, productoId: e.target.value })}
                                        required
                                    />
                                    <button type="submit">Guardar cambios</button>
                                    <button type="button" onClick={() => setEditando(null)}>Cancelar</button>
                                </form>
                            </section>
                        )}
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