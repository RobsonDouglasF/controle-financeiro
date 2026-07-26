import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import api from "../services/Api";
import CentralNav from "../components/CentralNav";
import  CustomTooltip  from  "../components/CustomTooltip" ;

const CORES = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#e0e7ff"];

const formatarMoeda = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

  export default function PaginaRelatorios({ mesSelecionado }) {
  const [debitos, setDebitos] = useState([]);
  const [proventos, setProventos] = useState([]);
  const [evolucao, setEvolucao] = useState([]);

  useEffect(() => {
    const { mes, ano } = mesSelecionado;
    api.get(`/debito?mes=${mes}&ano=${ano}`).then((r) => setDebitos(r.data)).catch(() => {});
    api.get(`/provento?mes=${mes}&ano=${ano}`).then((r) => setProventos(r.data)).catch(() => {});

    const meses = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(ano, mes - 1 - i, 1);
      meses.push({ mes: d.getMonth() + 1, ano: d.getFullYear() });
    }

    Promise.all(
      meses.map((m) =>
        Promise.all([
          api.get(`/debito?mes=${m.mes}&ano=${m.ano}`).then((r) => r.data),
          api.get(`/provento?mes=${m.mes}&ano=${m.ano}`).then((r) => r.data),
        ]).then(([deb, prov]) => ({
          mes: `${String(m.mes).padStart(2, "0")}/${String(m.ano).slice(2)}`,
          despesas: deb.reduce((a, b) => a + Number(b.valor), 0),
          receitas: prov.reduce((a, b) => a + Number(b.valor), 0),
        }))
      )
    ).then(setEvolucao).catch(() => {});
  }, [mesSelecionado]);


  const totalDespesas = debitos.reduce((a, b) => a + Number(b.valor), 0);
  const totalReceitas = proventos.reduce((a, b) => a + Number(b.valor), 0);
  const saldo = totalReceitas - totalDespesas;


  const porCategoria = debitos.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + Number(item.valor);
    return acc;
  }, {});
  const dadosCategoria = Object.entries(porCategoria).map(([name, value]) => ({ name, value }));


  const todasTransacoes = [
    ...debitos.map((d) => ({ ...d, _tipo: "Débito" })),
    ...proventos.map((p) => ({ ...p, _tipo: "Provento" })),
  ].sort((a, b) => new Date(b.registro || b.data) - new Date(a.registro || a.data));

  return (
    <div className="px-5 w-full flex flex-col gap-5 py-5">

      <CentralNav
        mesSelecionado={mesSelecionado}
        titulo="Relatórios"
        textoBotao="Exportar"
        novo={() => window.print()}
      />


      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total de Receitas", valor: totalReceitas, cor: "text-green-600", bg: "bg-green-50", icon: "📈" },
          { label: "Total de Despesas", valor: totalDespesas, cor: "text-red-500", bg: "bg-red-50", icon: "📉" },
          { label: "Saldo do Período", valor: saldo, cor: saldo >= 0 ? "text-indigo-600" : "text-red-500", bg: "bg-indigo-50", icon: "💰" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center text-2xl`}>
              {card.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">{card.label}</p>
              <h2 className={`text-lg font-extrabold ${card.cor}`}>{formatarMoeda(card.valor)}</h2>
              <p className="text-[10px] text-gray-400">{debitos.length + proventos.length} lançamentos</p>
            </div>
          </div>
        ))}
      </div>


      <div className="grid grid-cols-3 gap-4">

        <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Evolução Mensal</h3>
              <p className="text-[10px] text-gray-400">Receitas vs Despesas — últimos 6 meses</p>
            </div>
            <div className="flex gap-4 text-[10px] font-semibold text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-1 bg-indigo-500 rounded inline-block" /> Receitas</span>
              <span className="flex items-center gap-1"><span className="w-3 h-1 bg-rose-400 rounded inline-block" /> Despesas</span>
            </div>
          </div>
          {evolucao.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={evolucao}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="receitas" name="Receitas" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="despesas" name="Despesas" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-xs text-gray-400">Carregando dados...</div>
          )}
        </div>


        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-1">Despesas por Categoria</h3>
          <p className="text-[10px] text-gray-400 mb-3">Distribuição do mês</p>
          {dadosCategoria.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={dadosCategoria} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {dadosCategoria.map((_, i) => (
                      <Cell key={i} fill={CORES[i % CORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatarMoeda(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 mt-2">
                {dadosCategoria.map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: CORES[i % CORES.length] }} />
                      <span className="text-gray-600 font-semibold">{cat.name}</span>
                    </div>
                    <span className="text-gray-500">{formatarMoeda(cat.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-xs text-gray-400">Sem dados</div>
          )}
        </div>
      </div>


      {dadosCategoria.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-1">Gastos por Categoria</h3>
          <p className="text-[10px] text-gray-400 mb-4">Comparativo do mês atual</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={dadosCategoria} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
              <Tooltip formatter={(v) => formatarMoeda(v)} />
              <Bar dataKey="value" name="Valor" radius={[6, 6, 0, 0]}>
                {dadosCategoria.map((_, i) => (
                  <Cell key={i} fill={CORES[i % CORES.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}


      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 mb-1">Resumo de Transações</h3>
        <p className="text-[10px] text-gray-400 mb-4">Todas as movimentações do período</p>
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-semibold">
                <th className="px-4 py-3 text-left rounded-l-xl">Data</th>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Categoria</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-right rounded-r-xl">Valor</th>
              </tr>
            </thead>
            <tbody>
              {todasTransacoes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Nenhuma transação encontrada.</td>
                </tr>
              ) : (
                todasTransacoes.map((t, i) => {
                  const isProvento = t._tipo === "Provento";
                  const data = (t.registro || t.data || "").slice(0, 10);
                  return (
                    <tr key={i} className="border-t border-gray-100 hover:bg-indigo-50/40 transition-colors">
                      <td className="px-4 py-3 text-gray-400">{data}</td>
                      <td className="px-4 py-3 font-semibold text-gray-700">{t.nome}</td>
                      <td className="px-4 py-3">
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg font-semibold">{t.categoria}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg font-semibold ${isProvento ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {t._tipo}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right font-bold ${isProvento ? "text-green-600" : "text-red-500"}`}>
                        {isProvento ? "+" : "-"}{formatarMoeda(t.valor)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-gray-400 mt-3">{todasTransacoes.length} registros no período</p>
      </div>
    </div>
  );
}