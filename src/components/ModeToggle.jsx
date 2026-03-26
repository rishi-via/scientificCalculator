import clsx from 'clsx';

function ModeToggle({ mode, onChange }) {
  const options = ['DEG', 'RAD'];

  return (
    <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-calc-100 p-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={clsx(
            'min-h-[44px] rounded-lg px-4 text-base font-semibold transition-all',
            mode === option ? 'bg-white text-calc-600 shadow-sm' : 'text-calc-800'
          )}
          aria-label={`Switch to ${option} mode`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default ModeToggle;
