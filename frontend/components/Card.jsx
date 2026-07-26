export default function Card({
  img,
  p,
  valor,
  p2,
  corValor,
  bg,
  corP2,
  cssImg,
}) {
  return (
    <div
      className={`flex gap-2 ${bg} max-w-50 p-3 rounded-2xl shadow-lg border-3 border-white/50 `}
    >
      <div className={`border-3 border-white/70 h-fit p-2 rounded-2xl shadow-lg ${cssImg}`}>
        {img}
      </div>
      <div className="">
        <p className="text-xs">{p}</p>
        <h1 className={`${corValor} mb-8`}>{valor}</h1>
        <p className={`text-[8px] ${corP2}`}>{p2}</p>
      </div>
    </div>
  );
}
