import { useSelector } from "react-redux";
import { getEdgeClass } from "../../utils";
import parse from "html-react-parser";
import { useTranslation } from "react-i18next";
import React from "react";

const VehicleFurtherFeatures = ({ vehicleDetails }) => {
  const { t } = useTranslation();
  const { edge = false } = useSelector((state) => state?.uiConfig) || {};

  // Handle custom styling for text.
  const renderNode = (domNode) => {
    if (domNode?.type === "text") {
      return domNode?.data;
    }

    const nodeHandlers = {
      p: (children) => (
        <p
          className={
            "text-[15px] text-[var(--davy-gray-color)] leading-6 break-words"
          }
        >
          {children}
        </p>
      ),
      li: (children) => (
        <li
          className={
            "text-[15px] text-[var(--davy-gray-color)] leading-6 break-words"
          }
        >
          {children}
        </li>
      ),
      strong: (children) => <strong>{children}</strong>,
      ul: (children) => <ul>{children}</ul>,
      hr: () => <hr />,
    };

    const handler = nodeHandlers[domNode.name];
    if (!handler) return null;

    const children = domNode.children?.map((child, index) => (
      <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
    ));

    return handler(children);
  };

  const parsedContent = vehicleDetails?.equipmentComplete
    ? parse(vehicleDetails?.equipmentComplete, {
        replace: (domNode) => {
          return renderNode(domNode);
        },
      })
    : null;

  return vehicleDetails?.equipmentComplete ? (
    <section className="mt-7 max-md:mt-5">
      <div className="container 2xl:max-w-[1336px] lg:max-w-[1200px] m-auto px-2">
        <div
          className={`${getEdgeClass(edge, "rounded-[20px]")} bg-[var(--white-shade)] p-7 max-md:p-4"`}
        >
          <h3 className="text-[var(--primary-dark-color)] max-md:text-lg font-semibold text-2xl pb-2 relative after:h-[2px] after:max-w-[70px] after:w-full after:contents-[] after:absolute after:bottom-0 after:left-0 after:bg-[var(--primary-dark-color)]">
            {t("/vehicleDetails.Further features")}
          </h3>
          <div className="my-6">{parsedContent}</div>
        </div>
      </div>
    </section>
  ) : null;
};
export default VehicleFurtherFeatures;
