import React, { useState } from "react";
import FilledButton from "../common-components/FilledButton";
import SaveSearchRequestForm from "../SaveSearchRequestForm";
import { useTranslation } from "react-i18next";

const NoVehicleFound = () => {
  const [isShowSearchReqPopup, setShowSearchReqPopup] = useState(false);
  const { t } = useTranslation();
  const showSearchRequestHandler = () => {
    setShowSearchReqPopup(!isShowSearchReqPopup);
  };

  return (
    <>
      <section className="mt-8 bg-[var(--primary-color-20)] py-10">
        <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2">
          <div className="flex justify-center items-center flex-col text-center">
            <h4 className="text-[28px] mb-4 font-semibold">
              {t("/.Ed no vehicles were found")}
            </h4>
            <p className="text-base text-[var(--davys-gray-color)]">
              {t(
                "/.We will be happy to inform you by email as soon as new vehicles with your search criteria are available. Set up a free search request now.",
              )}
            </p>
            <FilledButton
              title={t("/.Save search request")}
              classnames={""}
              onClick={showSearchRequestHandler}
            />
          </div>
        </div>
      </section>
      {isShowSearchReqPopup && (
        <SaveSearchRequestForm
          closeSearchRequestPopupHandler={showSearchRequestHandler}
        />
      )}
    </>
  );
};

export default NoVehicleFound;
