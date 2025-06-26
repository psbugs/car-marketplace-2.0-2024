import { useTranslation } from "react-i18next";
import { extractMonthAndYear, getEdgeClass } from "../../utils";
import Tooltip from "../../components/common-components/Tooltip";
import SVGSelector from "../common-components/SVGSelector";
import { useSelector } from "react-redux";

const VehiclesGeneralInfo = ({ vehicleDetails }) => {
  const { edge = false } = useSelector((state) => state?.uiConfig) || {};
  const {
    orderNumber,
    previousOwnersCount,
    doorsCount,
    previousUsageType,
    paintColor,
    hasMetallicPaint,
    seatCount,
    seatCoverMaterial,
    seatCoverBaseColor,
    hsn,
    tsn,
    cubicCapacity,
    dateOfNextTechnicialInspection,
    deliveryPeriod,
    contact,
  } = vehicleDetails || {};

  const hasVehicleDetails = [
    orderNumber,
    previousOwnersCount,
    doorsCount,
    previousUsageType?.name,
    paintColor,
    hasMetallicPaint,
    seatCount,
    seatCoverMaterial?.name,
    seatCoverBaseColor?.name,
    hsn,
    tsn,
    cubicCapacity,
    dateOfNextTechnicialInspection,
    deliveryPeriod,
    contact?.address1,
    contact?.town,
    contact?.zip,
  ]?.some((detail) => detail);

  const { t } = useTranslation();

  const InfoItem = ({ icon, label, value }) => (
    <li>
      <div className="grid grid-cols-[_1fr_1.5fr] items-center gap-2">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <p className="text-sm text-[var(--davy-gray-color)]">{label}</p>
        </div>
        <div className="flex items-center">
          <Tooltip
            text={value}
            className={"max-w-[350px] text-ellipsis break-words"}
          >
            <p className="text-[15px] font-medium">{value}</p>
          </Tooltip>
        </div>
      </div>
    </li>
  );

  return (
    <>
      {hasVehicleDetails ? (
        <section className="mt-7 max-md:mt-5">
          <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2 ">
            <div
              className={`${getEdgeClass(edge, "rounded-[20px]")} bg-[var(--white-shade)] p-7 max-md:p-4`}
            >
              <h3 className="text-[var(--primary-dark-color)] max-md:text-lg font-semibold text-2xl pb-2 relative after:h-[2px] after:max-w-[70px] after:w-full after:contents-[] after:absolute after:bottom-0 after:left-0 after:bg-[var(--primary-dark-color)]">
                {t("/vehicleDetails.General Information")}
              </h3>
              <div className="mt-7">
                <ul className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-4 items-center">
                  {orderNumber ? (
                    <InfoItem
                      icon={<SVGSelector name="offer-number-svg" />}
                      label={t("/vehicleDetails.Offer number")}
                      value={orderNumber}
                    />
                  ) : null}
                  {previousUsageType?.name ? (
                    <InfoItem
                      icon={<SVGSelector name="car-front-view-circular-svg" />}
                      label={t("/vehicleDetails.Vehicle type")}
                      value={previousUsageType?.name}
                    />
                  ) : null}
                  {previousOwnersCount ? (
                    <InfoItem
                      icon={<SVGSelector name="previous-owner-count-svg" />}
                      label={t("/vehicleDetails.Previous Owner")}
                      value={previousOwnersCount}
                    />
                  ) : null}
                  {doorsCount ? (
                    <InfoItem
                      icon={<SVGSelector name="doors-count-svg" />}
                      label={t("/vehicleDetails.No. of doors")}
                      value={doorsCount}
                    />
                  ) : null}
                  {seatCount ? (
                    <InfoItem
                      icon={<SVGSelector name="seat-count-svg" />}
                      label={t("/vehicleDetails.No. of seats")}
                      value={seatCount}
                    />
                  ) : null}
                  {dateOfNextTechnicialInspection ? (
                    <InfoItem
                      icon={<SVGSelector name="inspection-svg" />}
                      label="HU"
                      value={
                        <span>
                          {extractMonthAndYear(
                            dateOfNextTechnicialInspection?.date,
                          )}
                        </span>
                      }
                    />
                  ) : null}
                  {paintColor ? (
                    <InfoItem
                      icon={<SVGSelector name="paint-color-circular-svg" />}
                      label={t("/vehicleDetails.Color")}
                      value={<span>{paintColor}</span>}
                    />
                  ) : null}
                  {seatCoverMaterial?.name || seatCoverBaseColor?.name ? (
                    <InfoItem
                      icon={<SVGSelector name="cushion-svg" />}
                      label={t("/vehicleDetails.Cushion")}
                      value={
                        <span>
                          {seatCoverMaterial?.name ? (
                            <span>{seatCoverMaterial?.name},</span>
                          ) : null}{" "}
                          {seatCoverBaseColor?.name ? (
                            <span>{seatCoverBaseColor?.name}</span>
                          ) : null}
                        </span>
                      }
                    />
                  ) : null}
                  {cubicCapacity ? (
                    <InfoItem
                      icon={<SVGSelector name="displacement-circular-svg" />}
                      label={t("/vehicleDetails.Displacement")}
                      value={
                        <span>
                          {cubicCapacity} cm<sup>3</sup>
                        </span>
                      }
                    />
                  ) : null}
                  {hsn || tsn ? (
                    <InfoItem
                      icon={<SVGSelector name="hsn-tsn-circular-svg" />}
                      label="HSN/TSN"
                      value={
                        <span>
                          {(hsn || tsn) && (
                            <span className="text-[15px] font-medium">
                              {hsn ? hsn : "-"}/{tsn ? tsn : "-"}
                            </span>
                          )}
                        </span>
                      }
                    />
                  ) : null}
                  {deliveryPeriod ? (
                    <InfoItem
                      icon={<SVGSelector name="availability-svg" />}
                      label={t("/vehicleDetails.Availability")}
                      value={
                        <span>
                          {t("/vehicleDetails.In")} {deliveryPeriod}{" "}
                          {t("/vehicleDetails.days from order")}{" "}
                        </span>
                      }
                    />
                  ) : null}
                  {contact ? (
                    <InfoItem
                      icon={<SVGSelector name="location-pin-circular-svg" />}
                      label={t("/vehicleDetails.Location")}
                      value={
                        <span>
                          {contact?.address1}, {contact?.zip} {contact?.town}
                        </span>
                      }
                    />
                  ) : null}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};
export default VehiclesGeneralInfo;
