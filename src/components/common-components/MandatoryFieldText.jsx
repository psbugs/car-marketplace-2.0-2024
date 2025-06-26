import { useTranslation } from "react-i18next";

const MandatoryFieldText = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-1 mb-2 text-sm text-[#8b8a8b] max-md:text-xs ms-4">
      <span className="text-red-700">*</span>
      {t("/vehicleDetails.Mandatory field")}
    </div>
  );
};
export default MandatoryFieldText;
