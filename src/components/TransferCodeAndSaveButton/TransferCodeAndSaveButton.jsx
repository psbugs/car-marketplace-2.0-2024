import { generateTransferCode } from "../../redux/TransferCodeSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Preloader from "../Preloader";
import { useTranslation } from "react-i18next";
import SVGSelector from "../common-components/SVGSelector";
import { getEdgeClass } from "../../utils";
import ErrorToastMessageBox from "../ErrorToastMessageBox";

const TransferCodeAndSaveButton = ({
  handleModalToggle,
  favVehicleIdsArr,
  comparableVehicleIdsArr,
}) => {
  const { search } = useLocation();
  const { edge = false, uiConfigData = false } =
    useSelector((state) => state?.uiConfig) || {};
  const features = uiConfigData?.features;
  const queryParams = new URLSearchParams(search);
  const view = queryParams.get("view");
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [generatedTransferCode, setGeneratedTransferCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handles transfer code generation, updates state, and displays a toast with the result or error message.
  const handleTransferCodeGeneration = (scope, data) => {
    setIsLoading(true);
    dispatch(generateTransferCode({ data, scope }))
      ?.unwrap()
      .then((res) => {
        setIsLoading(false);
        if (res) {
          setGeneratedTransferCode(res);
          toast.dismiss();
          toast(
            <div className="relative flex gap-6 items-center max-md:gap-2">
              <div>
                <div className="flex items-center gap-2 max-sm:flex-wrap max-sm:gap-0">
                  <h4 className="text-[#009640] text-[32px] max-md:text-2xl font-semibold py-2 max-sm:text-[18px] max-sm:pb-0">
                    “{res}”
                  </h4>
                  <p className="text-[var(--davy-feature-tab-color)] max-md:text-sm max-sm:text-xs">
                    {t("/vehicleComparison.is your transfer code")}
                  </p>
                </div>
                <p className="max-md:text-sm text-black max-sm:text-xs">
                  {t("/vehicleComparison.Transfer code saved successfully!")}
                </p>
              </div>
            </div>,
            {
              className: `transfer-code-generated-toast-class ${getEdgeClass(edge, "!rounded-lg", "!rounded-none")}`,
              icon: <SVGSelector name="transfer-code-svg" />,
              autoClose: false,
              closeOnClick: true,
              hideProgressBar: true,
            },
          );
        } else
          toast.error(
            <ErrorToastMessageBox
              primaryText={`${t("/favorites.Unable to generate transfer code at the moment")}!`}
            />,
            {
              className: `wrong-transfer-code-toast-class ${getEdgeClass(edge, "!rounded-lg", "!rounded-none")}`,
              icon: <SVGSelector name="exclaimation-transfer-code-svg" />,
            },
          );
      })
      .catch((e) => {
        setIsLoading(false);
        toast.error(e.message);
      });
  };
  return (
    <div>
      {isLoading && <Preloader />}
      <div className="flex justify-between items-center max-md:flex-col">
        {features?.includes("TransferCode") ? (
          <button
            onClick={handleModalToggle}
            className={`${getEdgeClass(edge, "rounded-md")} max-w-max text-lg group py-[10px] w-2/4 text-center gap-[10px] flex item px-6 justify-center border-[var(--primary-dark-color)]  border text-[var(--primary-dark-color)]  max-md:text-sm max-md:px-3 max-md:max-w-full max-md:w-full max-md:mt-0  hover:text-[var(--text-white-black)]  hover:bg-[var(--primary-dark-color)]`}
          >
            {t("/vehicleComparison.Enter Transfer Code")}
          </button>
        ) : null}
        <div className="flex-auto justify-end flex  max-md:w-full max-md:flex-col-reverse max-md:gap-3">
          {generatedTransferCode ? (
            <div
              className={`${getEdgeClass(edge, "rounded-md")} hidden flex items-center bg-[var(--white-shade)]  px-2 mr-6 text-center justify-center max-lg:mr-0`}
            >
              <h4 className="text-[#009640] text-[32px] font-semibold mr-2">
                "{generatedTransferCode}"
              </h4>
              <p className="text-[var(--davy-gray-color)]">
                {t("/vehicleComparison.is your transfer code")}
              </p>
            </div>
          ) : null}
          {view === "favorites" && favVehicleIdsArr?.length ? (
            <button
              className={`${getEdgeClass(edge, "rounded-md")} max-w-[256px] text-lg group py-[10px] w-2/4 text-center gap-[10px] flex item px-6 justify-center border-[var(--primary-dark-color)]  border text-[var(--primary-dark-color)] border max-md:mt-4 max-md:text-sm max-md:px-3 max-md:w-full max-md:max-w-full  hover:text-[var(--text-white-black)] hover:bg-[var(--primary-dark-color)]`}
              onClick={() =>
                handleTransferCodeGeneration("favorites", favVehicleIdsArr)
              }
              disabled={isLoading}
            >
              {t("/vehicleComparison.Save Favorites")}
            </button>
          ) : null}
          {view === "vehicle-comparison" && comparableVehicleIdsArr?.length ? (
            <button
              className={`${getEdgeClass(edge, "rounded-md")} max-w-[256px] text-lg group py-[10px] w-2/4 text-center gap-[10px] flex item px-6 justify-center border-[var(--primary-dark-color)]  border text-[var(--primary-dark-color)] border max-md:mt-4 max-md:text-sm max-md:px-3 max-md:w-full max-md:max-w-full hover:text-[var(--text-white-black)]  hover:bg-[var(--primary-dark-color)]`}
              onClick={() =>
                handleTransferCodeGeneration(
                  "comparison",
                  comparableVehicleIdsArr,
                )
              }
              disabled={isLoading}
            >
              {t("/vehicleComparison.Save Comparison")}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default TransferCodeAndSaveButton;
