import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SVGSelector from "../SVGSelector";

const RadioButtonComponent = ({
  tradeInVehiclesOptions,
  onChangeChooseVehicleHandler,
  setFieldValue,
}) => {
  let transformedEquipmentsItems = tradeInVehiclesOptions.map((item, index) => {
    let equipments = Object.values(item.equipment);
    return { equipments, id: item?.datECode, container: item?.container };
  });
  const [selected, setSelected] = useState(null);
  const { t } = useTranslation();

  const handleSelectVehicleItem = (option) => {
    setSelected(option.id);
    setFieldValue("container", option.container);
    setFieldValue("datECode", option.id);
    onChangeChooseVehicleHandler();
  };
  return (
    <div className="max-md:w-full p-4">
      <label className="flex items-center gap-2 mb-4">
        {t("/vehicleDetails.Choose your vehicle")}
        <span className="text-red-700 pr-2">*</span>
      </label>
      <div className="space-y-4">
        {transformedEquipmentsItems.map((option, id) => (
          <div
            key={option.id}
            className="flex items-center space-x-4 p-4 border border-gray-300 rounded-lg hover:shadow-md"
            onClick={() => {
              handleSelectVehicleItem(option);
            }}
          >
            <div
              className={`w-6 h-6 flex items-center justify-center border-2 rounded-full transition ${
                selected === option.id
                  ? "bg-green-500 border-green-500"
                  : "bg-white border-gray-400"
              }`}
            >
              {selected === option.id && (
                <SVGSelector
                  name="checkmark-svg"
                  pathStroke={"var(--text-white-black)"}
                />
              )}
            </div>
            <div>
              <p>{option.equipments[0]}</p>
              <p className="text-sm text-gray-500">{option.equipments[1]}</p>
              <p className="text-sm text-gray-500">{option.equipments[2]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioButtonComponent;
