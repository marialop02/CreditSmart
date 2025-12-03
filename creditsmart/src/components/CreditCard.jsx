import { useNavigate } from "react-router-dom";
export default function CreditCard({ credit }) {
    const nav = useNavigate();

    return (
        <div className="card">
            <div className="image">
                <img src={credit.image} alt={credit.name} />
            </div>
            {/* Nombre del crédito */}
            <div className="top">
                <h2>{credit.name}</h2>
            </div>

            {/* Monto y plazo */}
            <div className="descripcion">
                <p><strong>Monto:</strong> {credit.amount}</p>
                <p><strong>Plazo:</strong> {credit.term}</p>
            </div>
            {/* Tasa */}
            <div className="tasa">
                <p><strong>Tasa:</strong> {credit.interest}% anual</p>
            </div>

            {/* Descripción */}
            <div className="descripcion">
                <p>{credit.description}</p>
            </div>
            
            <div className="botones">
                <button className="botones-details" onClick={() => alert('Detalles: ' + credit.name)}>Detalles</button>
                <button className="botones-request" onClick={() => nav('/solicitar')}>Solicitar</button>
            </div>
        </div>
    );
}

