import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { criteriaAll } from "../../redux/CriteriaSlice";
import SVGSelector from "../common-components/SVGSelector";

const InfloBlocks = ({ vehicleDetails }) => {
  const dispatch = useDispatch();
  const { promotionList } = useSelector((state) => state.criteria);
  const { criteriaAll: criteriaAllRes = [], loading: criteriaLoading = false } =
    useSelector((state) => state?.criteria) || {};
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    if (criteriaAllRes?.length === 0 && !criteriaLoading) {
      dispatch(criteriaAll());
    }
  }, [dispatch, criteriaAllRes, criteriaLoading]);

  const handleAccordionToggle = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  //Filter InfoBlock data

  let FilterInfoBlockData = [];

  if (promotionList?.length > 0) {
    FilterInfoBlockData = promotionList.filter(
      (item) =>
        vehicleDetails?.includes(item?.id) &&
        item?.label &&
        item?.description &&
        item?.promotionType === "InfoBlock",
    );
  }

  return (
    <section
      className={
        FilterInfoBlockData?.length > 0 ? "mt-14 max-md:mt-5" : "hidden"
      }
    >
      <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2">
        <div id="accordion-open" data-accordion="open">
          {FilterInfoBlockData?.length > 0 &&
            FilterInfoBlockData?.map((info, index) => (
              <div
                key={index}
                className="rounded-[20px] bg-white p-7 max-md:p-4 mb-6"
              >
                <h2 id={`accordion-open-heading-${index}`}>
                  <button
                    type="button"
                    className="primary-color gap-1 flex justify-between items-center w-full !bg-white max-md:text-lg text-start font-semibold text-2xl pb-2 relative after:h-[2px] after:max-w-[70px] after:w-full after:contents-[] after:absolute after:bottom-0 after:left-0 after:bg-[var(--primary-dark-color)]"
                    data-accordion-target={`#accordion-open-body-${index}`}
                    aria-expanded={openIndex === index}
                    aria-controls={`accordion-open-body-${index}`}
                    onClick={() => handleAccordionToggle(index)}
                  >
                    {info?.label ||
                      "Ford Transit Custom Nugget vehicle highlights"}
                    <SVGSelector
                      name="arrow-up-svg"
                      className={openIndex === index ? "rotate-180" : ""}
                    />
                  </button>
                </h2>
                <div
                  id={`accordion-open-body-${index}`}
                  className={`${openIndex === index ? "block" : "hidden"}`}
                  aria-labelledby={`accordion-open-heading-${index}`}
                >
                  <div className="mt-4">
                    <p>{info?.description}</p>
                    <div className="grid grid-cols-2 mt-5 max-md:grid-cols-1">
                      <div className="rounded-lg">
                        {info?.teaserImageId && (
                          <figure>
                            <img
                              className="object-contain h-[400px] max-md:h-auto rounded-md"
                              src={`https://dev-image-srv04-am-v3-3.pixel-base.de/default.aspx?url=(teaser)&m=o&id=${info?.teaserImageId}&fallback=Image-Missing.jpg`}
                              alt=""
                            />
                          </figure>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default InfloBlocks;
