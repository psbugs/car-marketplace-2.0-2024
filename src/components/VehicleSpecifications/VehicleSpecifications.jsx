import { useTranslation } from "react-i18next";
import {
  colorNameMap,
  colorsForItsSubFilter,
} from "../../constants/common-constants";
import {
  capitalizeFirstLetter,
  convertNumberFormat,
  extractMonthAndYear,
} from "../../utils";
import SVGSelector from "../common-components/SVGSelector";

const VehicleSpecifications = ({ vehicleDetails }) => {
  const { t } = useTranslation();
  const StyledListItem = ({ icon, value }) => {
    return (
      <li className="flex gap-3 items-center capitalize">
        {icon}
        <p className="text-sm text-[var(--secondary-color)]">{value}</p>
      </li>
    );
  };

  const getLinearGradientColorForEachItem = (itemToGetColor) => {
    const germanColorName = colorNameMap?.[itemToGetColor];
    return colorsForItsSubFilter
      ?.filter((item) => item?.label === germanColorName)
      ?.map((item) => item.hashCode)[0];
  };
  return (
    <div className="mt-4">
      <ul className="mt-3 flex flex-wrap gap-4 text-[var(--davy-gray-color)] text-sm justify-start">
        {vehicleDetails?.dateOfFirstRegistration?.dateString ? (
          <StyledListItem
            icon={<SVGSelector name="calender-svg" />}
            value={extractMonthAndYear(
              vehicleDetails?.dateOfFirstRegistration?.date,
            )}
          />
        ) : null}{" "}
        {vehicleDetails?.mileage || vehicleDetails?.mileage === 0 ? (
          <StyledListItem
            icon={<SVGSelector name="speedometer-svg" />}
            value={`${convertNumberFormat(vehicleDetails?.mileage) + " km"}`}
          />
        ) : null}
        {vehicleDetails?.kw && vehicleDetails?.hp ? (
          <StyledListItem
            icon={<SVGSelector name="engine-warning-light-svg" />}
            value={`${vehicleDetails?.kw} kW (${vehicleDetails?.hp} ${t("/vehicles.HP")})`}
          />
        ) : null}
        {vehicleDetails?.gearbox?.name ? (
          <StyledListItem
            icon={<SVGSelector name="gear-svg" />}
            value={vehicleDetails?.gearbox?.name}
          />
        ) : null}
        {vehicleDetails?.paintColoring?.name || vehicleDetails?.paintColor ? (
          <StyledListItem
            icon={
              <span>
                <SVGSelector
                  name="color-display-svg"
                  pathFill={
                    vehicleDetails?.paintColoring?.name === t("/.Other")
                      ? ""
                      : getLinearGradientColorForEachItem(
                          capitalizeFirstLetter(
                            vehicleDetails?.paintColoring?.name,
                          ),
                        )
                  }
                  className={
                    vehicleDetails?.paintColoring?.name === t("/.Other")
                      ? "rounded-full bg-[conic-gradient(from_0deg,#FF0000,#FF7F00,#FFFF00,#00FF00,#00FFFF,#0000FF,#7F00FF,#FF00FF,#FF0000)]"
                      : ""
                  }
                />
              </span>
            }
            value={capitalizeFirstLetter(vehicleDetails?.paintColor)}
          />
        ) : null}
        {vehicleDetails?.fuel?.name ? (
          <StyledListItem
            icon={<SVGSelector name="fuel-pump-svg" />}
            value={vehicleDetails?.fuel?.name}
          />
        ) : null}
      </ul>
    </div>
  );
};
export default VehicleSpecifications;
