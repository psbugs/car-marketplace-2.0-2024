import React from "react";
import { MANUFACTURER_ASSET_PATH } from "../../constants/common-constants";
import { useTranslation } from "react-i18next";
import { getEdgeClass } from "../../utils";

const ManufacturerBrandList = ({
  manufacturers,
  onBrandClick,
  isSetActiveBorderClass,
  manufactureId,
  showOtherManufacturers,
  manufacType,
  edge,
}) => {
  const { t } = useTranslation();
  return manufacturers?.map((eachManItem, manIndex) => {
    let { isOtherManufacture } = eachManItem;
    let defaultLiClass = `bg-[var(--white-color)] ${getEdgeClass(edge, "rounded-[20px]")} px-[10px] py-5 max-[360px]:w-full flex items-center justify-center max-sm:w-[47%] order-1 border border-[var(--white-color)] cursor-pointer`;
    let defaultImgClass = "w-[130px] h-20 object-contain cursor-pointer";

    if (
      isSetActiveBorderClass &&
      manufactureId === eachManItem?.manufactureId.toString() &&
      manufacType === eachManItem?.manufacturerType
    ) {
      defaultLiClass = `bg-[var(--white-color)] ${getEdgeClass(edge, "rounded-[20px]")}bg-[var(--white-color)]  px-[10px] py-5 max-[360px]:w-full flex items-center justify-center max-sm:w-[47%] order-1 border border-[var(--gray-color)] cursor-pointer`;
    }

    if (
      isSetActiveBorderClass &&
      showOtherManufacturers === eachManItem.isOtherManufacture
    ) {
      defaultLiClass = `bg-[var(--white-color)] ${getEdgeClass(edge, "rounded-[20px]")} px-[10px] py-5 flex items-center justify-center order-1 border primary-color cursor-pointer`;
    }
    if (isOtherManufacture) {
      defaultLiClass += " text-center";
      defaultImgClass += " h-[33px]";
    }
    return (
      <li key={manIndex} className={defaultLiClass}>
        {eachManItem.imageName && (
          <div onClick={() => onBrandClick(eachManItem)}>
            <img
              src={`${MANUFACTURER_ASSET_PATH}${eachManItem.imageName}`}
              alt={eachManItem.label}
              className={defaultImgClass}
            />
            {eachManItem.value === "other-manufacturers" && (
              <p className="font-medium text-[var(--secondary-color)]">
                {t("/.Other")}
                <br />
                {t("/.Manufacturers")}
              </p>
            )}
          </div>
        )}
      </li>
    );
  });
};

export default ManufacturerBrandList;
