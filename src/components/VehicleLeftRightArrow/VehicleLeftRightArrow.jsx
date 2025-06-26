import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import SVGSelector from "../common-components/SVGSelector";
import { getEdgeClass, scrollToTopFunction } from "../../utils";

const VehicleLeftRightArrow = ({ prevNextVehicleData }) => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const index = queryParams.get("index");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { vehiclesRegistrationDates } =
    useSelector((state) => state?.vehicles) || {};
  const { items = false } = vehiclesRegistrationDates || {};
  const { edge = false } = useSelector((state) => state?.uiConfig) || {};

  const prevValue = prevNextVehicleData?.items?.[0] || false;
  const nextValue = prevNextVehicleData?.items?.[2] || false;

  return (
    <>
      {items?.length &&
      index &&
      index >= 0 &&
      index < vehiclesRegistrationDates?.total ? (
        <div className="flex gap-6 max-md:gap-2 items-center max-sm:justify-between max-sm:w-full">
          <p className="text-sm text-[var(--text-black-white)]">
            {t("/vehicleDetails.Vehicle")}{" "}
            <span>
              {Number(index) + 1}/{vehiclesRegistrationDates?.total}
            </span>
          </p>
          <div className="flex gap-[18px] max-md:gap-3">
            <button
              className={`w-[24px] h-[24px] ${getEdgeClass(edge, "rounded-full")} flex items-center justify-center ${
                !prevValue || index < 1
                  ? "bg-[var(--gray-color)] cursor-not-allowed"
                  : "bg-[var(--primary-color-single)] cursor-pointer"
              }`}
              onClick={() => {
                scrollToTopFunction();
                navigate(
                  `?view=vehicle-details&vehicle-id=${prevValue}&index=${
                    Number(index) - 1
                  }`,
                );
              }}
              disabled={!prevValue || index < 1}
            >
              <SVGSelector
                name="arrow-left-svg"
                pathFill={"var(--text-white-black)"}
              />
            </button>
            <button
              className={`w-[24px] h-[24px] ${getEdgeClass(edge, "rounded-full")} flex items-center justify-center ${
                !nextValue ||
                Number(index) === vehiclesRegistrationDates?.total - 1
                  ? "bg-[var(--gray-color)] cursor-not-allowed"
                  : "bg-[var(--primary-color-single)]  cursor-pointer"
              }`}
              onClick={() => {
                scrollToTopFunction();
                navigate(
                  `?view=vehicle-details&vehicle-id=${nextValue}&index=${
                    Number(index) + 1
                  }`,
                );
              }}
              disabled={
                !nextValue ||
                Number(index) === vehiclesRegistrationDates?.total - 1
              }
            >
              <SVGSelector
                name="arrow-right-svg"
                pathFill={"var(--text-white-black)"}
              />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};
export default VehicleLeftRightArrow;
