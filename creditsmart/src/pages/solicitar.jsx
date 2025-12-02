import React, { useState } from "react";

export default function Solicitar() {
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        monto: "",
        plazo: "",
    });

    const [errores, setErrores] = useState({});
    const [enviado, setEnviado] = useState(false);
    const [solicitudes, setSolicitudes] = useState([]); // array en memoria
    const [cuota, setCuota] = useState(null);

    // Validaciones en tiempo real
    const validar = (name, value) => {
        let error = "";

        if (name === "correo") {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regex.test(value)) error = "Correo inválido";
        }

        if (name === "monto") {
            if (value <= 0) error = "El monto debe ser mayor a 0";
        }

        if (name === "plazo") {
            if (value <= 0) error = "El plazo debe ser mayor a 0";
        }

        setErrores({ ...errores, [name]: error });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validar(name, value);

        // Calcular cuota mensual estimada al cambiar monto/plazo
        if (name === "monto" || name === "plazo") {
            const tasaMensual = 0.02; // ejemplo: 2% mensual
            const n = name === "plazo" ? value : formData.plazo;
            const P = name === "monto" ? value : formData.monto;

            if (P > 0 && n > 0) {
                const cuotaCalc =
                (P * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -n));
                setCuota(cuotaCalc.toFixed(2));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar antes de enviar
        const tieneErrores = Object.values(errores).some((err) => err !== "");
        if (tieneErrores) return;

        // Agregar solicitud al array en memoria
        setSolicitudes([...solicitudes, formData]);

        setEnviado(true);
        setFormData({ nombre: "", correo: "", monto: "", plazo: "" });
        setCuota(null);
    };

    return (
        <section>
            <h2>Solicitar Crédito</h2>
            {!enviado ? (
                <form onSubmit={handleSubmit} className="form-solicitar">
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre completo"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="correo"
                        placeholder="Correo electrónico"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                    />
                    {errores.correo && <p className="error">{errores.correo}</p>}
                    
                    <input
                        type="number"
                        name="monto"
                        placeholder="Monto solicitado"
                        value={formData.monto}
                        onChange={handleChange}
                        required
                    />
                    {errores.monto && <p className="error">{errores.monto}</p>}

                    <input
                        type="number"
                        name="plazo"
                        placeholder="Plazo en meses"
                        value={formData.plazo}
                        onChange={handleChange}
                        required
                    />
                    {errores.plazo && <p className="error">{errores.plazo}</p>}

                    {/* Resumen antes de enviar */}
                    {formData.nombre && formData.correo && formData.monto && formData.plazo && (
                        <div className="resumen">
                            <h3>Resumen de solicitud</h3>
                            <p>Nombre: {formData.nombre}</p>
                            <p>Correo: {formData.correo}</p>
                            <p>Monto: ${formData.monto}</p>
                            <p>Plazo: {formData.plazo} meses</p>
                            {cuota && <p>Cuota estimada: ${cuota}</p>}
                        </div>
                    )}

                    <button type="submit">Enviar solicitud</button>
                </form>
            ) : (
                <div className="confirmacion">
                    <h3>¡Solicitud enviada con éxito!</h3>
                    <p>Nos pondremos en contacto contigo pronto.</p>
                </div>
            )}
        </section>
    );
}
