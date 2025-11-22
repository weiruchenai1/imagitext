import React from 'react';

interface BadgeProps {
  text: string;
  colorClass: string;
}

export const Badge: React.FC<BadgeProps> = ({ text, colorClass }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {text}
    </span>
  );
};
