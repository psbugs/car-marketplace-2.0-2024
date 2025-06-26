import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { criteriaPromotions } from "../../redux/CriteriaSlice";
import { defaultImg } from "../../constants/common-constants";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { uiConfigAll } from "../../redux/UiConfigurationSlice";
import { getEdgeClass } from "../../utils";

const CurrentOffers = ({ redirectUrl, edge }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { promotionsList = false, loading: promotionsLoading = false } =
    useSelector((state) => state?.criteria) || [];
  const {
    uiConfigData = false,
    imageServerUrl = false,
    loading: uiConfigLoading = false,
  } = useSelector((state) => state?.uiConfig) || {};

  useEffect(() => {
    if (promotionsList === false && !promotionsLoading) {
      dispatch(criteriaPromotions());
    }
  }, [dispatch, promotionsLoading, promotionsList]);

  useEffect(() => {
    if (uiConfigData === false && !uiConfigLoading) {
      dispatch(uiConfigAll());
    }
  }, [uiConfigData, uiConfigLoading, dispatch]);

  const addQueryParam = (url, key, value) => {
    const urlObj = new URL(url);
    if (!urlObj.searchParams?.has(key)) {
      urlObj.searchParams?.append(key, value);
    }
    return urlObj;
  };

  const redirectToVehiclesSection = (promotionId) => {
    // Build the new URL with the desired query parameters
    const baseUrl = redirectUrl || window.location.href;

    let newUrl = addQueryParam(baseUrl, "view", "vehicles");
    newUrl = addQueryParam(newUrl.href, "promotions", promotionId);

    // Redirect to the constructed URL
    if (redirectUrl) {
      window.location.href = newUrl?.href;
    } else {
      navigate(newUrl?.search);
    }
  };

  // Filter promotions based on the condition
  const filteredPromotions =
    promotionsList && promotionsList?.length
      ? promotionsList?.filter(
          (promo) => !promo?.hiddenInTeaser && "label" in promo,
        )
      : [];

  if (!filteredPromotions?.length) return null;

  return (
    <section className="pb-6 mt-8 max-md:mt-4">
      <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2">
        <div className="flex flex-wrap max-lg:flex-col">
          <div className="w-full  px-4 max-w-full max-md:px-2">
            <div className="flex justify-between items-center  ">
              <h2 className="text-2xl font-semibold max-lg:text-lg max-sm:text-sm text-[var(--secondary-color)]">
                {t("/.Current Offers")}
              </h2>
            </div>
            <div className="mt-6 p-2 max-md:p-0 max-md:mt-4">
              <div id="default-styled-tab-content-1">
                <div
                  className="block"
                  id="styled-profile-1"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  <ul className="grid grid-cols-4 gap-6 max-[1299px]:grid-cols-2 max-lg:grid-cols-1">
                    {filteredPromotions?.length > 0 &&
                      filteredPromotions?.map((promo, index) => {
                        return (
                          <li
                            className={`bg-[var(--white-dark-shade)] flex flex-col h-full ${getEdgeClass(edge)}`}
                            key={index}
                          >
                            <figure>
                              <img
                                className={`${getEdgeClass(edge, "rounded-t-lg")} h-[214px]object-contain object-cover w-full`}
                                src={
                                  promo?.teaserImageId
                                    ? `${imageServerUrl}/default.aspx?url=(teaser)&m=o&id=${promo?.teaserImageId}&w=800&h=600&fallback=Image-Missing.jpg`
                                    : defaultImg
                                }
                                alt="car"
                              />
                            </figure>
                            <div
                              className={`${getEdgeClass(edge, "rounded-b-lg")} p-4 h-full relative pb-[60px]`}
                            >
                              {" "}
                              <div className="flex justify-between">
                                <div className="h-16 max-md:h-auto">
                                  <h4 className="text-base font-semibold text-[var(--secondary-color)]  line-clamp-3">
                                    {promo?.label ? (
                                      promo?.label
                                    ) : (
                                      <span className="mr-4"></span>
                                    )}
                                  </h4>
                                </div>
                              </div>
                              <div className="my-2">
                                <p className="text-[var(--davys-gray-color)] text-xs min-h-[50px] max-md:min-h-full">
                                  {promo?.description ? (
                                    promo?.description
                                  ) : (
                                    <span className="mr-4"></span>
                                  )}
                                </p>
                              </div>
                              <button
                                className={`${getEdgeClass(edge)} primary-bg-color p-2 text-center  border text-white hover-text-primary-color absolute bottom-4 left-2/4 -translate-x-2/4 w-[93%]  hover:bg-white hover:text-[var(--primary-black-color)]`}
                                btnOnClickHandler={() =>
                                  redirectToVehiclesSection(promo?.id)
                                }
                              >
                                {t("/.To the Vehicles")}
                              </button>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentOffers;
