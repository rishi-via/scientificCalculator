import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Delete, Equal } from 'lucide-react';
import CalcButton from './components/CalcButton';
import ModeToggle from './components/ModeToggle';
import CalculatorDisplay from './components/CalculatorDisplay';

const BINARY_OPERATORS = new Set(['+', '-', '*', '/', '^']);

function formatResult(value) {
  if (!Number.isFinite(value)) {
    return 'Error';
  }
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return parseFloat(value.toPrecision(12)).toString();
}

function computeBinary(op, left, right) {
  if (op === '+') return left + right;
  if (op === '-') return left - right;
  if (op === '*') return left * right;
  if (op === '/') return right === 0 ? NaN : left / right;
  if (op === '^') return Math.pow(left, right);
  return right;
}

function toRadians(value, mode) {
  return mode === 'DEG' ? (value * Math.PI) / 180 : value;
}

function fromRadians(value, mode) {
  return mode === 'DEG' ? (value * 180) / Math.PI : value;
}

function App() {
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState(null);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [awaitingNextValue, setAwaitingNextValue] = useState(false);
  const [angleMode, setAngleMode] = useState('DEG');

  const currentValue = useMemo(() => {
    const parsed = Number.parseFloat(display);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [display]);

  const expression = useMemo(() => {
    if (storedValue === null || !pendingOperator) return '';
    const symbol = pendingOperator === '*' ? '×' : pendingOperator === '/' ? '÷' : pendingOperator;
    return `${formatResult(storedValue)} ${symbol}`;
  }, [storedValue, pendingOperator]);

  const setSafeDisplay = (value) => {
    const formatted = formatResult(value);
    if (formatted === 'Error') {
      setDisplay('Error');
      setStoredValue(null);
      setPendingOperator(null);
      setAwaitingNextValue(true);
      return;
    }
    setDisplay(formatted);
  };

  const inputDigit = (digit) => {
    if (display === 'Error' || awaitingNextValue) {
      setDisplay(digit);
      setAwaitingNextValue(false);
      return;
    }
    setDisplay((prev) => (prev === '0' ? digit : prev + digit));
  };

  const inputDecimal = () => {
    if (display === 'Error' || awaitingNextValue) {
      setDisplay('0.');
      setAwaitingNextValue(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay((prev) => `${prev}.`);
    }
  };

  const inputDoubleZero = () => {
    if (display === 'Error' || awaitingNextValue) {
      setDisplay('0');
      setAwaitingNextValue(false);
      return;
    }
    if (display !== '0') {
      setDisplay((prev) => `${prev}00`);
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setStoredValue(null);
    setPendingOperator(null);
    setAwaitingNextValue(false);
  };

  const deleteDigit = () => {
    if (display === 'Error' || awaitingNextValue) {
      setDisplay('0');
      setAwaitingNextValue(false);
      return;
    }
    setDisplay((prev) => {
      if (prev.length <= 1 || (prev.length === 2 && prev.startsWith('-'))) return '0';
      return prev.slice(0, -1);
    });
  };

  const toggleSign = () => {
    if (display === 'Error') return;
    if (display === '0') return;
    setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : `-${prev}`));
  };

  const selectOperator = (op) => {
    if (!BINARY_OPERATORS.has(op)) return;
    if (display === 'Error') return;

    if (storedValue === null) {
      setStoredValue(currentValue);
      setPendingOperator(op);
      setAwaitingNextValue(true);
      return;
    }

    if (pendingOperator && !awaitingNextValue) {
      const next = computeBinary(pendingOperator, storedValue, currentValue);
      const formatted = formatResult(next);
      if (formatted === 'Error') {
        setDisplay('Error');
        setStoredValue(null);
        setPendingOperator(null);
        setAwaitingNextValue(true);
        return;
      }
      setDisplay(formatted);
      setStoredValue(next);
      setPendingOperator(op);
      setAwaitingNextValue(true);
      return;
    }

    setPendingOperator(op);
  };

  const evaluate = () => {
    if (!pendingOperator || storedValue === null || display === 'Error') return;
    const result = computeBinary(pendingOperator, storedValue, currentValue);
    setSafeDisplay(result);
    setStoredValue(null);
    setPendingOperator(null);
    setAwaitingNextValue(true);
  };

  const applyUnary = (fn) => {
    if (display === 'Error') return;
    const result = fn(currentValue);
    setSafeDisplay(result);
    setAwaitingNextValue(true);
  };

  const setConstant = (value) => {
    setDisplay(formatResult(value));
    setAwaitingNextValue(false);
  };

  const scientificButtons = [
    { label: 'sin', variant: 'function', action: () => applyUnary((v) => Math.sin(toRadians(v, angleMode))) },
    { label: 'cos', variant: 'function', action: () => applyUnary((v) => Math.cos(toRadians(v, angleMode))) },
    {
      label: 'tan',
      variant: 'function',
      action: () =>
        applyUnary((v) => {
          const radians = toRadians(v, angleMode);
          const cosine = Math.cos(radians);
          if (Math.abs(cosine) < 1e-12) return NaN;
          return Math.tan(radians);
        }),
    },
    { label: 'xʸ', variant: 'operator', action: () => selectOperator('^') },
    { label: '√x', variant: 'function', action: () => applyUnary((v) => (v < 0 ? NaN : Math.sqrt(v))) },
    {
      label: 'sin⁻¹',
      variant: 'function',
      action: () => applyUnary((v) => (v < -1 || v > 1 ? NaN : fromRadians(Math.asin(v), angleMode))),
    },
    {
      label: 'cos⁻¹',
      variant: 'function',
      action: () => applyUnary((v) => (v < -1 || v > 1 ? NaN : fromRadians(Math.acos(v), angleMode))),
    },
    { label: 'tan⁻¹', variant: 'function', action: () => applyUnary((v) => fromRadians(Math.atan(v), angleMode)) },
    { label: '∛x', variant: 'function', action: () => applyUnary((v) => Math.cbrt(v)) },
    { label: 'eˣ', variant: 'function', action: () => applyUnary((v) => Math.exp(v)) },
    { label: 'log', variant: 'function', action: () => applyUnary((v) => (v <= 0 ? NaN : Math.log10(v))) },
    { label: 'ln', variant: 'function', action: () => applyUnary((v) => (v <= 0 ? NaN : Math.log(v))) },
    { label: 'x²', variant: 'function', action: () => applyUnary((v) => v * v) },
    { label: '1/x', variant: 'function', action: () => applyUnary((v) => (v === 0 ? NaN : 1 / v)) },
    { label: '±', variant: 'function', action: toggleSign },
  ];

  const controlButtons = [
    { label: 'C', variant: 'danger', action: clearAll },
    { label: <Delete className="mx-auto h-5 w-5" />, ariaLabel: 'Delete', variant: 'function', action: deleteDigit },
    { label: '%', variant: 'function', action: () => applyUnary((v) => v / 100) },
    { label: '÷', variant: 'operator', action: () => selectOperator('/') },
    { label: '×', variant: 'operator', action: () => selectOperator('*') },
    { label: '7', variant: 'number', action: () => inputDigit('7') },
    { label: '8', variant: 'number', action: () => inputDigit('8') },
    { label: '9', variant: 'number', action: () => inputDigit('9') },
    { label: '-', variant: 'operator', action: () => selectOperator('-') },
    { label: '+', variant: 'operator', action: () => selectOperator('+') },
    { label: '4', variant: 'number', action: () => inputDigit('4') },
    { label: '5', variant: 'number', action: () => inputDigit('5') },
    { label: '6', variant: 'number', action: () => inputDigit('6') },
    { label: 'π', variant: 'function', action: () => setConstant(Math.PI) },
    { label: 'e', variant: 'function', action: () => setConstant(Math.E) },
    { label: '1', variant: 'number', action: () => inputDigit('1') },
    { label: '2', variant: 'number', action: () => inputDigit('2') },
    { label: '3', variant: 'number', action: () => inputDigit('3') },
    { label: '.', variant: 'number', action: inputDecimal },
    {
      label: <Equal className="mx-auto h-5 w-5" />,
      ariaLabel: 'Equals',
      variant: 'equal',
      action: evaluate,
    },
    { label: '0', variant: 'number', span: 2, action: () => inputDigit('0') },
    { label: '00', variant: 'number', action: inputDoubleZero },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-calc-50 via-white to-spark-100 px-4 py-6 font-sans text-panel-900">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-md space-y-4 rounded-3xl bg-panel-100 p-4 shadow-lg"
      >
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-calc-600 shadow-sm">
            <FlaskConical className="h-4 w-4" />
            Scientific Calculator
          </div>
          <p className="text-base text-slate-600">Mobile-first calculator with trig, inverse trig, logs, powers, and roots.</p>
        </header>

        <ModeToggle mode={angleMode} onChange={setAngleMode} />

        <CalculatorDisplay expression={expression} value={display} />

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Scientific Functions</h2>
          <div className="grid grid-cols-5 gap-2">
            {scientificButtons.map((button) => (
              <CalcButton
                key={button.label}
                label={button.label}
                onClick={button.action}
                variant={button.variant}
                ariaLabel={button.ariaLabel}
                span={button.span}
              />
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Numbers & Operators</h2>
          <div className="grid grid-cols-5 gap-2">
            {controlButtons.map((button, index) => (
              <CalcButton
                key={`${index}-${button.ariaLabel || button.label}`}
                label={button.label}
                onClick={button.action}
                variant={button.variant}
                ariaLabel={button.ariaLabel}
                span={button.span}
              />
            ))}
          </div>
        </section>
      </motion.section>
    </main>
  );
}

export default App;
