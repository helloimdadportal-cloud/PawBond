import React from 'react';

interface PawIconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const PawIcon: React.FC<PawIconProps> = ({
  className = 'w-5 h-5',
  color = 'currentColor'
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main pad */}
      <path d="M12 10.5C9.8 10.5 8 12.8 8 15.5C8 18.2 9.8 20.5 12 20.5C14.2 20.5 16 18.2 16 15.5C16 12.8 14.2 10.5 12 10.5Z" />
      {/* Left outer toe */}
      <ellipse cx="6.2" cy="10" rx="2.2" ry="3.2" transform="rotate(-20 6.2 10)" />
      {/* Left inner toe */}
      <ellipse cx="9.5" cy="6" rx="2.1" ry="3.3" transform="rotate(-8 9.5 6)" />
      {/* Right inner toe */}
      <ellipse cx="14.5" cy="6" rx="2.1" ry="3.3" transform="rotate(8 14.5 6)" />
      {/* Right outer toe */}
      <ellipse cx="17.8" cy="10" rx="2.2" ry="3.2" transform="rotate(20 17.8 10)" />
    </svg>
  );
};
