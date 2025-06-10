import React from 'react';

const CustomCard = ({ className, children }) => {
  return (
    <div className={className}>
      <div className="bg-[#B57FEC80] rounded-full px-[5px] py-1 flex items-center justify-center shadow-md backdrop-blur-md whitespace-nowrap">
        <div className="text-white text-xs">{children}</div>
      </div>
    </div>
  );
};

export default CustomCard;
