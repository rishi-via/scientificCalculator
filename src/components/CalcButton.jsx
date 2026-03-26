import clsx from 'clsx';
import { motion } from 'framer-motion';

function CalcButton({ label, onClick, variant = 'number', className = '', ariaLabel, span = 1 }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || label}
      className={clsx(
        'min-h-[44px] min-w-[44px] rounded-xl px-2 text-base font-semibold shadow-sm transition-all duration-200 active:brightness-95',
        variant === 'number' && 'bg-white text-panel-900',
        variant === 'operator' && 'bg-calc-500 text-white',
        variant === 'function' && 'bg-calc-100 text-calc-800',
        variant === 'danger' && 'bg-rose-100 text-rose-700',
        variant === 'equal' && 'bg-spark-500 text-white',
        className
      )}
      style={{ gridColumn: `span ${span} / span ${span}` }}
    >
      {label}
    </motion.button>
  );
}

export default CalcButton;
