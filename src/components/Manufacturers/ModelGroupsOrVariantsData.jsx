import React from "react";

const ModelGroupsOrVariantsData = ({
  groupedCarItems,
  selectedCarItems,
  groupedCarOnClickHandler,
}) => {
  return (
    groupedCarItems?.length > 0 &&
    groupedCarItems.map((eachGrpCarItem, eachGrpItemIndex) => {
      const isActive = selectedCarItems.includes(eachGrpCarItem.value);
      // eslint-disable-next-line
      const borderClass = isActive ? "border-2 primary-color" : "";
      return (
        <div
          key={eachGrpItemIndex || Math.random()}
          onClick={
            eachGrpCarItem?.isActive
              ? (event) => groupedCarOnClickHandler(event, eachGrpCarItem)
              : null
          }
          className={
            eachGrpCarItem?.isActive
              ? `rounded-lg bg-[var(--white-color)] cursor-pointer group ${borderClass}`
              : `rounded-lg bg-[var(--white-color)] group opacity-25 cursor-not-allowed`
          }
        >
          <img
            src={eachGrpCarItem.brandImagePath}
            alt={eachGrpCarItem.value}
            className="w-full h-[168px] block object-contain max-md:h-[140px] group-hover:hidden"
          />
          <img
            src={eachGrpCarItem.hoverImagePath}
            alt={eachGrpCarItem.value}
            className="w-full h-[168px] object-contain max-md:h-[140px] hidden group-hover:block"
          />
          <p className="w-full p-4 text-center font-semibold">
            {eachGrpCarItem.label}
          </p>
        </div>
      );
    })
  );
};

export default ModelGroupsOrVariantsData;
