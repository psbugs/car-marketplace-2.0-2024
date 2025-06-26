import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearCarSummaryData } from "../../../redux/CriteriaSlice";
import { useDispatch } from "react-redux";
import SaveSearchRequestForm from "../../SaveSearchRequestForm/SaveSearchRequestForm";
import { useTranslation } from "react-i18next";
import { getEdgeClass } from "../../../utils";

const VehiclesSearchCount = ({ totalVehicles, edge, redirectUrl }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  let dispatch = useDispatch();

  const resetSearchOnClickHandler = () => {
    window.history.replaceState(null, "", "/");
    dispatch(clearCarSummaryData());
  };

  const [isShowSearchRequest, showSaveSearchRequest] = useState(false);

  const addQueryParam = (url, key, value) => {
    const urlObj = new URL(url);
    if (!urlObj.searchParams?.has(key)) {
      urlObj.searchParams?.append(key, value);
    }
    return urlObj;
  };

  const redirectToVehiclesSection = () => {
    const baseUrl = window.location.href;
    const newUrl = addQueryParam(baseUrl, "view", "vehicles");

    if (redirectUrl) {
      const newRedirectUrl = addQueryParam(
        redirectUrl + window?.location?.search,
        "view",
        "vehicles",
      );
      window.location.href = newRedirectUrl?.href;
    } else {
      navigate(newUrl?.search);
    }
  };

  const totalVehiclesOnClickHandler = () => {
    if (totalVehicles === 0) {
      showSaveSearchRequest(true);
    } else {
      redirectToVehiclesSection();
    }
  };

  const searchRequestHandleClick = () => {
    showSaveSearchRequest(!isShowSearchRequest);
  };

  return (
    <div className="flex justify-end gap-2 p-4 pb-9 max-md:pt-0">
      <Link
        onClick={resetSearchOnClickHandler}
        className={`${getEdgeClass(edge, "rounded-md")} bg-white text-lg py-[10px] px-8 primary-color border max-md:text-sm max-md:px-4 hover-bg-primary-color hover:text-white`}
      >
        {t("/.Reset Search")}
      </Link>
      <div
        className={`primary-bg-color text-lg text-white ${getEdgeClass(edge, "rounded-md")} py-[10px] border px-8 max-md:text-sm max-md:px-4 hover-text-primary-color cursor-pointer hover:bg-white hover:text-[var(--primary-black-color)]`}
        onClick={totalVehiclesOnClickHandler}
      >
        {totalVehicles !== 0 && <span>{totalVehicles} </span>}
        {totalVehicles ? t("/.Vehicles") : t("/.Save search request")}
      </div>
      {isShowSearchRequest && (
        <SaveSearchRequestForm
          closeSearchRequestPopupHandler={searchRequestHandleClick}
        />
      )}
    </div>
  );
};

export default VehiclesSearchCount;
