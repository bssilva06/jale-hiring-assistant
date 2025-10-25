import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-secondary text-white shadow-md hover:shadow-lg',
    secondary: 'bg-secondary hover:bg-primary text-white shadow-md hover:shadow-lg',
    success: 'bg-success hover:bg-green-600 text-white shadow-md hover:shadow-lg',
    danger: 'bg-danger hover:bg-red-600 text-white shadow-md hover:shadow-lg',
    outline: 'border-3 border-primary text-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-md',
  };
  
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
