// src/data/creditsData.js
const creditsData = [
    {
        id: 1,
        name: "Crédito Libre Inversión",
        image: "/img/libreinversion.jpg",
        minAmount: 1000000,   // 🔹 número
        maxAmount: 50000000,
        // amount: "$1.000.000 - $50.000.000",
        termOptions: [12, 24, 36, 48, 60],
        // plazo: "12 - 60 meses",
        interest: 10.5,
        description:
        "El crédito de libre inversión es una modalidad de financiamiento que te permite acceder a recursos económicos sin una destinación específica."
    },
    {
        id: 2,
        name: "Crédito Vehicular",
        image: "/img/vehicular.jpg",
        minAmount: 25000000,
        maxAmount: 80000000,
        // amount: "$25.000.000 - $80.000.000",
        termOptions: [12, 24, 36, 48, 60],
        // term: "Hasta 60 meses",
        interest: 9.8,
        description:
        "Financia la compra de tu vehículo nuevo o usado con tasas preferenciales y plazos flexibles."
    },
    {
        id: 3,
        name: "Crédito Vivienda",
        image: "/img/vivienda.jpg",
        minAmount: 1000000,
        maxAmount: 50000000,
        // amount: "$80.000.000 - $500.000.000",
        termOptions: [60, 120, 180, 240], 
        // term: "Hasta 240 meses",
        interest: 7.2,
        description:
        "Te permite comprar tu casa propia con tasas accesibles y plazos flexibles, adaptados a tus ingresos."
    },
    {
        id: 4,
        name: "Crédito Educativo",
        image: "/img/educativo.jpg",
        minAmount: 1000000,
        maxAmount: 100000000,
        //amount: "$1.000.000 - $100.000.000",
        termOptions: [12, 24, 36, 48, 60, 72, 84, 96, 108, 120],
        // term: "Hasta 120 meses",
        interest: 6.5,
        description:
        "Financia tus estudios técnicos, universitarios o de posgrado con tasas preferenciales y plazos flexibles."
    },
    {
        id: 5,
        name: "Crédito Empresarial",
        image: "/img/empresarial.jpg",
        minAmount: 10000000,
        maxAmount: 100000000,
        // amount: "$10.000.000 - $100.000.000",
        termOptions: [12, 24, 36, 48], 
        // term: "Hasta 48 meses",
        interest: 10.0,
        description:
        "Apoya el crecimiento de tu empresa con financiación para capital de trabajo, expansión o adquisición de equipos."
    },
    {
        id: 6,
        name: "Crédito Hipotecario",
        image: "/img/hipotecario.jpg",
        minAmount: 10000000,
        maxAmount: 500000000,
        //amount: "$10.000.000 - $500.000.000",
        termOptions: [60, 120, 180, 240],
        // term: "Hasta 240 meses",
        interest: 9.8,
        description:
        "Financia la compra o mejora de tu vivienda con plazos amplios y tasas competitivas. El inmueble sirve como garantía."
    },
    {
        id: 7,
        name: "Crédito de Compra de Cartera",
        image: "/img/compracartera.jpg",
        minAmount: 10000000,
        maxAmount: 50000000,
        //amount: "$10.000.000 - $50.000.000",
        termOptions: [12, 24, 36, 48, 60],
        //term: "Hasta 60 meses",
        interest: 11.0,
        description:
        "Unifica tus deudas en un solo lugar, paga menos cada mes y disfruta una tasa más baja."
    }
];

export default creditsData;
