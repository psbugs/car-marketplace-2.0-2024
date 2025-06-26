import { useTranslation } from "react-i18next";
import SVGSelector from "../common-components/SVGSelector";
const FuelInformationSection = () => {
  const { t } = useTranslation();
  return (
    <div
      className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2 pt-2"
      id="information-footer-section"
    >
      <div className="my-4 max-md:mt-8">
        <div className="flex gap-4 max-md:flex-col">
          <div className="w-[80%] text-[var(--davy-gray-color)] text-xs space-y-5 max-md:w-full py-10">
            <p>
              {" "}
              <SVGSelector name={"i-svg"} /> 
              {t("/vehicleDetails.VAT reportable")}
            </p>
            <p>
              <SVGSelector name={"ii-svg"} /> {" "}
              {t("/.FuelConsumptionInformation2")} :{" "}
              <a
                href="https://www.dat.de/co2/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.dat.de/co2/.
              </a>
            </p>

            <p>
              <SVGSelector name={"iii-svg"} /> 
              {t("/vehicleDetails.Mandatory field")}
            </p>
            <p>{t("/vehicleDetails.Legal notice")}</p>
            <p>
              {t(
                "/vehicleDetails.All information is non-binding. Errors and omissions excepted.",
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FuelInformationSection;
