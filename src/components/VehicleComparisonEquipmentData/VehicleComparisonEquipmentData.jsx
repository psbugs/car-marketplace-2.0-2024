import SVGSelector from "../common-components/SVGSelector";

const VehicleComparisonEquipmentData = ({ vehicle, allEquipment }) => {
  const allEquipmentsData = [
    ...(vehicle?.equipment?.feature || []),
    ...(vehicle?.equipment?.standard || []),
    ...(vehicle?.equipment?.jatostandard || []),
    ...(vehicle?.equipment?.jatooptional || []),
    ...(vehicle?.equipment?.optional || []),
  ];

  const vehicleEquipmentTitles = new Set(
    allEquipmentsData?.flatMap(
      (a) => a?.item?.map((item) => item?.title1) || [],
    ),
  );

  return (
    <div>
      {allEquipment?.map((item, index) => (
        <div
          className={`${
            index !== allEquipment?.length - 1
              ? "border-b border-[var(--gray-color)]"
              : ""
          } pb-4 mb-5`}
          key={item?.title1}
        >
          <p className="font-medium flex gap-3 text-[var(--text-black-white)] items-center">
            <span className="block">
              {vehicleEquipmentTitles?.has(item?.title1) ? (
                <SVGSelector name="checkmark-svg" pathStroke={"#52AE32"} />
              ) : (
                <SVGSelector
                  name="cross-svg"
                  svgHeight={16}
                  svgWidth={16}
                  pathStroke={"#E30613"}
                />
              )}
            </span>
            {item?.title1}
          </p>
        </div>
      ))}
    </div>
  );
};
export default VehicleComparisonEquipmentData;
