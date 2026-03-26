function CalculatorDisplay({ expression, value }) {
  return (
    <section className="rounded-xl bg-panel-900 p-3 text-right text-white shadow-md">
      <p className="min-h-5 text-sm text-slate-300">{expression || '\u00A0'}</p>
      <p className="mt-1 break-all text-3xl font-bold tracking-tight">{value}</p>
    </section>
  );
}

export default CalculatorDisplay;
