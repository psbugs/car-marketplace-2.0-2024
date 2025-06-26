import { useTranslation } from "react-i18next";
import {
  capitalizeFirstLetter,
  convertNumberFormat,
  scrollToBottomFunction,
} from "../../utils";
import SuperscriptScrollToBottom from "../common-components/SuperscriptScrollToBottom";

const BuyingTabView = ({ vehicleDetails, priceDetails, currency }) => {
  const { t } = useTranslation();

  return (
    <ul className="space-y-1 pe-2">
      {priceDetails?.netPrice ||
      priceDetails?.totalPrice ||
      priceDetails?.oldListPrice?.totalPrice ? (
        <div className="flex max-sm:block">
          <li className="flex items-baseline flex-col max-sm:block flex-[1.5]">
            {priceDetails?.totalPrice ? (
              <h4 className="text-xl font-semibold text-[var(--text-black-white)] max-md:text-lg">
                {t("/vehicleDetails.Gross")}:
                <br />
                <span className="text-4xl">
                  {convertNumberFormat(priceDetails?.totalPrice, currency)}
                  {priceDetails?.vatDeductible ? (
                    <SuperscriptScrollToBottom
                      title={"i"}
                      onClick={() =>
                        scrollToBottomFunction("suggested-container")
                      }
                    />
                  ) : null}
                </span>
              </h4>
            ) : null}
            {priceDetails?.netPrice ? (
              <p className="text-[var(--davy-gray-color)] font-medium text-lg max-lg:text-sm">
                {t("/vehicleDetails.Net")}: &nbsp;
                <span className="text-lg">
                  {convertNumberFormat(priceDetails?.netPrice, currency)}
                </span>
              </p>
            ) : null}
            {vehicleDetails?.oldListPrice?.totalPrice ? (
              <p className="text-[var(--davy-gray-color)] font-medium text-lg max-lg:text-sm">
                {t("/vehicleDetails.RRP")}: &nbsp;
                <span className="text-lg">
                  {convertNumberFormat(
                    vehicleDetails?.oldListPrice?.totalPrice,
                    currency,
                  )}
                </span>
              </p>
            ) : null}
          </li>
          <div
            className={`flex flex-col items-center my-2 w-full justify-evenly flex-1 ${vehicleDetails?.sealOfQualityImageUrl ? "gap-2" : ""}`}
          >
            <div className="flex items-center justify-center h-[2.5rem] max-sm:h-[2rem] w-full border text-[0.95rem] text-[var(--text-black-white)] border-[var(--text-black-white)]">
              {vehicleDetails?.previousUsageType &&
              vehicleDetails?.previousUsageType?.name
                ? capitalizeFirstLetter(vehicleDetails?.previousUsageType?.name)
                : null}{" "}
            </div>
            <div className="flex items-center justify-center w-full">
              {vehicleDetails?.sealOfQualityImageUrl ? (
                <img
                  src={vehicleDetails?.sealOfQualityImageUrl}
                  alt={vehicleDetails?.sealOfQuality}
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </ul>
  );
};
export default BuyingTabView;
