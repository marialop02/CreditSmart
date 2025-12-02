import React, { useState } from "react";

export default function Solicitar() {
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        monto: "",
        plazo: "",
    });

    const [enviado, setEnviado] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Solicitud enviada:", formData);
        setEnviado(true);
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
                    <input
                        type="number"
                        name="monto"
                        placeholder="Monto solicitado"
                        value={formData.monto}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="plazo"
                        placeholder="Plazo en meses"
                        value={formData.plazo}
                        onChange={handleChange}
                        required
                    />
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
