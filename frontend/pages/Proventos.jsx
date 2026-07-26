import { useEffect, useState } from "react";
import CentralNav from "../components/CentralNav";
import Dados from "../components/Dados";
import api from "../services/Api";
import CardResumo from "../components/CardResumo";
import ModalProvento from "../components/ModalProvento";

export default function PaginaProventos({ mesSelecionado }) {
  const [proventos, setProventos] = useState([]);
  const [resumoAtual, setResumoAtual] = useState({
    maiorCategoria: 0,
    totalProventos: 0,
    proventoFixo: 0,
    proventoVariavel: 0,
  });
  const [modalEditar, setModalEditar] = useState(null);

  useEffect(() => {
    const { mes, ano } = mesSelecionado;
    api
      .get(`/provento?mes=${mes}&ano=${ano}`)
      .then((res) => setProventos(res.data))
      .catch(() => alert("Erro ao buscar proventos"));
    api
      .get(`/resumo?mes=${mes}&ano=${ano}`)
      .then((res) => setResumoAtual(res.data))
      .catch(() => alert("Erro ao buscar resumo do mês atual"));
  }, [mesSelecionado]);

  const proventoFixo = () => {
    if (proventos.length === 0) return { fixo: 0, variavel: 0 };
    const agrupado = proventos.reduce((acc, item) => {
      acc[item.tipo] = (acc[item.tipo] || 0) + Number(item.valor);
      return acc;
    }, {});

    return {
      fixo: agrupado["Fixo"] || 0,
      variavel: agrupado["Variavel"] || 0,
    };
  };

  const qtdFixo = proventos.filter((item) => item.tipo === "Fixo").length;
  const qtdVariavel = proventos.filter(
    (item) => item.tipo === "Variavel",
  ).length;
  const tipos = proventoFixo();

  const maiorCategoria = () => {
    if (proventos.length === 0) return { nome: "Nenhuma", valor: 0 };

    const agrupado = proventos.reduce((acc, item) => {
      acc[item.categoria] = (acc[item.categoria] || 0) + Number(item.valor);
      return acc;
    }, {});

    const [nome, valor] = Object.entries(agrupado).sort(
      (a, b) => b[1] - a[1],
    )[0];
    return { nome, valor };
  };
  const top = maiorCategoria();

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);

  const excluirProvento = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir ?")) {
      try {
        await api.delete(`/provento/${id}`);
        setProventos(proventos.filter((item) => item.id !== id));
      } catch {
        alert("Erro ao excluir provento");
      }
    }
  };

  const salvarProvento = async (e) => {
    e.preventDefault();
    try {
      if (modalEditar.id) {
        await api.put(`/provento/${modalEditar.id}`, modalEditar);
      } else {
        await api.post(`/provento`, modalEditar);
      }
      setModalEditar(null);
      const { mes, ano } = mesSelecionado;
      api
        .get(`/provento?mes=${mes}&ano=${ano}`)
        .then((res) => setProventos(res.data));
    } catch {
      alert("Erro ao salvar provento");
    }
  };

  const novoProvento = () => {
    const hoje = new Date().toISOString().slice(0, 10);
    setModalEditar({
      nome: "",
      categoria: "",
      tipo: "Fixo",
      valor: "",
      frequencia: "",
      registro: hoje,
    });
  };

  return (
    <div className="px-5 w-full flex gap-5 py-5">
      <div className=" flex-1 ">
        <CentralNav
          mesSelecionado={mesSelecionado}
          titulo="Proventos"
          textoBotao="Novo Provento"
          novo={novoProvento}
        />
        <Dados
          titulos={[
            "Nome",
            "Categoria",
            "Tipo",
            "Frequencia",
            "Valor",
            "Ações",
          ]}
          lista={proventos}
          formatarMoeda={formatarMoeda}
          btnExcluir={(id) => excluirProvento(id)}
          btnEditar={(item) => setModalEditar(item)}
        />
        <ModalProvento
          titulo={modalEditar?.id ? "Editar Provento" : "Novo Provento"}
          mesSelecionado={mesSelecionado}
          valores={modalEditar}
          onSubmit={salvarProvento}
          onFechar={() => setModalEditar(null)}
          onChange={(campo, valor) =>
            setModalEditar({ ...modalEditar, [campo]: valor })
          }
        />
      </div>
      <div className="flex flex-col gap-1 w-85 ">
        <CardResumo
          p="Total do periodo"
          valor={formatarMoeda(resumoAtual.totalProventos)}
          p2={`${proventos.length} Proventos`}
        />
        <CardResumo
          p="Maior categoria"
          valor={formatarMoeda(top.valor)}
          p2={`Categoria ${top.nome}`}
        />
        <CardResumo
          p="Proventos fixos"
          valor={formatarMoeda(tipos.fixo)}
          p2={`${qtdFixo} Proventos`}
        />
        <CardResumo
          p="Proventos variaveis"
          valor={formatarMoeda(tipos.variavel)}
          p2={`${qtdVariavel} Proventos`}
        />
      </div>
    </div>
  );
}
