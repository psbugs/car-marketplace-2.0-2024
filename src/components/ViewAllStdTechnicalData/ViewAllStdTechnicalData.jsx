import SearchInputField from "../common-components/SearchInputField";
import { useState } from "react";
import ViewAllStdIconAndText from "../ViewAllStdIconAndText";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getEdgeClass } from "../../utils";

const ViewAllStdTechnicalData = ({ data }) => {
  const [searchInput, setSearchInput] = useState("");
  const { edge } = useSelector((state) => state?.uiConfig);
  const { t } = useTranslation();
  const searchedTechnicalData = data
    ?.filter((data) => {
      const filteredTitles = data?.title
        ?.toLowerCase()
        ?.includes(searchInput?.toLowerCase());

      const filteredItems = data?.item?.filter(({ key, stringValue }) => {
        return (
          key?.toLowerCase()?.includes(searchInput?.toLowerCase()) ||
          stringValue?.toLowerCase()?.includes(searchInput?.toLowerCase())
        );
      });

      return filteredTitles || filteredItems?.length > 0;
    })
    .map((data) => {
      return {
        ...data,
        item: data?.item?.filter(
          ({ key, stringValue }) =>
            key?.toLowerCase()?.includes(searchInput?.toLowerCase()) ||
            stringValue?.toLowerCase()?.includes(searchInput?.toLowerCase()),
        ),
      };
    });

  const filteredTechnicalData = !searchInput ? data : searchedTechnicalData;

  return (
    <div className="relative">
      <div
        className={`sticky top-0 bg-white z-10 ${getEdgeClass(edge, "rounded-[4px]")}`}
      >
        {data ? (
          <SearchInputField
            searchInput={searchInput}
            wrapperClassName={"mb-4"}
            spanClassName={"top-3 right-3"}
            id={"search-technical-data"}
            setSearchInput={setSearchInput}
            placeholder={t("/vehicleDetails.Search technical data")}
            edgeClass={"rounded-[4px]"}
          />
        ) : null}
      </div>
      {filteredTechnicalData?.length ? (
        <ul className="space-y-5 mt-4">
          {filteredTechnicalData?.map(({ title, item }) => (
            <li key={title}>
              <h5 className="font-semibold text-[var(--secondary-color)] mb-4">
                {title}
              </h5>
              {item?.length ? (
                <div className="grid grid-cols-2 gap-1 text-md max-md:grid-cols-1">
                  {item?.map(({ key, stringValue }, index) => (
                    <div
                      key={index}
                      className="flex gap-2 p-1 overflow-hidden whitespace-nowrap text-ellipsis"
                    >
                      <ViewAllStdIconAndText
                        htmlText={`<span>${key}</span>: <span>${stringValue}</span>`}
                      />
                    </div>
                  ))}
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

export default ViewAllStdTechnicalData;
