import { useState, useMemo, useCallback, useEffect } from "react";
import BMWFinancingCalculator from "../VehicleFinancingCalculator/BMWFinancingCalculator";
import RenaultOrBank11FinancingCalculator from "../VehicleFinancingCalculator/RenaultOrBank11FinancingCalculator";
import BDKFinancingCalculator from "../VehicleFinancingCalculator/BDKFinancingCalculator";
import { feasibleCalculators } from "../../constants/common-constants";
import { useTranslation } from "react-i18next";
import BMWFinancialLeasingTypeFinancingCalculator from "../VehicleFinancingCalculator/BMWFinancialLeasingTypeFinancingCalculator";
import { useSelector } from "react-redux";
import { getEdgeClass } from "../../utils";

const VehicleFinancingAndLeasing = ({ vehicleDetails }) => {
  const { manufacturer = false } = vehicleDetails || {};
  const { uiConfigData = false, edge = false } =
    useSelector((state) => state?.uiConfig) || {};
  const { detailsAppearance = false, i18n = false } = uiConfigData || {};
  const { currencySymbol = false, locales = false } = i18n || {};
  const currency = { currencySymbol, locale: locales?.[0] };
  const [showTabs, setShowTabs] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    const calculators = detailsAppearance.financialCalculators || [];
    if (calculators.length === 1) {
      setShowTabs(false);
      setSelectedTab(calculators[0]);
    } else if (calculators.length > 0) {
      setSelectedTab(calculators[0]);
    }
  }, [detailsAppearance.financialCalculators]);

  let { financialCalculators = false, financialCalculatorSettings = false } =
    detailsAppearance || {};
  const calculatorWithManufacturerIds = financialCalculatorSettings
    ? financialCalculatorSettings?.find((calc) => "manufacturerIds" in calc)
    : null;

  const manufacturerWithCalculator = financialCalculatorSettings
    ? financialCalculatorSettings?.find((calc) =>
        calc?.manufacturerIds?.includes(manufacturer?.id),
      )
    : null;

  financialCalculatorSettings =
    Array?.isArray(financialCalculatorSettings) &&
    manufacturer &&
    financialCalculatorSettings?.length >= 2
      ? manufacturerWithCalculator || financialCalculatorSettings[0]
      : financialCalculatorSettings && financialCalculatorSettings.length > 0
        ? [financialCalculatorSettings?.[0]]
        : [];

  const availableCalculators = useMemo(() => {
    return (
      uiConfigData?.detailsAppearance?.financialCalculators || [
        "BmwBank",
        "RenaultBank",
        "Bank11",
      ]
    );
  }, [uiConfigData]);
  let { financingOptions = false, leasingOptions = false } =
    vehicleDetails || {};
  financingOptions = financingOptions && financingOptions?.[0];
  leasingOptions = leasingOptions && leasingOptions?.[0];
  const [selectedTab, setSelectedTab] = useState("");

  const isOptionsAvailable = useCallback(
    (bankName) => {
      if (feasibleCalculators.includes(bankName)) {
        return (
          Object.keys(financingOptions).length > 0 ||
          Object.keys(leasingOptions || {}).length > 0
        );
      }
      return true;
    },
    [financingOptions, leasingOptions],
  );

  const filteredCalculators = useMemo(
    () => availableCalculators.filter(isOptionsAvailable),
    [availableCalculators, isOptionsAvailable],
  );
  useEffect(() => {
    // Show the first calculator if 1 to 3 calculators are found
    if (filteredCalculators.length > 0 && filteredCalculators.length <= 3) {
      //filteredCalculators.length === 1 || filteredCalculators.length === 3 || filteredCalculators.length === 2
      setShowTabs(false);
      setSelectedTab(filteredCalculators[0]);
    }
  }, [filteredCalculators]);

  const renderCalculator = useCallback(
    (bankName) => {
      switch (bankName) {
        case "BmwBank":
          return (
            <BMWFinancingCalculator
              vehicleDetails={vehicleDetails}
              bankName={bankName}
              currency={currency}
            />
          );
        case "BmwFinancial":
          return (
            <BMWFinancialLeasingTypeFinancingCalculator
              vehicleDetails={vehicleDetails}
              bankName={bankName}
              currency={currency}
            />
          );
        case "SantanderAustria":
        case "Santander":
        case "Bdk":
          return (
            <BDKFinancingCalculator
              vehicleDetails={vehicleDetails}
              bankName={bankName}
              currency={currency}
            />
          );
        case "RenaultBank":
        case "Bank11":
          return (
            <RenaultOrBank11FinancingCalculator
              vehicleDetails={vehicleDetails}
              financialCalculatorSettings={financialCalculatorSettings}
            />
          );
        default:
          return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vehicleDetails, currency, currencySymbol, financialCalculatorSettings],
  );
  if (!financialCalculators) return null;
  if (!financialCalculatorSettings || financialCalculatorSettings?.length === 0)
    return null;
  if (selectedTab === "VwBank") return null; // hide Vw bank as no such calculator found on live domains
  const hasFinancingOrLeasingOptions =
    Object.keys(financingOptions)?.length > 0 ||
    Object.keys(leasingOptions)?.length > 0;

  if (
    (financialCalculators?.[0] === "SantanderAustria" ||
      financialCalculators?.[0] === "Santander") &&
    !hasFinancingOrLeasingOptions
  )
    return null;

  if (calculatorWithManufacturerIds && !manufacturerWithCalculator) {
    return (financialCalculatorSettings = []);
  }
  if (
    filteredCalculators?.length === 1 &&
    filteredCalculators?.[0] === "BmwFsApi"
  )
    return null;
  // If no financing or leasing options found, dont show calc.
  if (!hasFinancingOrLeasingOptions) return null;

  return filteredCalculators?.length ? (
    <section className="mt-7 max-md:mt-5">
      <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2">
        <div
          className={`${getEdgeClass(edge, "rounded-[20px]")} bg-[var(--white-shade)] p-7 max-md:p-4`}
        >
          <h3 className="text-[var(--primary-dark-color)] max-md:text-lg font-semibold text-2xl pb-2 relative after:h-[2px] after:max-w-[70px] after:w-full after:contents-[] after:absolute after:bottom-0 after:left-0 after:bg-[var(--primary-dark-color)]">
            {t("/vehicleDetails.Financing & Leasing")}
          </h3>
          <div className="mt-7">
            {showTabs && filteredCalculators?.length > 1 && (
              <div className="flex space-x-4 mb-4">
                {filteredCalculators?.map((bankName) => (
                  <div
                    key={bankName}
                    className="rounded-[20px] bg-white p-7 max-md:p-4"
                  >
                    <h3
                      className={`inline-block w-full p-4 border-[0px] border-b-[1px] border-solid ${
                        selectedTab === bankName
                          ? "text-[var(--primary-dark-color)] border-b-[3px] font-semibold"
                          : "border-[var(--gray-color)]"
                      } w-full max-md:p-3`}
                      onClick={() => setSelectedTab(bankName)}
                    >
                      {bankName}
                    </h3>
                    <div className="mt-7"></div>
                  </div>
                ))}
              </div>
            )}
            <div className="overflow-auto">{renderCalculator(selectedTab)}</div>
          </div>
        </div>
      </div>
    </section>
  ) : null;
};

export default VehicleFinancingAndLeasing;
