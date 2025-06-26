import moment from "moment";
import SVGSelector from "../components/common-components/SVGSelector";
export const getVehicleHighlightsFromConfig = (
  uiConfigData,
  vehicleDetails,
) => {
  const uiConfigHighlightsData =
    uiConfigData?.resultAppearance?.featurePriority?.prioritizedFeatureIds ||
    [];

  const vehicleDataHighlightsData =
    vehicleDetails?.equipment?.feature
      ?.flatMap((feature) => feature?.item ?? [])
      ?.map(({ optionId, title1: title }) => ({ optionId, title })) || [];

  const optionIdToTitleMap = vehicleDataHighlightsData.reduce(
    (acc, { optionId, title }) => {
      if (optionId) {
        acc[optionId] = title;
      }
      return acc;
    },
    {},
  );

  const limitedFilteredData = uiConfigHighlightsData
    ?.filter((id) => optionIdToTitleMap[id])
    ?.slice(0, 5)
    ?.map((id) => optionIdToTitleMap[id]);

  return limitedFilteredData;
};

export const modalOverlayOnAccessories = (isVisible = false) => {
  const accessoriesElement = document.getElementById("itt-sl-ucl");
  const bodyElement = document.body;
  const htmlElement = document.documentElement;

  if (bodyElement) {
    if (isVisible) {
      if (accessoriesElement && accessoriesElement.style) {
        accessoriesElement.style.opacity = "0";
      }
      bodyElement.style.overflowY = "hidden";
      htmlElement.style.overflowY = "hidden";
    } else {
      if (accessoriesElement && accessoriesElement.style) {
        accessoriesElement.style.opacity = "0";
      }
      bodyElement.style.overflowY = "scroll";
      htmlElement.style.overflowY = "scroll";
    }
  }
};
export const scrollToTopFunction = () => {
  setTimeout(() => {
    const shadowRoot = document.querySelector(
      "#am-marketplace #main-container",
    )?.shadowRoot;
    const featuresSection = shadowRoot.querySelector("#features-section");
    featuresSection?.scrollIntoView({ behavior: "smooth" });
  }, 1);
};
export const scrollToBottomFunction = (mainContainerId) => {
  const shadowRoot = document.querySelector(
    `#am-marketplace #${mainContainerId}`,
  )?.shadowRoot;
  const footerSection = shadowRoot?.querySelector(
    "#information-footer-section",
  );
  if (footerSection) {
    const footerPosition =
      footerSection?.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: footerPosition - 200,
      behavior: "smooth",
    });
  }
};

export const hideNavWhenModalIsActive = (updatedModalState) => {
  const mainContainer = document.getElementById("main-container");

  if (updatedModalState) {
    // Uncomment to replace all the Elements remove position fixed on modal open.
    // document.querySelectorAll("*")?.forEach((element) => {
    //   if (
    //     element.id !== "am-marketplace" &&
    //     window.getComputedStyle(element).position === "fixed"
    //   ) {
    //     element.dataset.originalPosition = "fixed";
    //     element.style.position = "static";
    //   }
    // });

    // Outside header should not overlap the modals.
    if (mainContainer) {
      mainContainer.dataset.originalZIndex = mainContainer.style.zIndex || "";
      mainContainer.style.zIndex = "10000000";
    }
  } else {
    // Uncomment to replace all the Elements remove position fixed on modal open.
    // document.querySelectorAll("*").forEach((element) => {
    //   if (element.dataset.originalPosition === "fixed") {
    //     element.style.position = "fixed";
    //     delete element.dataset.originalPosition;
    //   }
    // });

    // Outside header should not overlap the modals.
    if (mainContainer && mainContainer.dataset.originalZIndex !== undefined) {
      mainContainer.style.zIndex = mainContainer.dataset.originalZIndex;
      delete mainContainer.dataset.originalZIndex;
    }
  }
};

export const retrieveDropDownOption = (dropdownType, options) => {
  let initialType = null;
  if (dropdownType === "mileage") {
    initialType = "km";
  }
  if (dropdownType === "powerkws") {
    initialType = "kW";
  }
  if (dropdownType === "powerhps") {
    initialType = "PS";
  }
  options = options?.map((eachOption) => {
    return {
      label: `${eachOption} ${initialType}`,
      value: eachOption,
    };
  });
  return options;
};

