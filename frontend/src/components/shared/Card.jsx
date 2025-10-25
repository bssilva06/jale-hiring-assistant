import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  onClick = null,
  hoverable = false 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md p-6 transition-shadow';
  const hoverClasses = hoverable || onClick ? 'hover:shadow-lg cursor-pointer' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
