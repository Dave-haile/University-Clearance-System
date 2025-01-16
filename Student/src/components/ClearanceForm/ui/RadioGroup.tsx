import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ label, error, options, name, onChange, value, className, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx('w-full', className)} {...props}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);