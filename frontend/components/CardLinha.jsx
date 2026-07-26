import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CardLinha({ titulo, dados }) {
    // dados = [{ mes: 'Jan', proventos: 5000, debitos: 2000 }, ...]
    return (
        <div className="bg-white/60 rounded-2xl shadow-md p-4 flex flex-col gap-2">
            <h2 className="text-sm font-bold text-gray-600">{titulo}</h2>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dados}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${v}`} />
                    <Tooltip formatter={(val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                    <Line type="monotone" dataKey="proventos" stroke="#22c55e" strokeWidth={2} dot={false} name="Proventos" />
                    <Line type="monotone" dataKey="debitos" stroke="#f43f5e" strokeWidth={2} dot={false} name="Débitos" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}