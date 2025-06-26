import { useTranslation } from "react-i18next";

const ErrorToastMessageBox = ({ primaryText }) => {
  const { t } = useTranslation();
  return (
    <div>
      <span>{primaryText}</span>
      <br />
      <span> {t("/favorites.Please try again!")}</span>
    </div>
  );
};
export default ErrorToastMessageBox;
