import { notAvailableImg } from "../../constants/common-constants";
import { useTranslation } from "react-i18next";
import SuperscriptScrollToBottom from "../common-components/SuperscriptScrollToBottom";
import { useSelector } from "react-redux";
import {
  convertNumberFormat,
  getEdgeClass,
  scrollToBottomFunction,
} from "../../utils";

const VehicleConsumptionInfo = ({ vehicleDetails }) => {
  const { t } = useTranslation();
  const { uiConfigData = false, edge = false } =
    useSelector((state) => state?.uiConfig) || {};
  const { i18n } = uiConfigData || {};
  const { currencySymbol = false, locales = false } = i18n || {};
  const currency = { currencySymbol, locale: locales?.[0] };

  const {
    wltpFuelConsumptionCombined,
    wltpCo2EmissionCombined,
    wltpFuelAveragePrice,
    wltpFuelConsumptionLow,
    fuelConsumptionSuburban,
    fuelConsumptionUrban,
    wltpFuelConsumptionHigh,
    wltpFuelConsumptionExtraHigh,
    wltpEnergyCost15000,
    wltpPossibleCo2CostMid,
    wltpPossibleCo2CostLow,
    wltpPossibleCo2CostHigh,
    wltpAverageCo2CostMid,
    wltpAverageCo2CostLow,
    wltpAverageCo2CostHigh,
    wltpFuelTax,
    emissionClass,
    wltpCo2ClassCombined,
    wltpCo2ClassDischarged,
    wltpCo2ClassWeighted,
    wltpFuelConsumptionMedium,
    wltpElectricCombined,
    wltpElectricRange,
    wltpElectricConsumptionLow,
    wltpElectricConsumptionMedium,
    wltpElectricConsumptionHigh,
    wltpElectricConsumptionExtraHigh,
    wltpElectricAveragePrice,
    wltpElectricRangeEAER,
    wltpCo2EmissionWeighted,
    wltpElectricWeighted,
    wltpFuelConsumptionWeighted,
  } = vehicleDetails || {};

  const imageBaseUrl =
    "https://cdn.dein.auto/pxc-amm/content/assets/images/co2classes/co2class-";
  const co2Class =
    wltpCo2ClassCombined?.replace(/[+-]+/g, "") ||
    wltpCo2ClassWeighted?.replace(/[+-]+/g, "") +
      "-" +
      wltpCo2ClassDischarged?.replace(/[+-]+/g, "") +
      "-de" ||
    "";
  const imageURL = `${imageBaseUrl}${co2Class}.jpg`;

  const StyledListItem = ({ label, value }) => {
    return (
      <li className="styled-list-item">
        <div className="my-2 grid grid-cols-2 gap-2 py-2 px-3 text-base max-md:text-[15px]">
          <div>
            <div>{label}</div>
          </div>
          <div className="text-end">
            <div>{value}</div>
          </div>
        </div>
      </li>
    );
  };
  return (
    <>
      {wltpFuelConsumptionCombined || wltpElectricCombined ? (
        <section className="mt-7 max-md:mt-5">
          <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2 ">
            <div
              className={`bg-[var(--white-shade)] p-7 max-md:p-4 ${getEdgeClass(edge, "rounded-[20px]")}`}
            >
              <h3 className="text-[var(--primary-dark-color)] max-md:text-lg font-semibold text-2xl pb-2 relative after:h-[2px] after:max-w-[70px] after:w-full after:contents-[] after:absolute after:bottom-0 after:left-0 after:bg-[var(--primary-dark-color)]">
                {t("/vehicleDetails.Consumption Information")}
              </h3>
              <div className="mt-7 flex gap-7 max-lg:flex-col">
                <div className="w-1/2 max-lg:w-full">
                  <ul>
                    {wltpFuelConsumptionCombined &&
                    (typeof wltpElectricCombined === "undefined" ||
                      wltpElectricCombined === 0) ? (
                      <StyledListItem
                        label={`${t(
                          `/vehicleDetails.Energy consumption (combined)`,
                        )} :`}
                        value={`${convertNumberFormat(wltpFuelConsumptionCombined, false, false, true)} l/100 km`}
                      />
                    ) : null}
                    {wltpElectricCombined &&
                    (typeof wltpFuelConsumptionCombined === "undefined" ||
                      wltpFuelConsumptionCombined === 0) ? (
                      <StyledListItem
                        label={`${t(
                          `/vehicleDetails.Energy consumption (combined)`,
                        )} :`}
                        value={`${convertNumberFormat(wltpElectricCombined)} kWh/100 km`}
                      />
                    ) : null}
                    {wltpFuelConsumptionCombined && wltpElectricWeighted ? (
                      <StyledListItem
                        label={`${t(`/vehicleDetails.Energy consumption`)} ${t(
                          `/vehicleDetails.(weighted, combined)`,
                        )} :`}
                        value={
                          <span>
                            {convertNumberFormat(wltpElectricWeighted)}
                            kWh/100 km plus &nbsp;
                            {convertNumberFormat(wltpFuelConsumptionWeighted)}
                            l/100 km
                          </span>
                        }
                      />
                    ) : null}
                    {wltpCo2EmissionCombined ||
                    wltpCo2EmissionCombined === 0 ? (
                      <StyledListItem
                        label={`${t(
                          "/vehicleDetails.CO₂ emissions (combined)",
                        )} :`}
                        value={`${convertNumberFormat(wltpCo2EmissionCombined)} g/km`}
                      />
                    ) : null}
                    {wltpCo2EmissionWeighted ? (
                      <StyledListItem
                        label={
                          <>
                            {t(
                              "/vehicleDetails.CO₂ emissions (weighted, combined)",
                            )}
                            :
                            <SuperscriptScrollToBottom
                              title={"ii"}
                              onClick={() =>
                                scrollToBottomFunction("suggested-container")
                              }
                            />
                          </>
                        }
                        value={`${convertNumberFormat(wltpCo2EmissionWeighted)} g/km`}
                      />
                    ) : null}
                    {wltpFuelAveragePrice ? (
                      <StyledListItem
                        label={
                          <>
                            {`${t("/vehicleDetails.Fuel price")} :`}
                            <SuperscriptScrollToBottom
                              title={"ii"}
                              onClick={() =>
                                scrollToBottomFunction("suggested-container")
                              }
                            />
                          </>
                        }
                        value={`${convertNumberFormat(wltpFuelAveragePrice, currency)}/l`}
                      />
                    ) : null}
                    {wltpElectricAveragePrice ? (
                      <StyledListItem
                        label={
                          <>
                            {`${t("/vehicleDetails.Electricity price")} :`}
                            <SuperscriptScrollToBottom
                              title={"ii"}
                              onClick={() =>
                                scrollToBottomFunction("suggested-container")
                              }
                            />
                          </>
                        }
                        value={`${convertNumberFormat(wltpElectricAveragePrice, currency)}/l`}
                      />
                    ) : null}
                    {(wltpElectricCombined ||
                      wltpElectricConsumptionLow ||
                      wltpElectricConsumptionMedium ||
                      wltpElectricConsumptionHigh ||
                      wltpElectricConsumptionExtraHigh) &&
                    typeof wltpFuelConsumptionCombined === "undefined" ? (
                      <StyledListItem
                        label={
                          <>
                            {`${t("/vehicleDetails.Power consumption")} :`}
                            <SuperscriptScrollToBottom
                              title={"ii"}
                              onClick={() =>
                                scrollToBottomFunction("suggested-container")
                              }
                            />
                          </>
                        }
                        value={
                          <div>
                            {wltpElectricCombined ? (
                              <p>
                                <span>
                                  {convertNumberFormat(wltpElectricCombined)}
                                  kWh/100 km ({t("/vehicleDetails.combined")})
                                </span>
                              </p>
                            ) : null}
                            {wltpElectricConsumptionLow ? (
                              <p>
                                <span>
                                  {convertNumberFormat(
                                    wltpElectricConsumptionLow,
                                  )}
                                  kWh/100 km ({t("/vehicleDetails.city center")}
                                  )
                                </span>
                              </p>
                            ) : null}
                            {wltpElectricConsumptionMedium ? (
                              <p>
                                <span>
                                  {convertNumberFormat(
                                    wltpElectricConsumptionMedium,
                                  )}
                                  kWh/100 km ({t("/vehicleDetails.outskirts")})
                                </span>
                              </p>
                            ) : null}
                            {wltpElectricConsumptionHigh ? (
                              <p>
                                <span>
                                  {convertNumberFormat(
                                    wltpElectricConsumptionHigh,
                                  )}
                                  kWh/100 km (
                                  {t("/vehicleDetails.country road")})
                                </span>
                              </p>
                            ) : null}
                            {wltpElectricConsumptionExtraHigh ? (
                              <p>
                                <span>
                                  {convertNumberFormat(
                                    wltpElectricConsumptionExtraHigh,
                                  )}
                                </span>
                              </p>
                            ) : null}
                          </div>
                        }
                      />
                    ) : null}
                    {(wltpFuelConsumptionCombined ||
                      wltpFuelConsumptionLow ||
                      fuelConsumptionSuburban ||
                      fuelConsumptionUrban ||
                      wltpFuelConsumptionHigh ||
                      wltpFuelConsumptionExtraHigh) &&
                    typeof wltpElectricCombined === "undefined" ? (
                      <StyledListItem
                        label={`${t("/vehicleDetails.Fuel consumption")} :`}
                        value={
                          <div>
                            {wltpFuelConsumptionCombined ? (
                              <p>
                                <span>
                                  {convertNumberFormat(
                                    wltpFuelConsumptionCombined,
                                    false,
                                    false,
                                    true,
                                  )}
                                  &nbsp;l/100 km (
                                  {t("/vehicleDetails.combined")})
                                </span>
                              </p>
                            ) : null}
                            {wltpFuelConsumptionLow ? (
                              <p>
                                {convertNumberFormat(
                                  wltpFuelConsumptionLow,
                                  false,
                                  false,
                                  true,
                                )}
                                &nbsp; l/100 km (
                                {t("/vehicleDetails.city center")})
                              </p>
                            ) : null}
                            {wltpFuelConsumptionMedium ? (
                              <p>
                                {convertNumberFormat(
                                  wltpFuelConsumptionMedium,
                                  false,
                                  false,
                                  true,
                                )}
                                &nbsp; l/100 km ({t("/vehicleDetails.suburban")}
                                )
                              </p>
                            ) : null}
                            {wltpFuelConsumptionHigh ? (
                              <p>
                                {convertNumberFormat(
                                  wltpFuelConsumptionHigh,
                                  false,
                                  false,
                                  true,
                                )}
                                &nbsp; l/100 km (
                                {t("/vehicleDetails.country road")})
                              </p>
                            ) : null}
                            {wltpFuelConsumptionExtraHigh ? (
                              <p>
                                {convertNumberFormat(
                                  wltpFuelConsumptionExtraHigh,
                                  false,
                                  false,
                                  true,
                                )}
                                &nbsp; l/100 km ({t("/vehicleDetails.highway")})
                              </p>
                            ) : null}
                          </div>
                        }
                      />
                    ) : null}
                    {wltpFuelConsumptionCombined && wltpElectricWeighted ? (
                      <>
                        {wltpElectricCombined ||
                        wltpElectricConsumptionLow ||
                        wltpElectricConsumptionMedium ||
                        wltpElectricConsumptionHigh ||
                        wltpElectricConsumptionExtraHigh ? (
                          <StyledListItem
                            label={
                              <>
                                {t(
                                  "/vehicleDetails.Electricity consumption with purely electric drive",
                                )}
                                <SuperscriptScrollToBottom
                                  title={"ii"}
                                  scrollToBottomFunction={() =>
                                    scrollToBottomFunction(
                                      "suggested-container",
                                    )
                                  }
                                />
                              </>
                            }
                            value={
                              <div>
                                {wltpElectricCombined ? (
                                  <p>
                                    <span>
                                      {convertNumberFormat(
                                        wltpElectricCombined,
                                      )}
                                      &nbsp;kWh/100 km{" "}
                                      {t("/vehicles.(combined)")}
                                    </span>
                                  </p>
                                ) : null}
                                {wltpElectricConsumptionLow ? (
                                  <p>
                                    <span>
                                      {convertNumberFormat(
                                        wltpElectricConsumptionLow,
                                      )}
                                      &nbsp;kWh/100 km{" "}
                                      {t("/vehicles.(inner city)")}
                                    </span>
                                  </p>
                                ) : null}
                                {wltpElectricConsumptionMedium ? (
                                  <p>
                                    <span>
                                      {convertNumberFormat(
                                        wltpElectricConsumptionMedium,
                                      )}
                                      &nbsp;kWh/100km{" "}
                                      {t("/vehicles.(outer city)")}
                                    </span>
                                  </p>
                                ) : null}
                                {wltpElectricConsumptionHigh ? (
                                  <p>
                                    <span>
                                      {convertNumberFormat(
                                        wltpElectricConsumptionHigh,
                                      )}
                                      &nbsp; kWh/100km (
                                      {t("/vehicleDetails.country road")})
                                    </span>
                                  </p>
                                ) : null}
                                {wltpElectricConsumptionExtraHigh ? (
                                  <p>
                                    <span>
                                      {convertNumberFormat(
                                        wltpElectricConsumptionExtraHigh,
                                      )}
                                      &nbsp; kWh/100km (
                                      {t("/vehicleDetails.highway")})
                                    </span>
                                  </p>
                                ) : null}
                              </div>
                            }
                          />
                        ) : null}
                        {wltpFuelConsumptionCombined ||
                        wltpFuelConsumptionLow ||
                        fuelConsumptionSuburban ||
                        fuelConsumptionUrban ||
                        wltpFuelConsumptionHigh ||
                        wltpFuelConsumptionExtraHigh ? (
                          <StyledListItem
                            label={`${t(
                              "/vehicleComparison.Fuel consumption (with discharged battery)",
                            )} :`}
                            value={
                              <div>
                                {wltpFuelConsumptionCombined ? (
                                  <p>
                                    <span>
                                      {convertNumberFormat(
                                        wltpFuelConsumptionCombined,
                                      )}
                                      &nbsp; l/100 km{" "}
                                      {t("/vehicles.(combined)")}
                                    </span>
                                  </p>
                                ) : null}
                                {wltpFuelConsumptionLow ? (
                                  <p>
                                    {convertNumberFormat(
                                      wltpFuelConsumptionLow,
                                    )}
                                    &nbsp; l/100 km{" "}
                                    {t("/vehicles.(inner city)")}
                                  </p>
                                ) : null}
                                {wltpFuelConsumptionMedium ? (
                                  <p>
                                    {convertNumberFormat(
                                      wltpFuelConsumptionMedium,
                                    )}
                                    &nbsp; l/100 km{" "}
                                    {t("/vehicles.(outer city)")}
                                  </p>
                                ) : null}
                                {wltpFuelConsumptionHigh ? (
                                  <p>
                                    {convertNumberFormat(
                                      wltpFuelConsumptionHigh,
                                    )}
                                    &nbsp; l/100 km (
                                    {t("/vehicleDetails.offroad")})
                                  </p>
                                ) : null}
                                {wltpFuelConsumptionExtraHigh ? (
                                  <p>
                                    {convertNumberFormat(
                                      wltpFuelConsumptionExtraHigh,
                                    )}
                                    &nbsp; l/100 km (
                                    {t("/vehicleDetails.highway")})
                                  </p>
                                ) : null}
                              </div>
                            }
                          />
                        ) : null}
                      </>
                    ) : null}
                    {wltpElectricRange ? (
                      <StyledListItem
                        label={`${t("/vehicleDetails.Electric range")} :`}
                        value={`${convertNumberFormat(wltpElectricRange)} km`}
                      />
                    ) : null}
                    {wltpElectricRangeEAER ? (
                      <StyledListItem
                        label={`${t(
                          "/vehicleDetails.Electric range",
                        )} (EAER) :`}
                        value={`${convertNumberFormat(wltpElectricRangeEAER)} km`}
                      />
                    ) : null}
                    {wltpEnergyCost15000 ? (
                      <StyledListItem
                        label={t(
                          "/vehicleDetails.Energy costs for 15,000 km annual mileage",
                        )}
                        value={`${convertNumberFormat(wltpEnergyCost15000, currency)}/${t(
                          "/vehicleDetails.year",
                        )}`}
                      />
                    ) : null}
                    {wltpPossibleCo2CostMid ||
                    wltpAverageCo2CostMid ||
                    wltpPossibleCo2CostLow ||
                    wltpAverageCo2CostLow ||
                    wltpPossibleCo2CostHigh ||
                    wltpAverageCo2CostHigh ? (
                      <StyledListItem
                        label={t(
                          "/vehicleDetails.Possible CO₂ costs over the next 10 years (15,000 km/year)",
                        )}
                        value={
                          <>
                            {wltpPossibleCo2CostMid || wltpAverageCo2CostMid ? (
                              <p>
                                <span>
                                  {convertNumberFormat(
                                    wltpPossibleCo2CostMid,
                                    currency,
                                    true,
                                  )}
                                </span>
                                &nbsp;(
                                {t(
                                  "/vehicleDetails.assuming an average CO₂ price of",
                                )}
                                &nbsp;
                                {convertNumberFormat(
                                  wltpAverageCo2CostMid,
                                  currency,
                                  true,
                                )}
                                /t)
                              </p>
                            ) : null}
                            {wltpAverageCo2CostLow || wltpPossibleCo2CostLow ? (
                              <p>
                                <span>
                                  {convertNumberFormat(
                                    wltpPossibleCo2CostLow,
                                    currency,
                                    true,
                                  )}
                                </span>
                                &nbsp;(
                                {t(
                                  "/vehicleDetails.assuming a low average CO₂ price of",
                                )}
                                &nbsp;
                                {convertNumberFormat(
                                  wltpAverageCo2CostLow,
                                  currency,
                                  true,
                                )}
                                /t)
                              </p>
                            ) : null}
                            {wltpPossibleCo2CostHigh ||
                            wltpAverageCo2CostHigh ? (
                              <p>
                                <span>
                                  {convertNumberFormat(
                                    wltpPossibleCo2CostHigh,
                                    currency,
                                    true,
                                  )}
                                </span>
                                &nbsp;(
                                {t(
                                  "/vehicleDetails.assuming a high average CO₂ price of",
                                )}
                                &nbsp;
                                {convertNumberFormat(
                                  wltpAverageCo2CostHigh,
                                  currency,
                                  true,
                                )}
                                /t)
                              </p>
                            ) : null}
                          </>
                        }
                      />
                    ) : null}
                  </ul>
                </div>
                <div className="w-1/2 max-lg:w-full">
                  <ul>
                    {wltpCo2ClassCombined ||
                    (wltpCo2ClassWeighted && wltpCo2ClassDischarged) ? (
                      <div className="mt-2 mb-3 py-2 px-3 text-base max-md:text-sm">
                        <p>
                          {t("/vehicleDetails.CO₂ class (combined)")}:
                          <SuperscriptScrollToBottom
                            title={"ii"}
                            onClick={() =>
                              scrollToBottomFunction("suggested-container")
                            }
                          />
                        </p>
                        <img
                          className="w-full"
                          src={imageURL || notAvailableImg}
                          onError={(e) => {
                            e.target.src = notAvailableImg;
                          }}
                          alt={`CO₂ Efficiency Class ${co2Class}`}
                        />
                      </div>
                    ) : null}
                    {wltpFuelTax || wltpFuelTax === 0 ? (
                      <StyledListItem
                        label={t("/vehicleDetails.Motor vehicle tax")}
                        value={convertNumberFormat(wltpFuelTax, currency, true)}
                      />
                    ) : null}
                    {emissionClass?.name ? (
                      <StyledListItem
                        label={`${t("/vehicleDetails.Pollutant class")}:`}
                        value={emissionClass?.name}
                      />
                    ) : null}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};
export default VehicleConsumptionInfo;
