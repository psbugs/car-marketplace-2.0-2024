import React, { useState } from "react";
import { generateFixedNumbersForTradeInPopup, getEdgeClass } from "../../utils";
import { Field } from "formik";
import { selectClass } from "../../constants/common-constants";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const OwnerAndOdometerFields = ({
  isShowSubHeading,
  setFieldValue,
  values,
  errors,
  touched,
}) => {
  const { edge } = useSelector((state) => state.uiConfig);
  const { t } = useTranslation();
  const [previousOwnersItems] = useState([
    t("/vehicleDetails.No one"),
    ...generateFixedNumbersForTradeInPopup(8),
  ]);

  const handleInputChange = (e) => {
    setFieldValue("mileage", e.target.value);
  };
  return (
    <>
      {isShowSubHeading && (
        <h3 className="font-medium                                                                                                                                                                                    mb-3 text-xl">
          {t("/vehicleDetails.Vehicle History")}
        </h3>
      )}
      <div className="rounded-lg mb-4 p-4">
        <div className="flex w-full gap-6 max-md:flex-col max-md:gap-2">
          <div className="w-2/4 max-md:w-full">
            <label className="flex items-center mb-4" htmlFor="previousOwners">
              {t("/vehicleDetails.Current previous owners")}&nbsp;
              <span className="text-red-700 pr-2">*</span>
            </label>
            <div className="flex-auto">
              <Field
                as="select"
                className={`${selectClass(edge)} ${
                  errors?.previousOwners
                    ? "border-[var(--red-color)] focus:border-[var(--red-color)]"
                    : "border-[var(--gray-color)] focus:border-[var(--gray-color)]"
                }`}
                name="previousOwners"
                id="previousOwners"
              >
                <option value="">{t("/.Please choose")}</option>
                {previousOwnersItems.map((owner, index) => (
                  <option key={index}>{owner}</option>
                ))}
              </Field>
            </div>
          </div>
          <div className="w-2/4 max-md:w-full">
            <label className="flex items-center mb-4" htmlFor="mileage">
              {t("/vehicleDetails.Odometer reading")}&nbsp;
              <span className="text-red-700 pr-2">*</span>
            </label>
            <div className="flex">
              <input
                type="text"
                className={`${getEdgeClass(edge, "rounded-tl-lg rounded-bl-lg")} h-[48px] w-full placeholder:text-[var(--gray-color)] border border-[var(--gray-color)] text-sm py-3 px-4 pr-11 bg-[var(--white-shade)] focus:ring-0 focus:border-[var(--gray-color)]
                 ${
                   errors?.mileage
                     ? "border-[var(--red-color)]"
                     : "border-[var(--gray-color)]"
                 }
                `}
                value={values?.mileage}
                onChange={handleInputChange}
              />
              <div
                className={`flex items-center p-2 bg-gray-300 border-r border-t border-b border-black ${getEdgeClass(edge, "rounded-tr-lg rounded-br-lg")}`}
              >
                <span className="">km</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerAndOdometerFields;
