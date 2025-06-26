import { useState } from "react";
import {
  getDataFromTransferCode,
  updateTransferCodeGeneratedData,
} from "../../redux/TransferCodeSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Preloader from "../Preloader";
import { useTranslation } from "react-i18next";
import SVGSelector from "../common-components/SVGSelector";
import { getEdgeClass } from "../../utils";
import SuccessMessageTextBox from "../SuccessToastMessageBox/SuccessToastMessageBox";
import ErrorToastMessageBox from "../ErrorToastMessageBox";

const EnterTransferCodeModal = ({
  isVisible,
  handleModalToggle,
  loadTitleText,
  restoreOptionText,
}) => {
  const [transferCode, setTransferCode] = useState("");
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { edge = false } = useSelector((state) => state?.uiConfig) || {};

  // Handles transfer code input field
  const handleChange = (event) => {
    event.preventDefault();
    setTransferCode(event.target.value.toUpperCase());
  };

  // Submits the transfer code, fetches data based on the selected scope ("favorites" or "comparison"), updates the state with the results, and displays a success or error toast message.
  const handleSubmit = () => {
    setIsLoading(true);
    let scope = restoreOptionText === "Favorites" ? "favorites" : "comparison";
    dispatch(getDataFromTransferCode({ transferCode, scope }))
      ?.unwrap()
      .then((res) => {
        setIsLoading(false);
        const dataType = scope === "favorites" ? "favorites" : "comparables";
        dispatch(updateTransferCodeGeneratedData({ items: res, dataType }));
        if (res?.length) {
          toast.success(
            <SuccessMessageTextBox
              primaryText={`${scope} ${t("/favorites.loaded for the entered transfer code")}`}
              secondaryTextLines={[
                `${t("/favorites.Number of loaded vehicles")}: ${res?.length}`,
              ]}
            />,
            {
              className: `loaded-vehicles-by-transfer-code-toast-class ${getEdgeClass(edge, "!rounded-lg", "!rounded-none")}`,
              icon: <SVGSelector name="checkmark-transfer-code-svg" />,
            },
          );
        } else
          toast.error(
            <ErrorToastMessageBox
              primaryText={
                scope === "favorites"
                  ? `${t("/favorites.No favorites found for the entered transfer code")}!`
                  : `${t("/favorites.No comparables found for the entered transfer code")}!`
              }
            />,
            {
              className: `wrong-transfer-code-toast-class ${getEdgeClass(edge, "!rounded-lg", "!rounded-none")}`,
              icon: <SVGSelector name="exclaimation-transfer-code-svg" />,
            },
          );
      })
      .catch((e) => console.error(e));
    handleModalToggle();
    setTransferCode("");
  };

  return (
    <div>
      {isLoading && <Preloader />}
      <div
        tabIndex="-1"
        aria-hidden="true"
        className={`${
          isVisible ? "flex" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed  bg-[#0000005e] h-full top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-[850px] max-h-full">
          <div
            className={`${getEdgeClass(edge)} relative bg-[var(--white-shade)] shadow`}
          >
            <div
              className={`${getEdgeClass(edge, "rounded-t")} flex items-center justify-between p-4 md:p-5 border-b`}
            >
              <h3 className="text-[28px] font-semibold max-md:text-xl text-[var(--text-black-white)]">
                {loadTitleText}
              </h3>
              <button
                type="button"
                className={`${getEdgeClass(edge)} text-sm w-8 h-8 ms-auto inline-flex justify-center items-center`}
              >
                <SVGSelector
                  name="cross-svg"
                  svgHeight={16}
                  svgWidth={16}
                  pathStroke={"var(--secondary-color)"}
                  onClick={() => {
                    handleModalToggle();
                    setTransferCode("");
                  }}
                />
              </button>
            </div>
            <div className="p-4 md:p-5 ">
              <input
                type="text"
                className={`${getEdgeClass(edge, "rounded-md")} border border-[var(--gray-color)] max-w-[390px] p-3 text-[var(--gray-color)] text-sm focus:outline-none font-medium px-3 py-3 h-[48px] w-full text-center max-md:max-w-full placeholder-capitalize-value-uppercase`}
                placeholder={t("/favorites.Enter Transfer Code")}
                value={transferCode}
                onChange={handleChange}
              />
              <div className="space-y-4">
                <p className="text-base text-[var(--davy-gray-color)] mt-4 max-md:text-xs">
                  {` ${t(
                    "/favorites.If you generated a transfer code at another workstation, you can enter it here to restore your",
                  )} ${restoreOptionText}.`}
                </p>
              </div>
              <div className="flex items-center  mt-9">
                <button
                  onClick={handleSubmit}
                  type="button"
                  disabled={!transferCode?.length || isLoading}
                  className={`${getEdgeClass(edge, "rounded-[4px]")} block ml-auto text-base py-[10px] border px-8 max-md:text-sm max-md:px-4 ${
                    !transferCode?.length
                      ? "bg-gray-400 text-white border-gray-400 cursor-not-allowed"
                      : "bg-[var(--primary-dark-color)] text-[var(--text-white-black)] hover:text-[var(--text-black-white)] hover:bg-[var(--text-white-black)]"
                  }`}
                >
                  {loadTitleText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EnterTransferCodeModal;
