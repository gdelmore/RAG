// src/components/common/Card.jsx
import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
