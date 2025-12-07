import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const Card = ({ children, className = '', padding = 'lg' }: CardProps) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`bg-primary-50 dark:bg-dark-bg-secondary rounded-2xl shadow-md border border-primary-200 dark:border-dark-border-primary ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
