import { CalendarDays, ChevronDown, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CentralNav({ mesSelecionado, novo, titulo, textoBotao }) {
  const [statusCategoria, setStatusCategoria] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const categorias = [
    "Todas as categorias",
    "Casa",
    "Carro",
    "Lazer",
    "Comida",
    "Deslocamento",
    "Dog",
    "Estudos",
    "Compras",
  ];

  const [statusTipo, setStatusTipo] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const tipos = ["Todos os tipos", "Fixo", "Variavel"];

  const primeiroDia = new Date(mesSelecionado.ano, mesSelecionado.mes - 1, 1);
  const ultimoDia = new Date(mesSelecionado.ano, mesSelecionado.mes, 0);

  const formatarData = (data) =>
    data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const [statusOrdem, setStatusOrdem] = useState(false);
  const [ordemSelecionada, setOrdemSelecionada] = useState("");
  const ordem = [
    "Mais recente",
    "Maior valor",
    "Menor valor",
    "Ultimos lançamentos",
  ];

  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickFora(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setStatusCategoria(false);
        setStatusTipo(false);
        setStatusOrdem(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  return (
    <div className="w-full py-5  flex flex-col gap-5 ">
      <div className="flex justify-between items-center">
        <span className="">
          <h1 className="font-semibold text-2xl">{titulo}</h1>
          <p className="text-xs text-gray-600">
            Gerencie e acompanhe seus gastos e pagamentos
          </p>
        </span>
        <button className="bg-blue-700 flex items-center gap-3 px-8 rounded-xl text-xs text-white font-semibold h-10 cursor-pointer hover:bg-blue-600"
          onClick={novo}
        >
          <Plus size={"10px"} /> {textoBotao}
        </button>
      </div>
      <div className="w-full  border border-gray-300 rounded-xl p-2 flex gap-5">
        <input
          type="search"
          name="buscaDebito"
          id="buscaDebito"
          placeholder="Buscar Debito"
          className="border focus:outline-none border-gray-300 p-2 text-xs bg-white rounded-lg flex-1"
        />
        <div className="relative">
          <div
            className="flex items-center justify-between gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs cursor-pointer min-w-40"
            onClick={() => setStatusCategoria(!statusCategoria)}
          >
            <span>{categoriaSelecionada || "Todas as categorias"}</span>
            <ChevronDown
              className={`size-3 transition-transform ${statusCategoria ? "rotete-180" : ""}`}
            />
          </div>
          {statusCategoria && (
            <div
              ref={menuRef}
              className="absolute top-10 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 flex flex-col gap-1 p-1 min-w-40"
            >
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoriaSelecionada(
                      cat === "Todas as categorias" ? "" : cat,
                    );
                    setStatusCategoria(false);
                  }}
                  className={`text-left px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors
            ${
              categoriaSelecionada === cat ||
              (cat === "Todas as categorias" && !categoriaSelecionada)
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <div
            className="flex items-center justify-between gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs cursor-pointer min-w-40"
            onClick={() => setStatusTipo(!statusTipo)}
          >
            <span>{tipoSelecionado || "Todos os tipos"}</span>
            <ChevronDown
              className={`size-3 transition-transform ${statusCategoria ? "rotete-180" : ""}`}
            />
          </div>
          {statusTipo && (
            <div
              ref={menuRef}
              className="absolute top-10 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 flex flex-col gap-1 p-1 min-w-40"
            >
              {tipos.map((tip) => (
                <button
                  key={tip}
                  onClick={() => {
                    setTipoSelecionado(tip === "Todos os tipos" ? "" : tip);
                    setStatusTipo(false);
                  }}
                  className={`text-left px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors
            ${
              categoriaSelecionada === tip ||
              (tip === "Todas as categorias" && !categoriaSelecionada)
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
                >
                  {tip}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500">
          <CalendarDays className="size-4 text-gray-400" />
          <span>
            {formatarData(primeiroDia)} - {formatarData(ultimoDia)}
          </span>
        </div>
        <div className="relative">
          <div
            className="flex items-center justify-between gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs cursor-pointer min-w-40"
            onClick={() => {
              setStatusOrdem(!statusOrdem);
            }}
          >
            <span>{ordemSelecionada || ordem[0]}</span>
            <ChevronDown
              className={`size-3 transition-transform ${statusCategoria ? "rotete-180" : ""}`}
            />
          </div>
          {statusOrdem && (
            <div
              ref={menuRef}
              className="absolute top-10 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 flex flex-col gap-1 p-1 min-w-40"
            >
              {ordem.map((ord) => (
                <button
                  key={ord}
                  onClick={() => {
                    setOrdemSelecionada(ord === ordem[0] ? "" : ord);
                    setStatusOrdem(false);
                  }}
                  className={`text-left px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors
            ${
              categoriaSelecionada === ord ||
              (ord === "Todas as categorias" && !categoriaSelecionada)
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
                >
                  {ord}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
