import React, { useState, useEffect, memo } from "react";
import { Range } from "react-range";
import { v4 as uuidv4 } from "uuid";
import { convertNumberFormat, handleCheckboxChange } from "../../utils";
import { useSearchParams } from "react-router-dom";

const MultiRangeSlider = ({
  id,
  name,
  className,
  range,
  minSelectorName,
  maxSelectorName,
  existingMin,
  existingMax,
  currency,
  ...rest
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [thumb, setThumb] = useState(false);
  const { maxs = [], mins = [] } = range || {};
  const minIndex = 0;
  const maxIndex = Math?.max(maxs?.length - 1, 1);
  const [values, setValues] = useState([
    mins[0] ?? maxs[0],
    maxs[maxIndex] ?? 0,
  ]);

  useEffect(() => {
    if (existingMin && existingMin?.length) {
      setValues((prev) => [Number(existingMin?.[0]), prev[1]]);
    }
    if (existingMax && existingMax?.length) {
      setValues((prev) => [prev[0], Number(existingMax?.[0])]);
    }
  }, [existingMin, existingMax]);

  const handleRangeChange = (range) => {
    const newValues = range?.map((index) => maxs?.[index]);
    setValues(newValues);
    handleCheckboxChange(
      {
        target: {
          value: newValues[thumb],
          checked: true,
        },
      },
      searchParams,
      thumb === 0 ? minSelectorName : maxSelectorName,
      setSearchParams,
      { singleParam: true },
    );
  };

  return (
    <Range
      id={id}
      key={`${existingMin}-${existingMax}`}
      name={name}
      className={className}
      step={1}
      min={minIndex}
      max={maxIndex}
      values={values?.map((value) =>
        maxs?.indexOf(value) !== -1 ? maxs?.indexOf(value) : minIndex,
      )}
      onChange={(range) => setValues(range?.map((index) => maxs?.[index]))}
      onFinalChange={handleRangeChange}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          key={uuidv4()}
          style={{
            ...props.style,
            border: "1px solid var(--davy-gray-color)",
            width: "100%",
            position: "relative",
          }}
        >
          {children}
        </div>
      )}
      renderThumb={({ props, index }) => (
        <div
          {...props}
          key={uuidv4()}
          style={{
            ...props.style,
            height: "20px",
            width: "20px",
            borderRadius: "50%",
            border: "1px solid var(--davy-gray-color)",
            backgroundColor: "var(--secondary-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseDown={() => setThumb(index)}
          onTouchStart={() => setThumb(index)}
        >
          <div
            style={{
              position: "absolute",
              top: "-25px",
              color: "var(--text-black-white)",
              background: "var(--white-color)",
              padding: "2px 5px",
              borderRadius: "4px",
              fontSize: "12px",
              boxShadow: "0 0 2px rgba(0, 0, 0, 0.6)",
            }}
          >
            {convertNumberFormat(values[index], currency)}
          </div>
        </div>
      )}
      {...rest}
    />
  );
};

export default memo(MultiRangeSlider);
