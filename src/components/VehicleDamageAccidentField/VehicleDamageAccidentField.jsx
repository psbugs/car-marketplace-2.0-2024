import React from "react";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectClass } from "../../constants/common-constants";
import TradeInTextAreaFields from "../TradeInTextAreaFields/TradeInTextAreaFields";

const VehicleDamageAccidentField = ({ setFieldValue, values, errors }) => {
  const { t } = useTranslation();
  const { edge } = useSelector((state) => state.uiConfig);

  const vehicleAccidentalItems = [
    { label: t("/vehicleDetails.Unknown"), value: 0 },
    { label: t("/vehicleDetails.Accident-free"), value: 1 },
    { label: t("/vehicleDetails.Accident damage (repaired)"), value: 2 },
    { label: t("/vehicleDetails.Accident damage (unrepaired)"), value: 3 },
  ];

  const handleChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const id = selectedOption.getAttribute("data-damage-id");
    setFieldValue("damage", id);
    setFieldValue("damagedName", e.target.value);
  };

  return (
    <div className="mt-7 p-4">
      <label className="flex items-center gap-2 mb-4">
        {t("/vehicleDetails.Has your vehicle been damaged in an accident?")}
      </label>
      <Field
        as="select"
        className={selectClass(edge)}
        name="damage"
        value={values?.damagedName || ""}
        onChange={handleChange}
      >
        <option value="">{t("/.Please choose")}</option>
        {vehicleAccidentalItems?.map(({ label, value }) => (
          <option key={value} value={label} data-damage-id={value}>
            {label}
          </option>
        ))}
      </Field>

      {["2", "3"].includes(values.damage) && (
        <TradeInTextAreaFields
          errors={errors}
          setFieldValue={setFieldValue}
          values={values}
          labelName={t(
            "/vehicleDetails.Please provide information about the accident damage",
          )}
          fieldName="damageOption"
        />
      )}
    </div>
  );
};

export default VehicleDamageAccidentField;
