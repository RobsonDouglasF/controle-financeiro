export default function Dados({ titulos, lista, formatarMoeda, btnExcluir, btnEditar }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-xs">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {titulos.map((t, i) => (
              <th key={i} className="text-left px-4 py-3 text-gray-500 font-semibold">{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lista.length === 0 ? (
            <tr>
              <td colSpan={titulos.length} className="text-center py-10 text-gray-400">
                Nenhum débito encontrado
              </td>
            </tr>
          ) : (
            lista.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-700">{item.nome}</td>
                <td className="px-4 py-3 text-gray-500">{item.categoria}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${item.tipo === "Fixo" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"}`}>
                    {item.tipo}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{item.parcela || item.frequencia || "—"}</td>
                <td className="px-4 py-3 font-bold text-red-500">{formatarMoeda(item.valor)}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => btnEditar(item)} className="text-indigo-500 hover:text-indigo-700 cursor-pointer">Editar</button>
                  <button onClick={() => btnExcluir(item.id)} className="text-red-400 hover:text-red-600 cursor-pointer">Excluir</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}