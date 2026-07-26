import CentralNav from "../components/CentralNav";
import CardResumo from "../components/CardResumo";
import { useEffect, useState } from "react";
import api from "../services/Api";
import Dados from "../components/Dados";
import ModalDebito from "../components/ModalDebito";

export default function PaginaDebito({ mesSelecionado }) {
  const [resumoAtual, setResumoAtual] = useState({
    maiorCategoria: 0,
    totalDebitos: 0,
    debitoFixo: 0,
    debitoVariavel: 0,
  });
  const formatarMoeda = (valor) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);

  const [debitos, setDebitos] = useState([]);
  const [modalEditar, setModalEditar] = useState(null);

  useEffect(() => {
    const { mes, ano } = mesSelecionado;
    api
      .get(`/debito?mes=${mes}&ano=${ano}`)
      .then((res) => setDebitos(res.data))
      .catch(() => alert("Erro ao buscar débitos"));
    api
      .get(`/resumo?mes=${mes}&ano=${ano}`)
      .then((res) => setResumoAtual(res.data))
      .catch(() => alert("Erro ao buscar resumo do mês atual"));
  }, [mesSelecionado]);

  const excluirDebito = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir ?")) {
      try {
        await api.delete(`/debito/${id}`);
        setDebitos(debitos.filter((item) => item.id !== id));
      } catch {
        alert("Erro ao excluir débito");
      }
    }
  };
  const salvarDebito = async (e) => {
    e.preventDefault();
    try {
      if (modalEditar.id) {
       
        await api.put(`/debito/${modalEditar.id}`, modalEditar);
      } else {
        
        await api.post(`/debito`, modalEditar);
      }
      setModalEditar(null);
      const { mes, ano } = mesSelecionado;
      api
        .get(`/debito?mes=${mes}&ano=${ano}`)
        .then((res) => setDebitos(res.data));
    } catch {
      alert("Erro ao salvar débito");
    }
  };

const novoDebito = () => {
  setModalEditar({
    nome: "",
    categoria: "",
    tipo: "Fixo",
    valor: "",
    parcela: "",
    parcelado: false,
  });
};

  const maiorCategoria = () => {
    if (debitos.length === 0) return { nome: "Nenhuma", valor: 0 };

    const agrupado = debitos.reduce((acc, item) => {
      acc[item.categoria] = (acc[item.categoria] || 0) + Number(item.valor);
      return acc;
    }, {});

    const [nome, valor] = Object.entries(agrupado).sort(
      (a, b) => b[1] - a[1],
    )[0];
    return { nome, valor };
  };
  const top = maiorCategoria();

  const debitoFixo = () => {
    if (debitos.length === 0) return { fixo: 0, variavel: 0 };
    const agrupado = debitos.reduce((acc, item) => {
      acc[item.tipo] = (acc[item.tipo] || 0) + Number(item.valor);
      return acc;
    }, {});

    return {
      fixo: agrupado["Fixo"] || 0,
      variavel: agrupado["Variavel"] || 0,
    };
  };
  const qtdFixo = debitos.filter((item) => item.tipo === "Fixo").length;
  const qtdVariavel = debitos.filter((item) => item.tipo === "Variavel").length;
  const tipos = debitoFixo();

  

  return (
    <div className=" px-5 w-full flex gap-5 py-5">
      <div className=" flex-1 ">
        <CentralNav mesSelecionado={mesSelecionado} novo={novoDebito} titulo='Debitos' textoBotao='Novo Debito'/>
        <Dados
          titulos={["Nome", "Categoria", "Tipo", "Parcela", "Valor", "Ações"]}
          lista={debitos}
          formatarMoeda={formatarMoeda}
          btnExcluir={(id) => excluirDebito(id)}
          btnEditar={(item) => setModalEditar(item)}
        />

        <ModalDebito
          titulo={modalEditar?.id ? "Editar Débito" : "Novo Débito"}
          mesSelecionado={mesSelecionado}
          valores={modalEditar}
          onSubmit={salvarDebito}
          onFechar={() => setModalEditar(null)}
          onChange={(campo, valor) =>
            setModalEditar({ ...modalEditar, [campo]: valor })
          }
        />
      </div>
      <div className="flex flex-col gap-1 w-85 ">
        <CardResumo
          p="Total do periodo"
          valor={formatarMoeda(resumoAtual.totalDebitos)}
          p2={`${debitos.length} Debitos`}
        />
        <CardResumo
          p="Maior categoria"
          valor={formatarMoeda(top.valor)}
          p2={`Categoria ${top.nome}`}
        />
        <CardResumo
          p="Debitos fixos"
          valor={formatarMoeda(tipos.fixo)}
          p2={`${qtdFixo} Debitos`}
        />
        <CardResumo
          p="Debitos variaveis"
          valor={formatarMoeda(tipos.variavel)}
          p2={`${qtdVariavel} Debitos`}
        />
      </div>
    </div>
  );
}
