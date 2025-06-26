import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiConfigAll } from "../../redux/UiConfigurationSlice";
import { useNavigate } from "react-router-dom";
// import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import Features from "../../components/Features";
import { useTranslation } from "react-i18next";
import FilledButton from "../../components/common-components/FilledButton";
import SVGSelector from "../../components/common-components/SVGSelector";

const NotFound = () => {
  const dispatch = useDispatch();
  // const docTitle = useDocumentTitle();
  const { t } = useTranslation();
  const {
    uiConfigData = false,
    theme = false,
    loading: uiConfigLoading,
  } = useSelector((state) => state?.uiConfig) || {};
  // const { companyName = false } = theme || {};

  // Change the title of a page using custom hook
  // useEffect(() => {
  //   if (companyName) {
  //     docTitle(`Not found | ${companyName}`);
  //   }
  // }, [companyName, docTitle]);

  // Ui config api call to get theme if not already available.
  useEffect(() => {
    if (
      uiConfigData === false &&
      uiConfigLoading === false &&
      theme === false
    ) {
      dispatch(uiConfigAll());
    }
  }, [dispatch, theme, uiConfigLoading, uiConfigData]);

  const navigate = useNavigate();
  return (
    <div className="min-h-[100vh] container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2">
      <Features />
      <main>
        <section className="mt-8 bg-[var(--primary-color-20-single)] py-10">
          <div className="flex justify-center items-center flex-col text-center">
            <SVGSelector name="not-found" />
            <h4 className="text-[28px] mb-4 font-semibold">
              {t("/.PAGE CANNOT BE DISPLAYED.")}
            </h4>
            <p className="text-base text-[var(--davys-gray-color)]">
              {t(
                "/.The page you requested does not exist or cannot be displayed. Please start a new search.",
              )}
            </p>
            <FilledButton
              title={t("/.New search")}
              onClick={() => navigate("/")}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default NotFound;
