import React from "react";

const StyledHeadingBox = ({ header, className }) => {
  return (
    <div className={`${className} flex items-center space-x-4 pb-4 mt-6 `}>
      <div className="border-t border-[var(--primary-dark-color)] flex-grow"></div>
      <div className="text-xl text-[var(--primary-dark-color)]">{header}</div>
      <div className="border-t border-[var(--primary-dark-color)] flex-grow"></div>
    </div>
  );
};

export default StyledHeadingBox;
