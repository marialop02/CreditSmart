import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { useState } from "react";
import creditsData from "../data/creditsData";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function Solicitar() {
      // Estados del formulario
    const [nombre, setNombre] = useState("");
    const [cedula, setCedula] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [tipo, setTipo] = useState("Crédito Libre Inversión");
    const [monto, setMonto] = useState("");
    const [plazo, setPlazo] = useState("12");
    const [destino, setDestino] = useState("");
    const [empresa, setEmpresa] = useState("");
    const [cargo, setCargo] = useState("");
    const [ingresos, setIngresos] = useState("");
    const [solicitudes, setSolicitudes] = useState([]); // array en memoria
    const [cuota, setCuota] = useState(null);
    const creditoSeleccionado = creditsData.find((c) => c.name === tipo);
    const tasaAnual = creditoSeleccionado?.interest || 0;
    const tasaMensual = tasaAnual / 12 / 100;
    const [mensaje, setMensaje] = useState("");

    // Función para calcular cuota mensual estimada
    const calcularCuota = (monto, plazo, tasaMensual) => {
        if (!monto || !plazo || !tasaMensual) return null;
        const cuota =
            (monto * tasaMensual) /
            (1 - Math.pow(1 + tasaMensual, -plazo));
        return Math.round(cuota);
    };

    // Actualizar cuota cuando cambian monto o plazo
    const handleMontoChange = (e) => {
        const value = e.target.value;
        setMonto(value);
        setCuota(calcularCuota(Number(value), Number(plazo), tasaMensual));
    };

    const handlePlazoChange = (e) => {
        const value = e.target.value.replace(" meses", "");
        setPlazo(value);
        setCuota(calcularCuota(Number(monto), Number(value), tasaMensual));
    };

    // Obtener plazos dinámicos según tipo de crédito
    const obtenerPlazos = (tipo) => {
        const credito = creditsData.find((c) => c.name === tipo);
        if (!credito) return [];
        const term = credito.term;

        if (term.includes("-")) {
            const [min, max] = term.replace(" meses", "").split("-").map((n) => parseInt(n.trim()));
            const opciones = [];
            for (let i = min; i <= max; i += 12) {
                opciones.push(i);
            }
            return opciones;
        } else if (term.includes("Hasta")) {
            const max = parseInt(term.replace("Hasta", "").replace("meses", "").trim());
            const opciones = [];
            for (let i = 12; i <= max; i += 12) {
                opciones.push(i);
            }
            return opciones;
        }
        return [];
    };

    // Manejo de envío
    const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevaSolicitud = {
        nombre,
        cedula,
        email,
        telefono,
        tipo,
        monto: Number(monto),
        plazo: Number(plazo),
        destino,
        empresa,
        cargo,
        ingresos: Number(ingresos),
        cuota: Number(cuota),
        estado: "pendiente",
        createdAt: serverTimestamp(),
    };

    try {
        await addDoc(collection(db, "solicitudes"), nuevaSolicitud);
        setMensaje("✅ Solicitud enviada con éxito");
        // limpiar formulario
        setNombre("");
        setCedula("");
        setEmail("");
        setTelefono("");
        setTipo("Crédito Libre Inversión");
        setMonto("");
        setPlazo("12");
        setDestino("");
        setEmpresa("");
        setCargo("");
        setIngresos("");
        setCuota(null);
    } catch (error) {
        console.error("Error al guardar en Firestore:", error);
        setMensaje("❌ Error al enviar la solicitud");
    }
};
    
    return (
        <>
            <Navbar/>

            <main className="container">
                {/* BANNER */}
                <section className="banner-simulador">
                    <div className="banner-content">
                        <h1>CreditSmart</h1>
                        <p>
                        Con nuestro simulador podrás calcular fácilmente el valor de tu cuota mensual según el monto,
                        plazo y tasa de interés que elijas. Descubre cómo se ajusta el crédito a tus necesidades y toma
                        decisiones financieras con mayor seguridad.
                        </p>
                    </div>
                </section>

                {/* TÍTULO */}
                <section>
                    <div className="catalog-title">
                        <h2>OPCIONES DE CRÉDITO</h2>
                    </div>
                </section>    

                {/* FORMULARIO */}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="nombre">Nombre completo</label>
                        <input 
                            id="nombre" 
                            type="text" 
                            placeholder="Juan Pérez" 
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="cedula">Cédula</label>
                        <input
                            id="cedula"
                            type="number"
                            placeholder="12345678"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="juan@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="telefono">Teléfono</label>
                        <input
                            id="telefono"
                            type="tel"
                            placeholder="+57 300 000 0000"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                        />
                    </div>

                    <div className="full">
                        <label htmlFor="tipo">Tipo de crédito</label>
                        <select
                            id="tipo"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
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

                    <div>
                        <label htmlFor="monto">Monto solicitado</label>
                        <input
                            id="monto"
                            type="number"
                            placeholder="10000000"
                            value={monto}
                            onChange={handleMontoChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="plazo">Plazo en meses</label>
                        <select id="plazo" value={plazo} onChange={handlePlazoChange}>
                            {creditsData.find((c) => c.name === tipo)?.termOptions.map((p) => (
                                <option key={p} value={p}>{p} meses</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Cuota mensual estimada:</label>
                        <p>{cuota ? `$${cuota}` : "Ingrese monto y plazo"}</p>
                    </div>

                    <div className="full">
                        <label htmlFor="destino">Destino del crédito</label>
                        <textarea
                            id="destino"
                            placeholder="Describa el uso del crédito..."
                            value={destino}
                            onChange={(e) => setDestino(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="empresa">Empresa donde trabaja</label>
                        <input
                            id="empresa"
                            type="text"
                            placeholder="Compañía S.A.S"
                            value={empresa}
                            onChange={(e) => setEmpresa(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="cargo">Cargo</label>
                        <input
                            id="cargo"
                            type="text"
                            placeholder="Analista"
                            value={cargo}
                            onChange={(e) => setCargo(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="ingresos">Ingresos mensuales</label>
                        <input
                            id="ingresos"
                            type="number"
                            placeholder="2500000"
                            value={ingresos}
                            onChange={(e) => setIngresos(e.target.value)}
                            required
                        />
                    </div>

                    <div className="buscador-botones">
                        <button
                        type="reset"
                        className="btn-limpiar"
                        onClick={() => {
                            setNombre(""); setCedula(""); setEmail(""); setTelefono("");
                            setTipo("Crédito Libre Inversión"); setMonto(""); setPlazo("12");
                            setDestino(""); setEmpresa(""); setCargo(""); setIngresos("");
                            setCuota(null); setMensaje("");
                        }}
                        >
                            Limpiar
                        </button>
                        <button type="submit" className="btn-solicitar">
                            Solicitar crédito
                        </button>
                    </div>
                </form>    
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
