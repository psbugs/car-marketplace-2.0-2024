import React from "react";
import { useSelector } from "react-redux";
import { getEdgeClass } from "../../../utils";

const Tooltip = ({ text, children, className, spanClassName }) => {
  const { edge } = useSelector((state) => state.uiConfig);
  return (
    <div className={`relative group inline-block ${className && className}`}>
      {children}
      <span
        className={` ${
          spanClassName && spanClassName
        } absolute left-1/2 transform -translate-x-2/3 mb-2 hidden group-hover:block 
      w-max bg-gray-800 text-white text-sm ${getEdgeClass(edge, "rounded")} py-1 px-2 shadow-lg z-50`}
      >
        {text}
      </span>
    </div>
  );
};

export default Tooltip;
