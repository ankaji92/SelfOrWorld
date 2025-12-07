import { ReactNode } from 'react';

interface HintProps {
  children: ReactNode;
  variant?: 'emerald' | 'amber';
}

const Hint = ({ children, variant = 'emerald' }: HintProps) => {
  const variantClasses = {
    emerald: 'bg-accent-50 dark:bg-dark-accent-secondary/20 border-accent-200 dark:border-dark-accent-secondary text-accent-900 dark:text-dark-accent-primary',
    amber: 'bg-highlight-50 dark:bg-dark-accent-glow/20 border-highlight-200 dark:border-dark-accent-glow text-primary-800 dark:text-dark-accent-glow',
  };

  return (
    <div className={`p-4 rounded-lg border ${variantClasses[variant]}`}>
      {children}
    </div>
  );
};

export default Hint;
