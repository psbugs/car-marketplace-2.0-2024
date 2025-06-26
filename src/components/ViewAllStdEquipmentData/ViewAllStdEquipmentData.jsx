import ViewAllStdIconAndText from "../ViewAllStdIconAndText";
import { useState } from "react";
import SearchInputField from "../common-components/SearchInputField";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getEdgeClass } from "../../utils";

const ViewAllStdEquipmentData = ({ data }) => {
  const { edge } = useSelector((state) => state?.uiConfig);
  const [searchInput, setSearchInput] = useState("");
  const { t } = useTranslation();
  const searchedEquipmentData = data
    ?.filter((data) => {
      const filteredTitles = data?.title1
        ?.toLowerCase()
        ?.includes(searchInput?.toLowerCase());
      const filteredItems = data?.item?.filter(({ title1 }) =>
        title1?.toLowerCase()?.includes(searchInput?.toLowerCase()),
      );
      return filteredTitles || filteredItems?.length > 0;
    })
    ?.map((data) => {
      return {
        ...data,
        item: data?.item?.filter(({ title1 }) =>
          title1?.toLowerCase()?.includes(searchInput?.toLowerCase()),
        ),
      };
    });

  const filteredEquipmentData = !searchInput ? data : searchedEquipmentData;

  return (
    <div className="relative">
      <div
        className={`sticky top-0 bg-white z-10 ${getEdgeClass(edge, "rounded-[4px]")}`}
      >
        {data?.length ? (
          <SearchInputField
            id={"search-equipment-data"}
            wrapperClassName={"mb-4"}
            spanClassName={"top-3 right-3"}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            placeholder={t("/vehicleDetails.Search equipment data")}
            edgeClass={"rounded-[4px]"}
          />
        ) : null}
      </div>
      {filteredEquipmentData?.length ? (
        <ul className="space-y-5">
          {filteredEquipmentData?.map((a, index) => (
            <li key={index}>
              <h5 className="font-semibold text-[var(--secondary-color)] mb-2 flex items-center gap-4">
                {a?.title1}
              </h5>
              {a?.item?.length ? (
                <div className="grid grid-cols-2 gap-1 text-md max-md:grid-cols-1">
                  {a?.item?.map((item, index) =>
                    item?.title1 ? (
                      <div
                        key={index}
                        className="flex gap-2 p-1 overflow-hidden whitespace-nowrap text-ellipsis"
                      >
                        <ViewAllStdIconAndText htmlText={item?.title1} />
                      </div>
                    ) : null,
                  )}
                </div>
              ) : (
                <div>{t("/vehicleDetails.No matching items")}</div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center">{t("/vehicleDetails.No data found.")}</div>
      )}
    </div>
  );
};

export default ViewAllStdEquipmentData;
