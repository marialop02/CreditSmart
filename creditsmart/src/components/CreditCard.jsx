import { useNavigate } from "react-router-dom";
export default function CreditCard({ credit }) {
    const nav = useNavigate();
    return (
        <div className="card">
            <div className="descripcion">
                <h2>{credit.name}</h2>
                <p>{credit.description}</p>
            </div>
            <div className="tasa"><p><strong>Tasa:</strong> {credit.interest}%</p></div>
            <div className="botones">
                <button className="botones-details" onClick={() => alert('Detalles: ' + credit.name)}>Detalles</button>
                <button className="botones-request" onClick={() => nav('/solicitar')}>Solicitar</button>
            </div>
        </div>
    );
}

