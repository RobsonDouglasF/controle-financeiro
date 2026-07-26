import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const CORES = ['#6366f1', '#f43f5e', '#22c55e', '#f59e0b', '#3b82f6'];

export default function CardPizza({ titulo, dados }) {
    // dados = [{ nome: 'Alimentação', valor: 500 }, ...]
    return (
        <div className="bg-white/60 rounded-2xl shadow-md p-4 flex flex-col gap-2">
            <h2 className="text-sm font-bold text-gray-600">{titulo}</h2>
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={dados}
                        dataKey="valor"
                        nameKey="nome"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ nome, percent }) => `${nome} ${(percent * 100).toFixed(0)}%`}
                    >
                        {dados.map((_, index) => (
                            <Cell key={index} fill={CORES[index % CORES.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}