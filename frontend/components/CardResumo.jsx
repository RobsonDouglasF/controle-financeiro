export default function CardResumo({
  img1,
  img2,
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
      className={`flex items-center justify-between ${bg}  p-3 rounded-2xl shadow-lg border-3 border-white/50 h-fit`}
    >
      <div className="flex gap-2 items-center">
        <div
          className={`border-3 border-white/70 h-fit p-2 rounded-2xl shadow-lg ${cssImg}`}
        >
          {img1}
        </div>
        <div className="">
          <p className="text-xs">{p}</p>
          <h1 className={`${corValor}`}>{valor}</h1>
          <p className={`text-[8px] ${corP2}`}>{p2}</p>
        </div>
      </div>
      <div
        className={`border-3 border-white/70 h-fit p-2 rounded-2xl shadow-lg ${cssImg}`}
      >
        {img2}
      </div>
    </div>
  );
}
