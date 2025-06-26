import parse from "html-react-parser";

const VehicleComparisonTechnicalData = ({ vehicle }) => {
  return (
    <div>
      {vehicle?.technicalData?.map(({ title, item }, sectionIndex) => {
        return (
          <div key={title} className="flex-1">
            <li>
              <h5 className="font-semibold text-[var(--secondary-color)] mb-4">
                {title}
              </h5>
              {item?.map(({ label, key, stringValue }, itemIndex) => {
                const isLastSection =
                  sectionIndex === vehicle?.technicalData?.length - 1;
                const isLastItem = itemIndex === item?.length - 1;

                return (
                  <div
                    className={`pb-4 mb-5 flex-1 ${
                      isLastSection && isLastItem
                        ? ""
                        : "border-b border-[var(--gray-color)]"
                    }`}
                    key={key}
                  >
                    <label className="text-[var(--primary-dark-color)] font-medium text-sm mb-2 block">
                      {label}
                    </label>
                    <p className="font-medium text-[var(--primary-dark-color)]">
                      <span>{key}</span>: <span>{parse(stringValue)}</span>
                    </p>
                  </div>
                );
              })}
            </li>
          </div>
        );
      })}
    </div>
  );
};
export default VehicleComparisonTechnicalData;
