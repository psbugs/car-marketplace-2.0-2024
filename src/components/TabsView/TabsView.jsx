import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { priceValue } from "../../constants/common-constants";
import { useTranslation } from "react-i18next";
import BuyingTabView from "./BuyingTabView";
import FinanceTabView from "./FinanceTabView";
import LeasingTabView from "./LeasingTabView";
import { useSearchParams } from "react-router-dom";
import { getEdgeClass } from "../../utils";

const TabsView = ({ vehicleDetails, vehicleId, scrollToCalculator }) => {
  const { t } = useTranslation();
  const { uiConfigData = false, edge = false } =
    useSelector((state) => state?.uiConfig) || {};
  const { i18n } = uiConfigData || {};
  const { currencySymbol = false, locales = false } = i18n || {};
  const currency = { currencySymbol, locale: locales?.[0] };
  let [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const updatedParams = new URLSearchParams(searchParams);

  let TABS = [
    { name: t("/vehicleDetails.Buying"), disabled: false },
    {
      name: t("/vehicleDetails.Leasing"),
      disabled: !vehicleDetails?.leasingOptions?.length,
    },
    {
      name: t("/vehicleDetails.Finance"),
      disabled: !vehicleDetails?.financingOptions?.length,
    },
  ];

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const firstEnabledTabIndex = TABS.findIndex((tab) => !tab.disabled);
    setActiveTab(firstEnabledTabIndex !== -1 ? firstEnabledTabIndex : 0);
    // eslint-disable-next-line
  }, [vehicleId]);

  useEffect(() => {
    if (tab) {
      setActiveTab(tab === "leasing" ? 1 : tab === "financing" ? 2 : 0);
    }
  }, [tab]);

  const handleTabClick = (index) => {
    if (tab) {
      updatedParams.delete("tab");
      setSearchParams(updatedParams);
    }
    if (!TABS[index]?.disabled) {
      setActiveTab(index);
    }
  };

  const TabButton = ({ index, tab, isActive }) => (
    <li className={`${index !== 2 && "me-2"}`} role="presentation">
      <button
        className={`${getEdgeClass(edge, "rounded-full")} inline-block p-2 w-full max-md:text-xs ${
          isActive ? "primary-bg-color text-white" : "bg-white primary-color"
        } ${tab?.disabled ? "cursor-not-allowed opacity-20" : ""}`}
        id={`${tab?.name}-styled-tab`}
        onClick={() => handleTabClick(index)}
        type="button"
        role="tab"
        aria-controls={`styled-${tab?.name}`}
        aria-selected={isActive}
        disabled={tab?.disabled}
      >
        {tab?.name}
      </button>
    </li>
  );

  const TabPanel = ({ index, children }) => (
    <div
      className={`${getEdgeClass(edge)} ${activeTab === index ? "" : "hidden"}`}
      id={`styled-${TABS[index]?.name}`}
      role="tabpanel"
      aria-labelledby={`${TABS[index]?.name}-styled-tab`}
    >
      {children}
    </div>
  );

  const priceDetails = priceValue({
    consumerPrice: vehicleDetails?.consumerPrice,
    campaignPriceMarket: vehicleDetails?.campaignPriceMarket,
    uiConfigData,
  });
  return (
    <div>
      <div
        className={`mb-4 border primary-color p-1 ${getEdgeClass(edge, "rounded-full")}`}
      >
        <ul
          className="grid grid-cols-3 text-center font-semibold text-sm"
          id="default-styled-tab"
          role="tablist"
        >
          {TABS.map((tab, index) => (
            <TabButton
              key={index}
              index={index}
              tab={tab}
              isActive={activeTab === index}
            />
          ))}
        </ul>
      </div>
      <div id="default-styled-tab-content">
        <TabPanel index={0}>
          <BuyingTabView
            vehicleDetails={vehicleDetails}
            priceDetails={priceDetails}
            currency={currency}
          />
        </TabPanel>
        <TabPanel index={1}>
          <LeasingTabView
            vehicleDetails={vehicleDetails}
            priceDetails={priceDetails}
            currency={currency}
            scrollToCalculator={scrollToCalculator}
          />
        </TabPanel>
        <TabPanel index={2}>
          <FinanceTabView
            vehicleDetails={vehicleDetails}
            priceDetails={priceDetails}
            currency={currency}
            scrollToCalculator={scrollToCalculator}
          />
        </TabPanel>
      </div>
    </div>
  );
};
export default TabsView;
