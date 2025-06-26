import React from "react";
import ReactDOM from "react-dom";
import MainFilterSection from "../components/Filters/MainFilterSection";

const PxcSearchPortal = () => {
  const filterContainer = document.getElementById("filter-root");
  const redirectUrl = filterContainer.getAttribute("data-redirect-url");

  if (filterContainer) {
    return ReactDOM.createPortal(
      <div className="bg-[var(--whitesmoke-color)]">
        <MainFilterSection redirectUrl={redirectUrl} />
      </div>,
      filterContainer,
    );
  }

  return null;
};

export default PxcSearchPortal;