export const handleCheckboxChange = (
  event,
  searchParams,
  paramsName,
  setSearchParams,
  options = {},
) => {
  // searchParams, //object or params coming from useSearchParams()
  // paramsName, // Name of the parameters i.e manufacturers,  bodies,usageTypes, etc...
  // setSearchParams //  setSearchParams function to set the searchParams given by
  const { singleParam = false } = options;

  let clearAll = paramsName === "clearAll" ? true : false;
  const { value, checked } = event?.target || {};
  const newParams = new URLSearchParams(searchParams);
  const items = newParams.get(paramsName);
  let itemsArray = items?.split('","') || [];
  if (clearAll) {
    const keysToDelete = [];
    newParams.forEach((_, key) => {
      if (
        key !== "view" &&
        key !== "filter-drawer" &&
        key !== "show-vehicles-accordion"
      ) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => newParams.delete(key));
  }
  if (paramsName !== "skip" && newParams.get("skip")) {
    newParams.delete("skip");
  }

  if (paramsName === "variants" || "manufacturers") {
    newParams.delete("modelGroups");
  }
  if (paramsName === "series") {
    newParams.delete("variants");
    newParams.delete("modelGroups");
  }

  if (checked) {
    if (!itemsArray?.includes(value)) {
      itemsArray?.push(value);
    } else {
      itemsArray?.pop();
    }
  } else {
    itemsArray = itemsArray?.filter((item) => item !== value);
  }
  itemsArray = value !== null ? itemsArray.filter((item) => item !== "") : [];
  let formattedItems = "";
  if (!singleParam && value !== "elektro") {
    formattedItems = itemsArray?.length > 0 ? `${itemsArray?.join('","')}` : "";
  } else {
    formattedItems =
      itemsArray?.length > 0 ? itemsArray[itemsArray?.length - 1] : "";
  }
  const queryString = formattedItems ? `${paramsName}=${formattedItems}` : "";
  if (queryString) {
    newParams?.set(paramsName, decodeURIComponent(formattedItems));
  } else {
    newParams?.delete(paramsName);
  }
  setSearchParams(newParams, { replace: true });
  return itemsArray;
};

export const handleVehicleBrandCheckboxChange = (
  manufacturer,
  event,
  searchParams,
  setSearchParams,
) => {
  const { checked } = event.target;
  const newParams = new URLSearchParams(searchParams);
  const currentManufacturer = newParams.get("manufacturers");
  newParams?.delete("promotions");
  newParams?.delete("manufacturers");
  newParams?.delete("othermanufacturers");

  if (checked) {
    if (
      currentManufacturer &&
      currentManufacturer !== manufacturer?.manufacturersId
    ) {
      newParams.delete("variants");
      newParams.delete("series");
      newParams.delete("modelGroups");
      newParams.delete("manufacturersType");
    }
    manufacturer?.manufacturersId === 9999999999
      ? newParams.set("othermanufacturers", true)
      : newParams.set(
          manufacturer?.labelType,
          manufacturer?.manufacturersId ? manufacturer?.manufacturersId : true,
        );
    if (manufacturer?.manufacturersType)
      newParams.set("manufacturersType", manufacturer?.manufacturersType);
  } else {
    newParams.delete(manufacturer?.labelType);
    newParams.delete("manufacturersType");
    newParams.delete("variants");
    newParams.delete("series");
    newParams.delete("modelGroups");
  }
  setSearchParams(newParams);
};

export const handleSelectAll = (
  event,
  searchParams,
  paramsName,
  setSearchParams,
) => {
  const { value: values, checked } = event?.target || {};
  const newParams = new URLSearchParams(searchParams);
  const items = newParams.get(paramsName);

  let itemsArray = items
    ? decodeURIComponent(items)
        .split(",")
        .map((item) => item.replace(/"/g, ""))
    : [];

  const valuesArray = Array.isArray(values) ? values : [values];

  const intersectingItems = valuesArray.filter((value) =>
    itemsArray.includes(value),
  );

  if (checked) {
    if (intersectingItems.length === valuesArray.length) {
      newParams.delete(paramsName);
    } else {
      const remainingItems = valuesArray.filter(
        (value) => !itemsArray.includes(value),
      );
      itemsArray = [...itemsArray, ...remainingItems];
    }
  } else {
    itemsArray = itemsArray.filter((item) => !valuesArray.includes(item));
  }
  itemsArray = itemsArray.filter((item) => item !== "");

  let formattedItems = itemsArray.length > 0 ? `${itemsArray.join('","')}` : "";

  if (formattedItems) {
    newParams.set(paramsName, decodeURIComponent(formattedItems));
  } else {
    newParams.delete(paramsName);
  }
  setSearchParams(newParams, { replace: true });
  return itemsArray;
};

// gives the SVGs for the vehicle options
export const bodyGroupSVGSelector = (key) => {
  switch (key) {
    case "PKW Zulassung":
    case "pkw":
      return <SVGSelector name="pkw-svg" />;
    case "nfz":
      return <SVGSelector name="nfz-svg" />;
    case "mot":
      return <SVGSelector name="mot-svg" />;
    case "Wohnmobile":
      return <SVGSelector name="whonmobile-svg" />;
    case "LKW Zulassung":
      return <SVGSelector name="lkw-zulassung-svg" />;
    case "others":
    default:
      return <SVGSelector name="default-other-body-group-svg" />;
  }
};

export const capitalizeFirstLetter = (str) => {
  return str?.charAt?.(0).toUpperCase() + str?.slice(1)?.toLowerCase();
};

export const extractAndFormatParams = (searchParams, paramName) => {
  let existingParams = [];
  if (searchParams?.has(paramName)) {
    existingParams = searchParams
      ?.get(paramName)
      ?.split(",")
      ?.map((value) => value?.replace(/"/g, ""));
  }
  return existingParams;
};

export const convertNumberFormat = (
  value,
  currency = false,
  roundOff = false,
) => {
  try {
    let numberValue = Number(value);
    if (isNaN(numberValue) || !Number.isFinite(numberValue)) {
      return "0,00";
    }

    if (roundOff) {
      numberValue = Math.round(numberValue);
    } else {
      numberValue = parseFloat(numberValue.toFixed(2));
    }
    const isWholeNumber = numberValue % 1 === 0;

    if (currency?.currencySymbol === "CHF") {
      const formattedCHF = isWholeNumber
        ? numberValue.toFixed(0)
        : numberValue.toFixed(2);
      const swissFormatted = formattedCHF?.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        "'",
      );
      return `CHF ${isWholeNumber ? `${swissFormatted}.-` : swissFormatted}`;
    }

    const options = {
      minimumFractionDigits: isWholeNumber ? 0 : 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    };
    if (currency) {
      options.style = "currency";
      options.currency =
        currency?.currencySymbol !== "€" ? currency?.currencySymbol : "EUR";
      options.currencyDisplay = "symbol";
    }
    return numberValue.toLocaleString(currency?.locale || "de-DE", options);
  } catch {
    return "0,00";
  }
};

export const extractMonthAndYear = (dateStr) => {
  if (typeof dateStr !== "string") {
    return { error: "Invalid input type. Expected a string." };
  }
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) {
    return { error: "Invalid date string format." };
  }
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${month}/${year}`;
};

export const timeFormatterForDropdownOptions = (defaultDate) => {
  const hours = defaultDate?.getHours()?.toString()?.padStart(2, "0");
  const minutes = defaultDate?.getMinutes()?.toString()?.padStart(2, "0");
  return `${hours}:${minutes}`;
};
export const fetchUpdatedCarSummaryData = (
  label,
  value,
  type,
  carSummaryData,
  powerTypeName,
  t, // used to translate
) => {
  let labelPrefix = "";
  let filteredCarSummaryData = [];
  let powerStr = "";
  if (powerTypeName) {
    powerStr = type.split(powerTypeName)?.join(",")?.replaceAll(",", "");
  }
  if (type === "mileageMin") {
    labelPrefix = "Mileage of";
    filteredCarSummaryData = carSummaryData?.filter(
      (item) => !item.label.startsWith("Mileage of"),
    );
  }
  if (type === "mileageMax") {
    labelPrefix = "Mileage upto";
    filteredCarSummaryData = carSummaryData?.filter(
      (item) => !item.label.startsWith("Mileage upto"),
    );
  }
  if (type === "registerDateMin") {
    labelPrefix = "First registered in";
    filteredCarSummaryData = carSummaryData?.filter(
      (item) => !item.label.startsWith("First registered in"),
    );
  }
  if (type === "registerDateMax") {
    labelPrefix = "First registered until";
    filteredCarSummaryData = carSummaryData?.filter(
      (item) => !item.label.startsWith("First registered until"),
    );
  }
  if (type === "priceMin") {
    labelPrefix = "Price from";
    filteredCarSummaryData = carSummaryData?.filter(
      (item) => !item.label.startsWith("Price from"),
    );
  }
  if (type === "priceMax") {
    labelPrefix = "Price upto";
    filteredCarSummaryData = carSummaryData?.filter(
      (item) => !item.label.startsWith("Price upto"),
    );
  }
  if (type === "financingRateMin") {
    labelPrefix = "Financing from";
    filteredCarSummaryData = carSummaryData?.filter(
      (item) => !item.label.startsWith("Financing from"),
    );
  }
  if (type === "financingRateMax") {
    labelPrefix = "Financing up to";
    filteredCarSummaryData = carSummaryData?.filter(
      (item) => !item.label.startsWith("Financing up to"),
    );
  }
  if (type === "leasingRateMin") {
    labelPrefix = "Leasing from";
    filteredCarSummaryData = carSummaryData?.filter(
      (item) => !item.label.startsWith("Leasing from"),
    );
  }
  if (type === "leasingRateMax") {
    labelPrefix = "Leasing up to";
    filteredCarSummaryData = carSummaryData?.filter(
      (item) => !item.label.startsWith("Leasing up to"),
    );
  }
  if (powerTypeName) {
    if (powerTypeName === "Hp") {
      if (powerStr.includes("Min")) {
        labelPrefix = "Power of";
        filteredCarSummaryData = carSummaryData?.filter(
          (item) => !item.label.startsWith("Power of"),
        );
      } else {
        labelPrefix = "Power upto";
        filteredCarSummaryData = carSummaryData?.filter(
          (item) => !item.label.startsWith("Power upto"),
        );
      }
    } else {
      if (powerStr.includes("Min")) {
        labelPrefix = "Output of";
        filteredCarSummaryData = carSummaryData?.filter(
          (item) => !item.label.startsWith("Output of"),
        );
      } else {
        labelPrefix = "Power upto";
        filteredCarSummaryData = carSummaryData?.filter(
          (item) => !item.label.startsWith("Power upto"),
        );
      }
    }
  }
  labelPrefix = t(`/.${labelPrefix}`);
  const newItem = {
    label: `${labelPrefix} ${label}`,
    value,
    [type]: value,
  };
  const updatedCarSummaryData =
    value.trim() === ""
      ? filteredCarSummaryData
      : [...filteredCarSummaryData, newItem];
  return updatedCarSummaryData;
};

export const getIFrameUrl = (data, calcSettings, vehicles) => {
  calcSettings = Array.isArray(calcSettings) ? calcSettings?.[0] : calcSettings;
  if (calcSettings?.calculator === "RenaultBank") {
    let fuel = "&fuelType=0000&engineType=0";
    if (data?.fuel?.id === 1) fuel = "&fuelType=0000&engineType=0";
    if (data?.fuel?.id === 2) fuel = "&fuelType=0000&engineType=0";
    if (data?.fuel?.id === 3) fuel = "&fuelType=0000&engineType=0";
    if (data?.fuel?.id === 4) fuel = "&fuelType=0002&engineType=1";
    if (data?.fuel?.id === 5) fuel = "&fuelType=0001&engineType=2";
    if (data?.fuel?.id === 6) fuel = "&fuelType=0001&engineType=3";
    if (data?.fuel?.id === 8) fuel = "&fuelType=0004&engineType=2";
    if (data?.fuel?.id === 9) fuel = "&fuelType=0001&engineType=4";
    if (data?.fuel?.id === 10) fuel = "&fuelType=0004&engineType=5";
    if (data?.fuel?.id === 15) fuel = "&fuelType=0002&engineType=4";
    if (data?.fuel?.id === 17) fuel = "&fuelType=0004&engineType=4";
    let vehicleType = "G";
    if (data?.previousUsageType?.id === 2 && data?.mileage < 1000)
      vehicleType = "N";
    let url = "https://calc.rcipos.de/kalkulator/#/?rciNetNumber=6418";
    url += "&vehiclePrice=" + data?.consumerPrice?.totalPrice;
    url += "&dealerName=" + calcSettings?.dealerName;
    url += "&dealerEmail=" + calcSettings?.dealerEmail;
    url += "&brand=REN";
    url += "&makeDescription=" + data?.manufacturer?.name;
    if (data?.manufacturer?.id === 243) url += "&makeCode=REN";
    if (data?.manufacturer?.id === 360) url += "&makeCode=DAC";
    if (data?.manufacturer?.id === 238) url += "&makeCode=NIS";
    if (data?.manufacturer?.id === 362) url += "&makeCode=INF";
    url += "&modelDescription=" + data?.model?.name;
    url += "&modelCode=XXX";
    url +=
      "&versionDescription=" +
      (data?.modelExtension || "")?.replace(/&/g, "%26")?.replace(/%/g, "%25") +
      " - " +
      // $translate?.instant("vehicle-data-general-order-number") +
      ": " +
      vehicles?.getOrderNumber();
    url += "&versionCode=unknown";
    url += "&vehicleType=" + vehicleType;
    url += "&priceType=1";
    url += "&accessoriesPrice=0";
    url += "&optionPrice=3";
    url += "&purchaseBattery=false";
    url += "&callingSystem=03";
    url += "&phase=0";
    url += "&proposalType=budget";
    if (!!data?.hsn) {
      url += "&hsn=" + data?.hsn;
    }
    if (!!data?.tsn) {
      url += "&tsn=" + data?.tsn;
    }
    url += fuel;
    if (!!data?.dateOfFirstRegistration)
      url +=
        "&firstRegistrationDate=" +
        data?.dateOfFirstRegistration?.date?.substring(0, 10);
    if (!!data?.mileage) url += "&currentMileage=" + data?.mileage;
    return url;
  } else {
    // case of Bank11
    var url =
      "https://bank11-de.k1net.de/2020/?tx_bank11_kalkulator%5Baction%5D=querformat&tx_bank11_kalkulator%5Bcontroller%5D=Kalkulator";
    url +=
      "&tx_bank11_kalkulator%5Bkalkulator%5D=" + calcSettings?.calculatorId;
    url += "&type=" + calcSettings?.typeId;
    url += "&cHash=" + calcSettings?.hashCode;
    return url;
  }
};

export const setGlobalCSSVariables = (content, theme, symbol) => {
  const darkMode =
    symbol === "CHF"
      ? "dark"
      : localStorage.getItem("market-place-saved-theme") === "dark"
        ? true
        : false;
  const root = document.documentElement;
  const primaryColor = (darkMode ? "#000" : content?.primaryColor) || "#0F74C7";
  const secondaryColor = content?.secondaryColor || "#002441";
  const primaryColor20 = hexToRgb(primaryColor, 0.2);
  const primaryColor10 = hexToRgb(primaryColor, 0.1);

  root.style.setProperty("--primary-color", primaryColor);
  root.style.setProperty(
    "--secondary-color",
    darkMode ? "#ffffff" : secondaryColor,
  );

  root.style.setProperty(
    "--gray-color",
    darkMode ? "#626262" : "var(--white-mid-color)",
  );
  root.style.setProperty("--black-color", "#000000");
  root.style.setProperty("--light-gray-color", "#E1E1E1");
  root.style.setProperty(
    "--whitesmoke-color",
    darkMode ? "#000000" : "#F5F5F5",
  );
  root.style.setProperty(
    "--white-light-smoke-color",
    darkMode ? "#323232" : "#F5F5F5",
  );
  root.style.setProperty("--davy-gray-color", darkMode ? "#ffffff" : "#555555");
  root.style.setProperty(
    "--davy-feature-tab-color",
    darkMode ? "#000000" : "#555555",
  );
  root.style.setProperty(
    "--placeholder-gray-color",
    darkMode ? "#ffffff" : "#cac6c6",
  );
  root.style.setProperty("--white-color", darkMode ? "#323232" : "#ffffff");
  root.style.setProperty("--white-shade", darkMode ? "#161616" : "#ffffff");
  root.style.setProperty("--white-mid-color", darkMode ? "#ffffff" : "#002441");
  root.style.setProperty(
    "--white-dark-shade",
    darkMode ? "#1E1E1E" : "#ffffff",
  );
  root.style.setProperty("--text-dark-mode", darkMode ? "#ffffff" : "#000000");
  root.style.setProperty(
    "--text-black-white",
    darkMode ? "#ffffff" : "#000000",
  );
  root.style.setProperty(
    "--text-white-black",
    darkMode ? "#000000" : "#ffffff",
  );
  root.style.setProperty("--red-color", "#ff0000");
  root.style.setProperty(
    "--primary-color-20",
    darkMode ? "#ffffff" : primaryColor20,
  );
  root.style.setProperty("--primary-color-10", primaryColor10);
  root.style.setProperty(
    "--primary-dark-color",
    darkMode ? "#ffffff" : primaryColor,
  );
  root.style.setProperty(
    "--primary-dark-active-color",
    darkMode ? "#b1b1b1" : primaryColor,
  );
  root.style.setProperty(
    "--primary-black-color",
    darkMode ? "#000000" : primaryColor,
  );
  root.style.setProperty(
    "--white-light-gray-color",
    darkMode ? "#ffffff" : "#323232",
  );

  root.style.setProperty(
    "--black-dark-color",
    darkMode ? "#000000" : "#f8f8f8",
  );

  root.style.setProperty("--primary-color-20-single", primaryColor20);

  root.style.setProperty(
    "--primary-color-single",
    content?.primaryColor || "#0F74C7",
  );
};

const hexToRgb = (hex, per) => {
  let red = 0,
    green = 0,
    blue = 0;
  if (hex.length === 4) {
    red = parseInt(hex[1] + hex[1], 16);
    green = parseInt(hex[2] + hex[2], 16);
    blue = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    red = parseInt(hex[1] + hex[2], 16);
    green = parseInt(hex[3] + hex[4], 16);
    blue = parseInt(hex[5] + hex[6], 16);
  }
  return `rgba(${red}, ${green}, ${blue}, ${per})`;
};

export const languageOptions = (t) => [
  { id: 0, label: "Deutsch", code: "de", ref: "de-DE" },
  { id: 1, label: "English", code: "us", ref: "en-US" },
  { id: 2, label: "Français", code: "fr", ref: "fr-FR" },
  { id: 3, label: "Español", code: "es", ref: "es-ES" },
  { id: 4, label: "Italiano", code: "it", ref: "it-IT" },
  { id: 5, label: "Nederlands", code: "nl", ref: "nl-NL" },
  { id: 6, label: "Deutsch", code: "ch", ref: "de-CH" },
];

export const getMatchingLanguages = ({ locales, t }) => {
  if (!Array.isArray(locales)) {
    console.warn("Expected an array");
    return [];
  }
  locales = locales?.includes("en-US") ? locales : ["en-US", ...locales];

  return languageOptions(t).filter((language) =>
    locales?.includes(language.ref),
  );
};

export const financingDisclaimer = ({ t, nameOfBank }) => `${t(
  "/vehicleDetails.A non-binding financing example from",
)} ${nameOfBank}. 
${t(
  "/vehicleDetails.All prices include any applicable statutory value added tax. As at",
)}  ${extractMonthAndYear(new Date().toISOString())}. 
${t(
  "/vehicleDetails.If the borrower is a consumer, there is a statutory right of withdrawal after conclusion of the contract. According to the loan conditions, there is an obligation to take out fully comprehensive insurance for the vehicle.",
)} `;

export const leasingDisclaimer = ({ t, nameOfBank }) => `${t(
  "/vehicleDetails.A non-binding leasing example from",
)} ${nameOfBank}. 
${t(
  "/vehicleDetails.All prices include any applicable statutory value added tax. As at",
)}  ${extractMonthAndYear(new Date().toISOString())}. 
${t(
  "/vehicleDetails.If the lessee is a consumer, there is a statutory right of withdrawal after conclusion of the contract. According to the leasing conditions, there is an obligation to take out fully comprehensive insurance for the vehicle.",
)} `;

export const generateOptions = (itemsArray, label, currency = false) => [
  { label, value: "" },
  ...(itemsArray || [])?.map((item) => ({
    label: !currency ? `${item.label}` : convertNumberFormat(item, currency),
    value: !currency ? item.value : item,
  })),
];

export const generateYearOptions = (range = 10) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYear; i > currentYear - range; i--) {
    yearOptions.push({ label: i, value: i });
  }
  return yearOptions;
};

export const getEdgeClass = (
  edge,
  roundedClass = "rounded-lg",
  elseCase = "",
) => {
  return edge && edge !== "sharp" ? roundedClass : elseCase;
};

export const keyGenerator = (existing, dataArray, type) => {
  const obfuscate = (input) => {
    return btoa(encodeURIComponent(JSON.stringify(input)));
  };
  const sanitizeArray = (arr) =>
    Array.isArray(arr) ? arr.map((item) => obfuscate(item)) : [];
  if (Array.isArray(existing) && existing.length > 0) {
    return `${type}-${sanitizeArray(existing).join(",")}`;
  }
  return `${type}-${sanitizeArray(dataArray)
    .map((item, index) => `${item}-${index}`)
    .join("-")}`;
};

export const sortedManufacturersList = (
  manufacturersList,
  fixedManufacturers,
) => {
  const existingManufacturersList = Array.isArray(manufacturersList)
    ? manufacturersList
    : [];
  const existingFixedManufacturers = Array.isArray(fixedManufacturers)
    ? fixedManufacturers
    : [];

  if (existingFixedManufacturers?.length === 0) {
    return [...existingManufacturersList];
  }

  const fixedOrderMap = existingFixedManufacturers?.reduce((map, id, index) => {
    if (typeof id !== "undefined" && id !== null) {
      map.set(id, index);
    }
    return map;
  }, new Map());

  return [...existingManufacturersList]?.sort((a, b) => {
    const aId = a?.manufacturersId;
    const bId = b?.manufacturersId;

    const indexA =
      typeof aId !== "undefined" && aId !== null && fixedOrderMap?.has(aId)
        ? fixedOrderMap?.get(aId)
        : Infinity;
    const indexB =
      typeof bId !== "undefined" && bId !== null && fixedOrderMap?.has(bId)
        ? fixedOrderMap?.get(bId)
        : Infinity;

    if (indexA === Infinity && indexB === Infinity) {
      return 0;
    }

    return indexA - indexB;
  });
};

export const getManufacturers = (input, manufacturers) => {
  const output = {};

  if (input?.fixedManufacturersModelGroupTypes && input?.fixedManufacturers) {
    input.fixedManufacturers.forEach((id, index) => {
      const key = `${id}-${input?.fixedManufacturersModelGroupTypes?.[index]}`;
      output[key] = {
        manufacturersId: id,
        manufacturersType: input?.fixedManufacturersModelGroupTypes?.[index],
        labelType: "manufacturers",
      };
      if (input?.manufacturersWithSeries?.includes(id)) {
        output[key].isSeries = true;
        output[key].series = [];
      } else if (input?.manufacturersWithModelGroups?.includes(id)) {
        output[key].isSeries = false;
        output[key].models = [];
      }
    });
  } else {
    input?.fixedManufacturers?.forEach((id, index) => {
      if (input?.manufacturersWithSeries?.includes(id)) {
        const key = `${id}-PKW`;
        output[key] = {
          manufacturersId: id,
          manufacturersType: "PKW",
          labelType: "manufacturers",
          isSeries: true,
          series: [],
        };
      } else if (input.manufacturersWithModelGroups.includes(id)) {
        const key = `${id}`;
        output[key] = {
          manufacturersId: id,
          labelType: "manufacturers",
          isSeries: false,
          models: [],
        };
      } else {
        const key = `${id}`;
        output[key] = {
          manufacturersId: id,
          labelType: "manufacturers",
        };
      }
    });
  }

  Object?.keys(output)?.forEach((key) => {
    const match = manufacturers?.find(
      (manufacturer) =>
        manufacturer?.value === output?.[key]?.manufacturersId?.toString(),
    );
    if (match) {
      output[key].label = match?.label;
    }
  });

  Object?.keys(output)?.forEach((key) => {
    const entry = output[key];
    if (entry?.manufacturersType === "PKW" && entry?.label === "Ford") {
      entry.label = "Ford PKW";
    }
    if (
      entry?.manufacturersType === "MOT" ||
      entry?.manufacturersType === "NFZ"
    ) {
      entry.isSeries = false;
      entry.models = [];
      delete entry?.series;
      if (entry?.manufacturersType === "NFZ" && entry?.label === "Ford") {
        entry.label = "Ford Nutzfahrzeuge";
      }
      if (entry?.manufacturersType === "MOT" && entry?.label === "BMW") {
        entry.label = "BMW Motorrad";
      }
    } else if (
      entry?.manufacturersType === "PKW" ||
      entry?.manufacturersType === "ALL"
    ) {
      entry.series = [];
      entry.isSeries = true;
      delete entry?.models;
      if (
        (entry?.manufacturersType === "PKW" &&
          (entry?.manufacturersId === 220 ||
            entry?.manufacturersId === 227 ||
            entry?.manufacturersId === 461)) ||
        (entry?.manufacturersType === "ALL" &&
          (entry?.manufacturersId === 448 ||
            entry?.manufacturersId === 237 ||
            entry?.manufacturersId === 246 ||
            entry?.manufacturersId === 248 ||
            entry?.manufacturersId === 484 ||
            entry?.manufacturersId === 232 ||
            entry?.manufacturersId === 249 ||
            entry?.manufacturersId === 251))
      ) {
        entry.isSeries = false;
        entry.models = [];
        delete entry.series;
      }
    }
  });

  const ManufacturersList = Object.values(output);
  ManufacturersList.push({
    isActive: true,
    label: "Other manufacturers",
    manufacturersId: 9999999999,
    labelType: "manufacturers",
    isSeries: false,
    models: manufacturers
      ?.filter(
        (res) =>
          res.isActive &&
          !input?.fixedManufacturers?.includes(Number(res?.value)),
      )
      ?.map((manufacturer) => ({
        ...manufacturer,
        manufacturersId: Number(manufacturer.value),
        value: undefined,
        labelType: "manufacturers",
        isSeries: false,
        engines: [],
      }))
      ?.map(({ value, ...rest }) => rest),
  });
  return ManufacturersList;
};

export const formatDate = (date) => {
  return moment(date).format("YYYY-MM-DDTHH:mm:ssZ");
};

export const getTradeInFormYears = () => {
  const endYear = 2025;
  const startYear = 1987;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  );
  return years;
};

export const generateFixedNumbersForTradeInPopup = (itemUpto) => {
  let fixedNumbers = [];
  for (let i = 1; i <= itemUpto; i++) {
    fixedNumbers.push(i);
  }
  return fixedNumbers;
};

export const generateIsoDateStringForTradeInForm = (year, month) => {
  const lastDay = new Date(year, month, 0);

  const now = new Date();

  lastDay?.setHours(
    now?.getHours(),
    now?.getMinutes(),
    now?.getSeconds(),
    now?.getMilliseconds(),
  );

  return lastDay.toISOString();
};

export const getLabel = (name, value, filters, currency, t) => {
  let manufacturersList = [];
  try {
    const persistRoot = localStorage.getItem("persist:root");
    if (persistRoot) {
      const parsedRoot = JSON.parse(persistRoot);
      const criteria = parsedRoot?.criteria;
      if (criteria) {
        manufacturersList = JSON.parse(criteria)?.manufacturersList || [];
      }
    }
  } catch (error) {
    manufacturersList = [];
  }

  if (!Array.isArray(manufacturersList)) {
    manufacturersList = [];
  }

  const engines = [
    ...(manufacturersList
      .filter((manufacturer) => Array.isArray(manufacturer?.series))
      .flatMap((manufacturer) =>
        manufacturer?.manufacturersId === 319
          ? manufacturer?.variants
              ?.filter((variant) => Array.isArray(variant?.engines))
              ?.flatMap((variant) => variant?.engines) || []
          : manufacturer?.series
              ?.filter((series) => Array.isArray(series?.variants))
              ?.flatMap(
                (series) =>
                  series.variants
                    ?.filter((variant) => Array.isArray(variant?.engines))
                    ?.flatMap((variant) => variant?.engines) || [],
              ),
      ) || []),
    ...(manufacturersList
      .find((fil) => fil.manufacturersId === 9999999999)
      ?.models?.filter((model) => Array.isArray(model?.engines))
      ?.flatMap((model) => model.engines) || []),
    ...(manufacturersList
      .filter((manuf) => Array.isArray(manuf?.models))
      .flatMap((manuf) => manuf.models) || []),
  ];
  switch (name) {
    case "locations":
      return filters?.find((filter) => filter.value === value)?.name;
    case "bodies":
    case "bodyGroups":
      return filters?.find((filter) => filter.value === value)?.label;
    case "options":
      for (const category of filters || []) {
        const foundOption = category?.options?.find((opt) =>
          typeof opt?.name !== "string"
            ? opt?.name === Number(value)
            : opt?.name === value,
        );
        if (foundOption) {
          return foundOption?.label;
        }
      }
      return value;
    case "drives":
    case "emissionClasses":
    case "upholsteries":
    case "usageTypes":
    case "fuellings":
    case "transmissions":
    case "manufacturers":
      return filters?.find((filter) =>
        typeof filter.value !== "string"
          ? filter.value === Number(value)
          : filter.value === value,
      )?.label;
    case "variants":
    case "series":
      return JSON.parse(localStorage.getItem(name))?.[0]?.label;
    case "modelGroups":
      return engines?.find((eng) => eng.value === value)?.label;
    case "paints":
    case "interiorColors":
      return filters?.find((filter) => filter.value === value)?.label;
    case "priceMin":
    case "priceMax":
    case "financingRateMin":
    case "financingRateMax":
    case "leasingRateMin":
    case "leasingRateMax":
      return convertNumberFormat(value, currency);
    case "mileageMin":
    case "mileageMax":
      return `${value} km`;
    case "powerHpMin":
    case "powerHpMax":
      return `${value} ${t("/vehicles.HP")}`;
    case "powerKwMin":
    case "powerKwMax":
      return `${value} kW`;
    default:
      return value;
  }
};
