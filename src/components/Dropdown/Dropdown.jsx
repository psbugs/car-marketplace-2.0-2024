import { Dropdown } from "flowbite-react";
import EmailTemplate from "../common-components/EmailTemplate";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const CustomDropdown = ({ options, label, icon, vehicleId }) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(null);

  const domainName = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;
  const baseUrl = `${protocol}//${domainName}${port ? `:${port}` : ""}`;

  let url = `${baseUrl}/?view=vehicle-details&vehicle-id=${vehicleId}`;

  const handleClick = (option) => {
    setSelectedOption(option);
  };

  const Copy = () => {
    navigator.clipboard.writeText(url).then(
      function () {
        toast.success(`${t("/vehicleDetails.Copied!")}`);
        setSelectedOption(null);
      },
      function () {
        toast.error(`${t("/vehicleDetails.Copy error")}`);
        setSelectedOption(null);
      },
    );
  };

  useEffect(() => {
    if (selectedOption) {
      const urlToShare = encodeURIComponent(url);
      switch (selectedOption) {
        case "X/Twitter":
          window.open(
            `https://twitter.com/intent/tweet?url=${urlToShare}`,
            "_blank",
          );
          break;
        case "Facebook":
          const encodedLink = encodeURIComponent(url);

          const fbUrl = `https://www.facebook.com/share_channel/?link=${encodedLink}`;
          window.open(fbUrl, "_blank");
          break;
        case `${t("/vehicleDetails.Copy URL")}`:
          Copy();
          break;
        default:
          break;
      }
    }
    //eslint-disable-next-line
  }, [selectedOption, url]);

  return (
    <Dropdown
      label={
        <span className="flex items-center gap-2 max-md:gap-1">
          {icon} <p className="text-[var(--davy-gray-color)]">{label}</p>
        </span>
      }
      dismissOnClick={false}
      className="custom-dropdown-style !min-w-[150px]"
    >
      {options?.map((item, i) => (
        <Dropdown.Item key={i} onClick={() => handleClick(item)}>
          {item}
        </Dropdown.Item>
      ))}

      {selectedOption === "E-mail" && (
        <EmailTemplate
          subject={
            "Interessantes Fahrzeug bei Mein Autohaus SD -AUTOMANAGER Marketplace"
          }
          body={`Hallo, <br/><br/> ${url}<br/><br/>Viele Grüße.`}
          email={""}
        />
      )}
    </Dropdown>
  );
};

export default CustomDropdown;
