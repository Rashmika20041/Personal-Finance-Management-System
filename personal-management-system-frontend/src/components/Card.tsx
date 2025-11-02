import React from 'react';

interface CardProps {
  title: string;
  value: string;
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, value, children, className }) => {
  return (
    <div className={`bg-secondary p-6 rounded-lg shadow-lg ${className}`}>
      <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
      <p className="text-3xl font-bold text-text-primary mt-2">{value}</p>
      {children}
    </div>
  );
};

export default Card;