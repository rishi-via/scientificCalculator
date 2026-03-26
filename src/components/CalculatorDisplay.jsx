function CalculatorDisplay({ expression, value }) {
  return (
    <section className="rounded-2xl bg-panel-900 p-4 text-right text-white shadow-md">
      <p className="min-h-6 text-sm text-slate-300">{expression || '\u00A0'}</p>
      <p className="mt-2 break-all text-4xl font-bold tracking-tight">{value}</p>
    </section>
  );
}

export default CalculatorDisplay;
