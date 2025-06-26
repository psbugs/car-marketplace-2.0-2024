import { useLocation } from "react-router-dom";
import { useMemo } from "react";

const useExtractSearchParams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const individualParams = [
    "manufacturers",
    "modelGroups",
    "bodies",
    "modelExt",
    "fuellings",
    "drives",
    "transmissions",
    "usageTypes",
    "emissionClasses",
    "vatdeductible",
    "qualityseal",
    "metallic",
    "locations",
    "options",
    "powerType",
    "offerId",
    "number",
    "paints",
    "bodyGroups",
    "upholsteries",
    "interiorColors",
    "promotions",
    "skip",
    "pageLayout",
    "variants",
    "series",
    "manufacturersType",
    "mileageMin",
    "mileageMax",
    "registerDateMin",
    "registerDateMax",
    "priceMin",
    "priceMax",
    "financingRateMin",
    "financingRateMax",
    "leasingRateMin",
    "leasingRateMax",
    "powerHpMin",
    "powerHpMax",
    "powerKwMin",
    "powerKwMax",
    "horsepowermin",
    "horsepowermax",
    "powermin",
    "powermax",
    "othermanufacturers",
  ];

  const multipleParams = new Set([
    "modelGroups",
    "bodies",
    "fuellings",
    "transmissions",
    "usageTypes",
    "emissionClasses",
    "locations",
    "options",
    "powerType",
    "offerId",
    "paints",
    "bodyGroups",
    "upholsteries",
    "interiorColors",
    "variants",
    "series",
    "manufacturersType",
    "models",
    "modelExt",
    "drives",
  ]);

  const transformToArray = (value) =>
    value ? value.split(",").map((s) => s.replace(/"/g, "")) : false;

  const renameParams = (params, keyMap) => {
    Object?.entries(keyMap)?.forEach(([oldKey, newKey]) => {
      if (params[oldKey] !== undefined) {
        params[newKey] = params[oldKey];
        delete params[oldKey];
      }
    });
  };

  const extractedParams = useMemo(() => {
    const params = {};

    individualParams.forEach((key) => {
      const paramValue = searchParams.get(key) || false;
      params[key] = multipleParams.has(key)
        ? transformToArray(paramValue)
        : paramValue;
    });
    if (params.qualityseal) {
      params["hasqualityseal"] = params.qualityseal;
    }

    renameParams(params, {
      powerKwMin: "powermin",
      powerKwMax: "powermax",
      powerHpMin: "horsepowermin",
      powerHpMax: "horsepowermax",
      registerDateMin: "registermin",
      registerDateMax: "registermax",
      offerId: "number",
    });

    return params;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return extractedParams;
};

export default useExtractSearchParams;
