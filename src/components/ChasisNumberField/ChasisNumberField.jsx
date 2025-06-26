import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  enableChasisWrap,
  enableManufacturerWrap,
} from "../../redux/TradeInSlice";
import { getEdgeClass } from "../../utils";
import Tooltip from "../common-components/Tooltip";
import SVGSelector from "../common-components/SVGSelector";

const ChasisNumberField = ({
  setFieldValue,
  values,
  errors,
  toggleChasisNumberHandler,
  isDisableChasisField,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { edge } = useSelector((state) => state.uiConfig);
  const handleInputChange = (e) => {
    let value = e.target.value;
    setFieldValue("chasisNumber", e.target.value);
    if (value) {
      dispatch(enableChasisWrap());
      toggleChasisNumberHandler(true);
    } else {
      dispatch(enableManufacturerWrap());
      toggleChasisNumberHandler(false);
    }
  };

  return (
    <>
      <h5 className="font-medium text-xl">
        {t("/vehicleDetails.Chassis number")}
      </h5>
      <div className="flex max-md:flex-col">
        <div className="w-[35%] max-md:w-full">
          <img
            src="https://cdn.dein.auto/pxc-os/content/assets/images/online-sales/vin.png"
            className="w-full"
            alt="Car-Number-Plate-Img"
          />
        </div>
        <div className="w-[65%] max-md:w-full">
          <div className="pl-10 max-md:pl-0">
            <label className="flex items-center mb-4">
              {t("/vehicleDetails.FIN")}&nbsp;
              <span className="text-red-700 pr-2">*</span>
              <Tooltip
                text={
                  <div>
                    {t(
                      "/vehicleDetails.You can find the vehicle identification number or chassis number in your vehicle registration document under item E.",
                    )}{" "}
                    <br />{" "}
                    {t(
                      "/vehicleDetails.On many vehicles, this number can be found under the windshield or on a sticker in the driver's door.",
                    )}
                  </div>
                }
                spanClassName={
                  "max-sm:translate-x-[-5rem] max-sm:max-w-[16rem] max-w-[18rem]"
                }
              >
                <SVGSelector name="i-svg" />
              </Tooltip>
            </label>
            <input
              type="text"
              id="chasisNumber"
              className={`${getEdgeClass(edge)} h-[48px] w-full placeholder:text-[var(--gray-color)] border border-[var(--gray-color)] text-sm py-3 px-4 pr-11 bg-[var(--white-shade)] focus:ring-0 focus:border-[var(--gray-color)]
              ${
                errors?.chasisNumber
                  ? "border-[var(--red-color)]"
                  : "border-[var(--gray-color)]"
              }`}
              placeholder={t("/vehicleDetails.Enter chassis number")}
              value={values.chasisNumber}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChasisNumberField;
