import React from "react";
import { useTranslation } from "react-i18next";
import TradeInTextAreaFields from "../TradeInTextAreaFields/TradeInTextAreaFields";
import { getEdgeClass } from "../../utils";
import { useSelector } from "react-redux";

const VehicleDefectWithDescriptionField = ({
  setFieldValue,
  values,
  errors,
}) => {
  const { t } = useTranslation();
  const { edge } = useSelector((state) => state.uiConfig);
  return (
    <div className="mt-7">
      <div className="p-4 text-[var(--text-black-white)]">
        <div className="w-full gap-6 ">
          <div className="flex">
            <input
              id="defects"
              name="defects"
              type="checkbox"
              checked={values.defects || false}
              className={`w-5 h-5 text-xl primary-color ${getEdgeClass(edge)} focus:ring-blue-500 dark:focus:ring-[var(--gray-color)]  focus:ring-0 dark:bg-white dark:border-gray-600`}
              onChange={(e) => setFieldValue("defects", e.target.checked)}
            />
            <label htmlFor="defects" className="ms-2 text-base font-medium">
              {t(`/vehicleDetails.The vehicle has no defects`)}
            </label>
          </div>
          <TradeInTextAreaFields
            setFieldValue={setFieldValue}
            values={values}
            labelName={t(
              `/vehicleDetails.Description of the defect and/or further information about the vehicle`,
            )}
            fieldName={"additionalInformation"}
            placeHolderText={`${t("/vehicleDetails.e.g.")}:\n- ${t("/vehicleDetails.defectsExample1")}\n- ${t("/vehicleDetails.defectsExample2")}\n- ${t("/vehicleDetails.defectsExample3")}\n- ${t("/vehicleDetails.defectsExample4")}`}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleDefectWithDescriptionField;
