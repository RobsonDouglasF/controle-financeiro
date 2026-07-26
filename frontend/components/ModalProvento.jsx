import {
  CalendarDays,
  ChartPie,
  Check,
  CircleDollarSign,
  Copy
} from "lucide-react";

export default function ModalProvento({
  titulo,
  valores,
  onChange,
  onSubmit,
  onFechar
}) {
  if (!valores) return null;


 
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-2xl p-6 w-3xl flex flex-col gap-8 shadow-xl">
        <h2 className="font-bold text-xl text-gray-700 mb-3">{titulo}</h2>

        <div className="flex gap-5">
          <form className="flex w-full gap-5 text-xs px-2">
            <div className=" w-full flex flex-col gap-7">
              <span className="">
                <p className="font-semibold mb-2">Data</p>
                <input
                  value={valores?.registro?.slice(0, 10) || ""}
                  onChange={(e) => onChange("data", e.target.value)}
                  type="date"
                  name="data"
                  id="data"
                  className="w-full bg-white rounded shadow p-2 focus:outline-none"
                  readOnly
                />
              </span>
              <span>
                <p className="font-semibold mb-2">Categoria</p>
                <select
                  name="categoia"
                  id="categoria"
                  className="w-full bg-white rounded shadow p-2"
                  value={valores?.categoria || ""}
                  onChange={(e) => onChange("categoria", e.target.value)}
                >
                  <option value="">Selecione...</option>
                  <option value="Trabalho">Trabalho</option>
                  <option value="Extra">Extra</option>
                  <option value="Venda">Venda</option>
                  <option value="Emprestimo">Emprestimo</option>
                  <option value="Beneficios">Beneficios</option>
                  <option value="Outros">Outros</option>
                </select>
              </span>
              <span className="w-full">
                <p className="font-semibold mb-2">Tipo</p>
                <div className="flex gap-2">
                  <input
                    type="radio"
                    name="tipo"
                    id="fixo"
                    className=""
                    checked={valores?.tipo === "Fixo"}
                    onChange={() => onChange("tipo", "Fixo")}
                  />
                  <label htmlFor="fixo" className="mr-10">
                    Fixo
                  </label>
                  <input
                    type="radio"
                    name="tipo"
                    id="variavel"
                    checked={valores?.tipo === "Variavel"}
                    onChange={() => onChange("tipo", "Variavel")}
                  />
                  <label htmlFor="variavel">Variavel</label>
                </div>
              </span>
              <span>
                <p className="font-semibold mb-2">Nome</p>
                <input
                  type="text"
                  name="nome"
                  id="nome"
                  className="w-full bg-white rounded shadow p-2 focus:outline-none"
                  value={valores?.nome || ""}
                  onChange={(e) => onChange("nome", e.target.value)}
                />
              </span>
              <span>
                <p className="font-semibold mb-2">valor</p>
                <div className="flex relative items-center">
                  <p className="absolute bg-gray-100 p-2">R$</p>
                  <input
                    type="number"
                    name="valor"
                    id="valor"
                    className="w-full bg-white rounded shadow p-2 pl-10 focus:outline-none"
                    value={valores?.valor || ''}
                    onChange={(e) => onChange("valor", e.target.value)}
                  />
                </div>
              </span>
              <span>
                <p className="font-semibold mb-2">Frequencia</p>
                <select
                  name="frequencia"
                  id="frequencia"
                  className="w-full bg-white rounded shadow p-2"
                  value={valores?.frequencia || ""}
                  onChange={(e) => onChange("frequencia", e.target.value)}
                >
                  <option value="">Selecione...</option>
                  <option value="Mensal">Mensal</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Diario">Diario</option>
                  <option value="Quinzenal">Quinzenal</option>
                  <option value="Anual">Anual</option>                  
                  <option value="Unico">Unico</option>
                </select>
              </span>
            </div>
            
          </form>
          <div className="p-5 pr-10 w-110 bg-white rounded-2xl whitespace-nowrap flex flex-col gap-3 text-[11px] text-gray-500 shadow-xl">
            <h3 className="text-[12px] font-semibold text-black">
              Resumo do provento
            </h3>
            
            <div className="flex gap-3 items-center mb-2">
              <Check className="bg-purple-100 w-10 h-10 rounded-xl p-2" />
              <span className="flex flex-col gap-1">
                <h1 className="font-bold text-black text-[14px]">
                  {valores?.nome || "—"}
                </h1>
                <p className="text-purple-800 text-[10px] bg-blue-100 p-1 rounded text-center">
                  {valores?.categoria || "—"}
                </p>
              </span>
            </div>
            <span className="flex gap-2 items-center">
              <CalendarDays className="w-5" />
              <div>
                <h1 className="font-semibold">Data</h1>
                <p>{valores?.registro?.slice(0, 10) || "—"}</p>
              </div>
            </span>
            <span className="flex gap-2 items-center">
              <CircleDollarSign className="w-5" />
              <div>
                <h1 className="font-semibold">Valor</h1>
                <p>{valores?.valor ? `R$ ${valores.valor}` : "—"}</p>
              </div>
            </span>
            <span className="flex gap-2 items-center">
              <Copy className="w-5" />
              <div>
                <h1 className="font-semibold">Tipo</h1>
                <p>{valores?.tipo || "—"}</p>
              </div>
            </span>
            <span className="flex gap-2 items-center">
              <ChartPie className="w-5" />
              <div>
                <h1 className="font-semibold">Frequencia</h1>
                <p>
                 {valores?.frequencia || '—'}
                </p>
              </div>
            </span>
            
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onFechar}
            className="bg-white w-28 py-2 px-5 rounded cursor-pointer text-gray-700 text-xs shadow hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            className="bg-blue-700 w-30 py-2 px-5 rounded cursor-pointer text-gray-200 text-xs shadow hover:bg-blue-600"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
