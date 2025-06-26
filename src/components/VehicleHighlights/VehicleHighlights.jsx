import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  getEdgeClass,
  getVehicleHighlightsFromConfig,
} from "../../utils/index";
import SVGSelector from "../common-components/SVGSelector";
import Tooltip from "../common-components/Tooltip";

const VehicleHighlights = ({ vehicleDetails }) => {
  const { t } = useTranslation();
  const { uiConfigData = false, edge = false } =
    useSelector((state) => state?.uiConfig) || {};
  const highlightsFromUIConfig = getVehicleHighlightsFromConfig(
    uiConfigData,
    vehicleDetails,
  );
  const highlights = [
    ...(vehicleDetails?.highlights || []),
    ...(highlightsFromUIConfig || []),
  ];

  return (
    <>
      {highlights?.length ? (
        <section className="mt-8 max-md:mt-5">
          <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2 ">
            <div
              className={`${getEdgeClass(edge, "rounded-[20px]")} bg-[var(--white-shade)] p-7 max-md:p-4`}
            >
              <h3 className="text-[var(--primary-dark-color)] max-md:text-lg font-semibold text-2xl pb-2 relative after:h-[2px] after:max-w-[70px] after:w-full after:contents-[] after:absolute after:bottom-0 after:left-0 after:bg-[var(--primary-dark-color)]">
                {t("/vehicleDetails.Highlights")}
              </h3>
              <div className="mt-7">
                {/* <ul className="grid grid-cols-5 gap-7 max-md:gap-4 max-lg:grid-cols-2 max-md:grid-cols-2 max-sm:grid-cols-1 items-center"> */}
                <ul className="flex flex-wrap gap-7">
                  {highlights?.map((item, index) => (
                    <li key={index}>
                      <div className="flex items-center gap-5 flex-1">
                        <span className="min-w-12 h-12 rounded-full bg-[var(--whitesmoke-color)] flex items-center justify-center max-md:min-w-9 max-md:w-9 max-md:h-9">
                          <SVGSelector name="tick-mark-highlights-svg" />
                        </span>
                        <div className="mt-2">
                          <Tooltip text={item}>
                            <h4 className="text-md font-medium max-md:text-xs text-[var(--secondary-color)] line-clamp-1 break-all">
                              {item}
                            </h4>
                          </Tooltip>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};
export default VehicleHighlights;
