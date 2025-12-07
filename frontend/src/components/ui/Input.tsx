import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'date';
}

const Input = ({ variant = 'default', className = '', ...props }: InputProps) => {
  const baseClasses =
    'border border-primary-300 dark:border-dark-border-primary dark:bg-dark-bg-tertiary dark:text-dark-text-primary rounded-lg focus:ring-2 focus:ring-accent-600 dark:focus:ring-dark-accent-primary focus:border-transparent';

  const variantClasses = {
    default: 'px-4 py-2',
    date: 'px-4 py-2',
  };

  return (
    <input
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
};

export default Input;
