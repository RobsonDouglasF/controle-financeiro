// src/components/CustomTooltip.jsx
const formatarMoeda = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

export default function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-3 text-xs border border-gray-100">
        <p className="font-bold text-gray-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name}: {formatarMoeda(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}