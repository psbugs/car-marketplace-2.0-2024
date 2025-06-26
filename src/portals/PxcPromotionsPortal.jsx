import React from "react";
import ReactDOM from "react-dom";
import CurrentOffers from "../components/CurrentOffers";

const PxcPromotionsPortal = () => {
  const promotionContainer = document.getElementById("promotion-root");
  const redirectUrl = promotionContainer.getAttribute("data-redirect-url");

  if (promotionContainer) {
    return ReactDOM.createPortal(
      <div className="bg-[var(--whitesmoke-color)]">
        <CurrentOffers redirectUrl={redirectUrl} />
      </div>,
      promotionContainer,
    );
  }

  return null;
};

export default PxcPromotionsPortal;
