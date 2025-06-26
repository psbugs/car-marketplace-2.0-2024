import Features from "../../components/Features";
import CurrentOffers from "../../components/CurrentOffers";
import MainFilterSection from "../../components/Filters";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { uiConfigAll } from "../../redux/UiConfigurationSlice";
import { criteriaAll } from "../../redux/CriteriaSlice";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import MainManufacturer from "../../components/Manufacturers";
import FilterBodies from "../../components/FilterBodies";
import { updateManufactureWithType } from "../../redux/VehiclesSlice";
import { useTranslation } from "react-i18next";

const LandingPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    uiConfigData = false,
    theme = false,
    edge = false,
    loading: uiConfigLoading = false,
  } = useSelector((state) => state?.uiConfig) || {};
  let searchForm = uiConfigData?.searchForm || {};
  const { companyName = false } = theme || {};
  const [configManufacturers, setConfigManufacturers] = useState([]);
  const [validManufactures, setValidManufacturers] = useState([]);
  const { criteriaAll: criteriaAllRes = [], loading: criteriaLoading = false } =
    useSelector((state) => state?.criteria) || {};

  const docTitle = useDocumentTitle();

  // useEffect(() => {
  //   // change the title of a page using custom hook
  //   if (companyName) {
  //     docTitle(`Vehicle Search | ${companyName}`);
  //   }
  // }, [companyName, docTitle]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUiConfigurationAllData();
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (configManufacturers?.length > 0) {
      fetchCriteriaAllData();
    }
    // eslint-disable-next-line
  }, [configManufacturers]);

  const fetchUiConfigurationAllData = async () => {
    try {
      const manufacturers = uiConfigData?.searchForm?.fixedManufacturers || [];
      setConfigManufacturers(manufacturers);

      await fetchCriteriaAllData();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (uiConfigData === false && !uiConfigLoading) {
      dispatch(uiConfigAll());
    }
  }, [uiConfigData, uiConfigLoading, dispatch]);

  useEffect(() => {
    if (criteriaAllRes?.length === 0 && !criteriaLoading) {
      dispatch(criteriaAll());
    }
  }, [dispatch, criteriaAllRes, criteriaLoading]);

  const fetchCriteriaAllData = async () => {
    if (configManufacturers?.length > 0) {
      try {
        let { fixedManufacturersModelGroupTypes, manufacturersWithSeries } =
          searchForm;
        const allManufacturers = criteriaAllRes?.manufacturers || [];
        let mainOtherManufacturersItems = fetchOtherManufacturersItems(
          allManufacturers,
          configManufacturers,
        );
        const manufacturersObject = allManufacturers.reduce((acc, curr) => {
          acc[curr.value] = curr.label;
          return acc;
        }, {});
        let finalValidManufacturers = configManufacturers.map(
          (configItem, index) => {
            const manufacturerLabel = manufacturersObject[configItem] || "";
            let fixedType = fixedManufacturersModelGroupTypes
              ? fixedManufacturersModelGroupTypes[index]
              : "";
            if (
              manufacturersWithSeries &&
              manufacturersWithSeries?.includes(configItem)
            ) {
              fixedType = "PKW";
            }
            let updatedObj = {
              manufactureId: configItem,
              label: manufacturerLabel,
              imageName: manufacturerLabel?.toLowerCase() + ".png",
              isActive: true,
              value: manufacturerLabel.toLowerCase(),
              imageHoverPath: manufacturerLabel.toLowerCase() + "_side.png",
              category: "manufacturers",
              manufacturerType: fixedType,
            };
            if (fixedType === "NFZ") {
              updatedObj = {
                manufactureId: configItem?.toString(),
                label: `${manufacturerLabel} Nutzfahrzeuge`,
                imageName: "vw_nutzfahrzeuge".toLowerCase() + ".png",
                isActive: true,
                value: `${manufacturerLabel} Nutzfahrzeuge`.toLowerCase(),
                imageHoverPath: "vw_nutzfahrzeuge".toLowerCase() + "_side.png",
                category: "manufacturers",
                manufacturerType: fixedType,
              };
            }
            return updatedObj;
          },
        );
        // Push the other manufacture obj only when container main other manufacturers contains items in them
        if (mainOtherManufacturersItems?.length > 0) {
          finalValidManufacturers.push({
            manufactureId: "",
            label: t("/.Other manufacturers"),
            imageName: "other-manufacturers.png",
            isActive: true,
            value: "other-manufacturers",
            isOtherManufacture: true,
            imageHoverPath: "",
            category: "other-manufacturers",
          });
        }
        setValidManufacturers(finalValidManufacturers);
        dispatch(updateManufactureWithType(finalValidManufacturers));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const fetchOtherManufacturersItems = (
    allManufacturers,
    configManufacturers,
  ) => {
    let mainOtherManufacturers = [];
    let manufactureIds = allManufacturers?.map((item) =>
      item?.value?.toString(),
    );
    let allActiveManufacturers =
      allManufacturers?.filter((item) => item.isActive) || [];
    if (manufactureIds?.length > 0) {
      for (let eachManu of allActiveManufacturers) {
        if (!configManufacturers.includes(parseInt(eachManu.value))) {
          mainOtherManufacturers.push(eachManu);
        }
      }
    }
    return mainOtherManufacturers;
  };

  return (
    <div className={"bg-[var(--whitesmoke-color)]"}>
      <main>
        <Features />
        {criteriaAllRes?.bodies && (
          <FilterBodies bodies={criteriaAllRes?.bodies} edge={edge} />
        )}

        {<MainManufacturer manufacturers={validManufactures} edge={edge} />}

        {Object.keys(uiConfigData)?.length > 0 && (
          <MainFilterSection edge={edge} />
        )}

        {uiConfigData && <CurrentOffers edge={edge} />}
      </main>
    </div>
  );
};
export default LandingPage;
