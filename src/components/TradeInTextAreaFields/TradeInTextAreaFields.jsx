import React from "react";
import { useSelector } from "react-redux";
import { getEdgeClass } from "../../utils";

const TradeInTextAreaFields = ({
  setFieldValue,
  values,
  fieldName,
  labelName,
  placeHolderText,
}) => {
  const { edge } = useSelector((state) => state.uiConfig);
  return (
    <div className="w-full mt-4">
      <label
        className="flex items-center gap-2 mb-4  text-[var(--text-black-white)] font-medium"
        htmlFor={fieldName}
      >
        {labelName}
      </label>
      <div className="flex-auto">
        <textarea
          className={`border border-[#CCCCCC] p-3 text-[var(--davy-gray-color)] w-full text-sm ${getEdgeClass(edge)} min-h-[8rem] bg-[var(--white-smoke-color)]`}
          name={fieldName}
          id={fieldName}
          placeholder={placeHolderText}
          value={values[`${fieldName}`]}
          onChange={(e) => setFieldValue(fieldName, e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

export default TradeInTextAreaFields;
