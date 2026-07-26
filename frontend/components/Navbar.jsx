import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ChartLine,
  ChartNoAxesColumn,
  ChevronDown,
  ClipboardPenLine,
  Cog,
  CreditCard,
  House,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar({ mesSelecionado, setMesSelecionado }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickFora(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const deslogar = () => {
    logout();
    navigate("/login");
  };

  const ativo = (rota) =>
    location.pathname === rota
      ? "bg-blue-100 text-blue-400 border border-gray-300 shadow-2xl"
      : "text-gray-500 hover:bg-gray-100";

  const gerarMeses = () => {
    const nomeMeses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ];
    const hoje = new Date();
    const meses = [];
    for (let i = 11; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      meses.push({
        label: `${nomeMeses[data.getMonth()]} ${data.getFullYear()}`,
        mes: data.getMonth() + 1,
        ano: data.getFullYear(),
      });
    }
    return meses;
  };

  const meses = gerarMeses();

  const handleChange = (e) => {
    const [mes, ano] = e.target.value.split("/");
    setMesSelecionado({ mes: Number(mes), ano: Number(ano) });
  };

  return (
    <div className="pt-2 px-2 w-full">
      <header className="flex bg-[#F8F9FF] gap-5 items-center shadow-sm justify-between px-3 py-2 rounded-2xl">
        <span className="flex gap-2 items-center">
          <ClipboardPenLine />
          <h1>Controle Financeiro</h1>
        </span>

        <div className="flex rounded-xl font-medium text-xs transition-all gap-3">
          <div onClick={() => navigate("/dashboard")} className={`${ativo("/dashboard")} flex items-center px-4 rounded-xl font-medium transition-all cursor-pointer`}>
            <House />
            <button className="rounded-2xl p-3 font-bold">Dashboard</button>
          </div>
          <div onClick={() => navigate("/debitos")} className={`${ativo("/debitos")} flex items-center px-4 rounded-xl font-medium transition-all cursor-pointer`}>
            <CreditCard />
            <button className="rounded-2xl p-3">Debitos</button>
          </div>
          <div onClick={() => navigate("/proventos")} className={`${ativo("/proventos")} flex items-center px-4 rounded-xl font-medium transition-all cursor-pointer`}>
            <ChartLine />
            <button className="rounded-2xl p-3">Proventos</button>
          </div>
          <div onClick={() => navigate("/relatorio")} className={`${ativo("/relatorio")} flex items-center px-4 rounded-xl font-medium transition-all cursor-pointer`}>
            <ChartNoAxesColumn />
            <button className="rounded-2xl p-3">Relatorio</button>
          </div>
          <div onClick={() => navigate("/configuracao")} className={`${ativo("/configuracao")} flex items-center px-4 rounded-xl font-medium transition-all cursor-pointer`}>
            <Cog />
            <button className="rounded-2xl p-3">Configuração</button>
          </div>
        </div>

        <div className="flex gap-5 items-center">
          <select
            value={`${mesSelecionado.mes}/${mesSelecionado.ano}`}
            onChange={handleChange}
            className="bg-white/60 border border-white/60 text-[#5A6080] text-xs px-4 py-2 rounded-xl focus:outline-none"
          >
            {meses.map((m) => (
              <option key={`${m.mes}/${m.ano}`} value={`${m.mes}/${m.ano}`}>
                {m.label}
              </option>
            ))}
          </select>

       
          <div className="relative" ref={menuRef}>
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setMenuAberto(!menuAberto)}
            >
              <User className="rounded-md border w-8 h-8 p-2 border-gray-300" />
              <span className="text-xs text-gray-600">{user?.nome}</span>
              <ChevronDown className={`size-4 transition-transform duration-200 ${menuAberto ? "rotate-180" : ""}`} />
            </div>

            {menuAberto && (
              <div className="absolute right-0 top-11 bg-white rounded-xl shadow-lg border border-gray-100 w-48 z-50 flex flex-col py-1">
                <button
                  onClick={() => { navigate("/configuracao"); setMenuAberto(false); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  <Settings className="size-4" />
                  Configurações
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={deslogar}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="size-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}