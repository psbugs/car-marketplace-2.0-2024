import React from "react";
import { getIFrameUrl } from "../../utils";

const RenaultOrBank11FinancingCalculator = ({
  vehicleDetails,
  financialCalculatorSettings,
}) => {
  return (
    <div
      className={`bg-white ${financialCalculatorSettings?.[0]?.calculator === "Bank11" ? "min-h-[1000px]" : "min-h-[500px]"}`}
    >
      <iframe
        name={`${financialCalculatorSettings?.calculator?.toLowerCase()}Calculator`}
        id={`${financialCalculatorSettings?.calculator?.toLowerCase()}Calculator`}
        title={`${financialCalculatorSettings?.calculator?.toLowerCase()}Calculator`}
        src={getIFrameUrl(vehicleDetails, financialCalculatorSettings)}
        className={`w-full ${financialCalculatorSettings?.[0]?.calculator === "Bank11" ? "min-h-[1000px]" : "min-h-[500px]"}`}
      ></iframe>
    </div>
  );
};

export default RenaultOrBank11FinancingCalculator;
