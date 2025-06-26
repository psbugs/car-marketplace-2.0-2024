const StyledBottomBorderTabs = ({
  activeTab,
  setActiveTab,
  title,
  titleId,
  disabled,
}) => {
  return (
    <li
      className={`flex-auto border-b-2 ${
        activeTab === titleId
          ? "border-[var(--primary-dark-color)] font-semibold text-[var(--primary-dark-color)]"
          : disabled
            ? "border-[var(--light-gray-color)]"
            : "font-normal text-[var(--gray-color)] border-[var(--gray-color)]"
      }`}
      role="presentation"
    >
      <button
        className={`inline-block px-6 py-3 rounded-t-lg w-full text-start max-md:py-2 ${disabled ? "text-[var(--light-gray-color)]" : ""}`}
        onClick={() => !disabled && setActiveTab(titleId)}
        type="button"
        role="tab"
        disabled={disabled}
      >
        {title}
      </button>
    </li>
  );
};
export default StyledBottomBorderTabs;
