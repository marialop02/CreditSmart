import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function Solicitar() {
    return (
        <>
            <NavBar />

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
                <form>
                    <div>
                        <label htmlFor="nombre">Nombre completo</label>
                        <input id="nombre" type="text" placeholder="Juan Pérez" />
                    </div>

                    <div>
                        <label htmlFor="cedula">Cédula</label>
                        <input id="cedula" type="number" placeholder="12345678" />
                    </div>

                    <div>
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" placeholder="juan@ejemplo.com" />
                    </div>

                    <div>
                        <label htmlFor="telefono">Teléfono</label>
                        <input id="telefono" type="tel" placeholder="+57 300 000 0000" />
                    </div>

                    <div className="full">
                        <label htmlFor="tipo">Tipo de crédito</label>
                        <select id="tipo">
                            <option>Crédito Libre Inversión</option>
                            <option>Crédito Vehículo</option>
                            <option>Crédito Vivienda</option>
                            <option>Crédito Educativo</option>
                            <option>Crédito Empresarial</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="monto">Monto solicitado</label>
                        <input id="monto" type="number" placeholder="10000000" />
                    </div>

                    <div>
                        <label htmlFor="plazo">Plazo en meses</label>
                        <select id="plazo">
                            <option>12 meses</option>
                            <option>24 meses</option>
                            <option>36 meses</option>
                            <option>48 meses</option>
                            <option>60 meses</option>
                        </select>
                    </div>

                    <div className="full">
                        <label htmlFor="destino">Destino del crédito</label>
                        <textarea id="destino" placeholder="Describa el uso del crédito..."></textarea>
                    </div>

                    <div>
                        <label htmlFor="empresa">Empresa donde trabaja</label>
                        <input id="empresa" type="text" placeholder="Compañía S.A.S" />
                    </div>

                    <div>
                        <label htmlFor="cargo">Cargo</label>
                        <input id="cargo" type="text" placeholder="Analista" />
                    </div>

                    <div>
                        <label htmlFor="ingresos">Ingresos mensuales</label>
                        <input id="ingresos" type="number" placeholder="2500000" />
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
