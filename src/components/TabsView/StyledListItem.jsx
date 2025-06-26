const StyledListItem = ({
  label,
  value,
  additionalText,
  notes,
  isTooltipContent,
}) => {
  return (
    // <li className="flex justify-between items-end border-b border-dashed border-[#2F3E46] pb-1">
    <li className="flex justify-between items-center text-sm py-[0.2rem]">
      {label && (
        <p
          className={`${
            isTooltipContent ? "text-white" : "text-[var(--davy-gray-color)]"
          } max-lg:text-sm`}
        >
          {label}
        </p>
      )}
      {value && (
        <div className="flex flex-col items-end">
          <h4
            className={`text-base text-sm font-semibold ${
              isTooltipContent ? "text-white" : "text-[var(--text-black-white)]"
            }`}
          >
            {value}
          </h4>
          {additionalText && (
            <span className="text-xs text-end">{additionalText}</span>
          )}
        </div>
      )}
      {notes && (
        <p
          className={`${
            isTooltipContent ? "text-white" : "text-[var(--davy-gray-color)]"
          } text-xs max-lg:text-sm`}
        >
          {notes}
        </p>
      )}
    </li>
  );
};
export default StyledListItem;
