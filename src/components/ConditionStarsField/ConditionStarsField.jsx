import React, { useState } from "react";
import { generateFixedNumbersForTradeInPopup } from "../../utils";
import { useTranslation } from "react-i18next";
import Tooltip from "../common-components/Tooltip";
import SVGSelector from "../common-components/SVGSelector";

const ConditionStarsField = ({ setFieldValue, errors }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [starItems] = useState(generateFixedNumbersForTradeInPopup(5));
  const { t } = useTranslation();

  return (
    <>
      <label className="flex items-center mb-4">
        {t("/vehicleDetails.Condition")}&nbsp;
        <span className="text-red-700 pr-2">*</span>
        <Tooltip
          text={t(
            "/vehicleDetails.Rate your vehicle from one (heavy signs of wear) to five (like new) stars. The choice of stars has no influence on the preliminary rating and is merely information for the car dealership.",
          )}
          spanClassName={
            "translate-x-[-5rem] max-sm:translate-x-[-5rem] max-sm:max-w-[16rem] max-w-[18rem]"
          }
        >
          <SVGSelector name="i-svg" />
        </Tooltip>
      </label>
      <div className="flex items-center gap-3">
        {starItems.map((star) => (
          <SVGSelector
            name={"fillable-stars-svg"}
            key={star}
            className={`text-[${errors?.condition ? "#FF0000" : "#555555"}] hover:fill-green-500 ${
              errors?.condition ? "text-red-700 :text-green-500" : ""
            } ${
              star <= (hover || rating) ? "fill-green-500 text-[#48bb78]" : ""
            }`}
            onClick={() => {
              setRating(star);
              setFieldValue("condition", star);
            }}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          />
        ))}
      </div>
    </>
  );
};

export default ConditionStarsField;
