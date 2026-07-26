import { CalendarDays } from "lucide-react";

export default function CardList({ titulo, listaCard = [] }) {
  return (
    <div className="bg-blue-50/40 shadow-lg rounded-2xl border-3 border-white/70 ">
      <div className="p-3  rounded-2xl flex justify-between  items-center gap-20">
        <div className="flex gap-3  items-center  ">
          <div className="border border-white/70 bg-blue-200/40 p-2 rounded-lg">
            <CalendarDays className="size-5" />
          </div>
          <h2 className="text-sm font-bold ">{titulo}</h2>
        </div>
        <p className="cursor-pointer text-indigo-700 text-xs   hover:text-indigo-500">
          Ver todos
        </p>
      </div>
      <div>
        <div className="mx-5 py-2">
          {listaCard.map((item, index) => (
            <div className="flex justify-between p-1 py-2 border-b border-gray-300" key={index}>
              <div className="flex-col flex ">
                <span className="text-[12px]">{item.nome}</span>
                <span className="text-[10px] text-gray-500">{item.tipo || `N. de Parcelas: ${item.parcela || 0}`}</span>
              </div>
              <span className="text-green-600 font-bold text-[13px]">{Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
