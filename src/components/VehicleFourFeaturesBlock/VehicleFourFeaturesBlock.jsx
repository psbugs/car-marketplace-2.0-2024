import { useDispatch, useSelector } from "react-redux";
import { downloadPdf } from "../../redux/VehiclesSlice";
import CustomDropdown from "../Dropdown/Dropdown";
import { useFavorites } from "../../hooks/useFavorites";
import { useCompares } from "../../hooks/useCompares";
import { toast } from "react-toastify";
import Preloader from "../Preloader";
import { useTranslation } from "react-i18next";
import SVGSelector from "../common-components/SVGSelector";

const VehicleFourFeaturesBlock = ({ vehicleDetails, isFavoritesPage }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  let options = ["E-mail", "Facebook", "X/Twitter", "Copy URL"];
  options = options.map((item) => t(`/vehicleDetails.${item}`));
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isComparable, toggleComparison } = useCompares();
  const { loading } = useSelector((state) => state.vehicles);
  const { uiConfigData = false } =
    useSelector((state) => state?.uiConfig) || {};
  const features = uiConfigData?.features;
  const styledListItemClass =
    "flex-auto flex items-center gap-2 max-md:gap-1 cursor-pointer";
  return (
    <div className="mt-6">
      {loading && <Preloader />}
      <ul
        className={`flex ${
          isFavoritesPage
            ? "gap-8 max-md:gap-2 max-[280px]:flex-col"
            : "gap-2 max-[280px]:flex-col"
        } text-[var(--davy-gray-color)] text-sm max-md:text-[12px] ${
          !isFavoritesPage ? "border-t border-b border-[var(--gray-color)]" : ""
        } py-[6px]`}
      >
        {features && features?.includes("Favorites") ? (
          <li
            className={`${styledListItemClass} ${
              isFavorite(vehicleDetails?.id)
                ? "font-bold text-[var(--primary-dark-color)]"
                : "font-medium"
            }`}
            onClick={() => toggleFavorite(vehicleDetails?.id)}
          >
            <SVGSelector
              name="heart-svg"
              pathFill={
                isFavorite(vehicleDetails?.id)
                  ? "var(--primary-dark-color)"
                  : "none"
              }
              pathStroke={
                isFavorite(vehicleDetails?.id)
                  ? "var(--primary-dark-color)"
                  : "var(--davy-gray-color)"
              }
              svgWidth={16}
              svgHeight={16}
            />
            {t("/vehicleDetails.Favorite")}
          </li>
        ) : null}
        {features && features?.includes("Comparison") ? (
          <li
            className={`${styledListItemClass} ${
              isComparable(vehicleDetails?.id)
                ? "font-bold text-[var(--primary-dark-color)]"
                : "font-medium"
            }`}
            onClick={() => toggleComparison(vehicleDetails?.id)}
          >
            <SVGSelector
              name="compare-svg"
              pathFill={
                isComparable(vehicleDetails?.id)
                  ? "var(--primary-dark-color)"
                  : "none"
              }
              pathStroke={
                isComparable(vehicleDetails?.id)
                  ? "var(--primary-dark-color)"
                  : "var(--davy-gray-color)"
              }
              svgWidth={16}
              svgHeight={16}
            />
            {t("/vehicleDetails.Compare")}
          </li>
        ) : null}
        <li className={`${styledListItemClass} relative custom-dropdown-class`}>
          <CustomDropdown
            label={t("/vehicleDetails.Share")}
            options={options}
            vehicleId={vehicleDetails?.id}
            icon={<SVGSelector name="share-svg" />}
          />
        </li>
        <li
          className={`${styledListItemClass} font-medium`}
          onClick={() => {
            dispatch(downloadPdf(vehicleDetails?.id))
              .unwrap()
              .then((data) => {
                if (data) {
                  const file = new Blob([data], { type: "application/pdf" });
                  const fileURL = URL.createObjectURL(file);
                  const link = document.createElement("a");
                  link.href = fileURL;
                  link.download = `${vehicleDetails?.manufacturer?.name}${vehicleDetails?.model?.name}.pdf`;
                  link.click();
                  toast.success(
                    `${t("/vehicleDetails.File downloaded successfully")}`,
                  );
                } else {
                  toast.error(
                    `${t(
                      "/vehicleDetails.Something went wrong! Please try downloading again!",
                    )}`,
                  );
                }
              });
          }}
        >
          <SVGSelector name="pdf-expose-svg" />
          {t("/vehicleDetails.PDF-Expose")}
        </li>
      </ul>
    </div>
  );
};
export default VehicleFourFeaturesBlock;
