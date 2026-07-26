import {
  BriefcaseBusiness,
  ChartPie,
  CircleArrowDown,
  CircleArrowUp,
} from "lucide-react";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import api from "../services/Api";
import CardList from "../components/CardList";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const CORES = [
  "#6366f1",
  "#f43f5e",
  "#22c55e",
  "#f59e0b",
  "#3b82f6",
  "#ec4899",
];

export default function Dashboard({ onClick, mesSelecionado }) {
  const [resumoAtual, setResumoAtual] = useState({
    totalProventos: 0,
    totalDebitos: 0,
    economia: 0,
  });
  const [resumoPassado, setResumoPassado] = useState({
    totalProventos: 0,
    totalDebitos: 0,
    economia: 0,
  });
  const [proventos, setProventos] = useState([]);
  const [debitos, setDebitos] = useState([]);  

  useEffect(() => {
    const { mes, ano } = mesSelecionado;
    const mesPassado = mes === 1 ? 12 : mes - 1;
    const anoMesPassado = mes === 1 ? ano - 1 : ano;

    api
      .get(`/debito?mes=${mes}&ano=${ano}`)
      .then((res) => setDebitos(res.data))
      .catch(() => alert("Erro ao buscar debitos da lista"));
    api
      .get(`/provento?mes=${mes}&ano=${ano}`)
      .then((res) => setProventos(res.data))
      .catch(() => alert("Erro ao buscar proventos da lista"));
    api
      .get(`/resumo?mes=${mes}&ano=${ano}`)
      .then((res) => setResumoAtual(res.data))
      .catch(() => alert("Erro ao buscar resumo do mês atual"));
    api
      .get(`/resumo?mes=${mesPassado}&ano=${anoMesPassado}`)
      .then((res) => setResumoPassado(res.data))
      .catch(() => alert("Erro ao buscar resumo do mês passado"));
  }, [mesSelecionado]);

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);

  const calcularVariacao = (atual, passado) => {
    const a = Number(atual) || 0;
    const p = Number(passado) || 0;
    if (p === 0 && a === 0) return null;
    if (p === 0) return null;
    if (a === 0) return null;
    return (((a - p) / p) * 100).toFixed(1);
  };

  const textoVariacao = (variacao) => {
    if (variacao === null) return "— Sem dados anteriores";
    const sinal = Number(variacao) >= 0 ? "▲" : "▼";
    return `${sinal} ${Math.abs(variacao)}% vs mês passado`;
  };

  const status = (valor) => {
    if (valor > 0) return { texto: "Positivo", corTexto: "text-green-500" };
    if (valor < 0) return { texto: "Negativo", corTexto: "text-red-500" };
    return { texto: "Neutro", corTexto: "text-gray-300" };
  };

  const variacaoProventos = calcularVariacao(
    resumoAtual.totalProventos,
    resumoPassado.totalProventos,
  );
  const variacaoDebitos = calcularVariacao(
    resumoAtual.totalDebitos,
    resumoPassado.totalDebitos,
  );
  const variacaoEconomia = calcularVariacao(
    resumoAtual.economia,
    resumoPassado.economia,
  );

  const dadosPizza = debitos.reduce((acc, item) => {
    const existente = acc.find((d) => d.nome === item.categoria);
    if (existente) existente.valor += Number(item.valor);
    else acc.push({ nome: item.categoria, valor: Number(item.valor) });
    return acc;
  }, []);

  const dadosLinha = [
    {
      mes: "Mês passado",
      proventos: resumoPassado.totalProventos,
      debitos: resumoPassado.totalDebitos,
    },
    {
      mes: "Mês atual",
      proventos: resumoAtual.totalProventos,
      debitos: resumoAtual.totalDebitos,
    },
  ];

  return (
    <div className="px-5  w-full bg">
      <div className="flex w-full px-4 py-3 justify-end">
        <button
          className="bg-indigo-700 rounded-lg text-white py-2 px-5 text-xs shadow-md cursor-pointer hover:bg-indigo-500"
          onClick={onClick}
        >
          Adicionar Lançamento
        </button>
      </div>

      <div className="flex gap-4 justify-between  items-start ">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex gap-4 flex-wrap">
            <Card
              bg="bg-blue-50/40"
              corValor="text-blue-500 font-bold"
              img={<BriefcaseBusiness />}
              p="Saldo do mês"
              valor={formatarMoeda(resumoAtual.economia)}
              p2={status(resumoAtual.economia).texto}
              corP2={status(resumoAtual.economia).corTexto}
              cssImg="bg-blue-200/30 text-blue-700"
            />
            <Card
              bg="bg-red-50/40"
              img={<CircleArrowDown />}
              p="Total de Débitos"
              valor={formatarMoeda(resumoAtual.totalDebitos)}
              p2={textoVariacao(variacaoDebitos)}
              corValor="text-red-500 font-bold"
              cssImg="bg-fuchsia-200/30 text-fuchsia-700"
            />
            <Card
              img={<CircleArrowUp />}
              p="Total de Proventos"
              valor={formatarMoeda(resumoAtual.totalProventos)}
              p2={textoVariacao(variacaoProventos)}
              corValor="text-green-500 font-bold"
              cssImg="bg-green-200/30 text-green-700"
            />
            <Card
              img={<ChartPie />}
              p="Economia vs mês passado"
              valor={formatarMoeda(resumoPassado.economia)}
              p2={textoVariacao(variacaoEconomia)}
              corValor="text-purple-500 font-bold"
              cssImg="bg-purple-200/30 text-purple-700"
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="bg-white/60 rounded-2xl shadow-md p-4 flex flex-col gap-2 flex-1 min-w-70">
              <h2 className="text-sm font-bold text-gray-600">
                Proventos vs Débitos
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dadosLinha}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `R$${v}`}
                  />
                  <Tooltip
                    formatter={(val) =>
                      val.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="proventos"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Proventos"
                  />
                  <Line
                    type="monotone"
                    dataKey="debitos"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    name="Débitos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/60 rounded-2xl shadow-md p-4 flex flex-col gap-2 flex-1 min-w-70">
              <h2 className="text-sm font-bold text-gray-600">
                Débitos por categoria
              </h2>
              {dadosPizza.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-10">
                  Sem dados
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={dadosPizza}
                      dataKey="valor"
                      nameKey="nome"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ nome, percent }) =>
                        `${nome} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {dadosPizza.map((_, index) => (
                        <Cell key={index} fill={CORES[index % CORES.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) =>
                        val.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-72 max-w-80 ">
          <CardList
            titulo="Proventos lançados"
            listaCard={proventos.slice(0, 5).map((item) => ({
              nome: item.nome,
              valor: item.valor,
              tipo: item.tipo,
            }))}
          />
          <CardList
            titulo="Débitos lançados"
            listaCard={debitos.slice(0, 5).map((item) => ({
              nome: item.nome,
              valor: item.valor,
              parcela: item.parcela,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
