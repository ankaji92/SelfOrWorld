import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) => {
  const baseClasses = 'font-medium rounded-lg transition-colors';

  const variantClasses = {
    primary: 'bg-accent-700 dark:bg-dark-accent-primary text-primary-50 dark:text-dark-bg-primary hover:bg-accent-800 dark:hover:bg-dark-accent-secondary',
    secondary: 'bg-primary-100 dark:bg-dark-bg-tertiary text-primary-700 dark:text-dark-text-primary hover:bg-primary-200 dark:hover:bg-dark-border-secondary',
    ghost: 'text-primary-700 dark:text-dark-text-primary hover:bg-primary-100 dark:hover:bg-dark-bg-tertiary',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
