import { useTranslation } from "react-i18next";
import { getEdgeClass, scrollToTopFunction } from "../../utils";
import SVGSelector from "./SVGSelector";

const CustomPagination = ({ currentPage, totalPages, onPageChange, edge }) => {
  const { t } = useTranslation();
  const getPageNumbers = () => {
    const pageNumbers = [];
    const delta = 2;
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers?.push(i);
      }
    } else {
      if (currentPage <= delta + 2) {
        for (let i = 1; i <= delta + 3; i++) {
          pageNumbers?.push(i);
        }
        pageNumbers?.push("...", totalPages);
      } else if (currentPage >= totalPages - delta - 1) {
        pageNumbers?.push(1, "...");
        for (let i = totalPages - delta - 2; i <= totalPages; i++) {
          pageNumbers?.push(i);
        }
      } else {
        pageNumbers?.push(1, "...");
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
          pageNumbers?.push(i);
        }
        pageNumbers?.push("...", totalPages);
      }
    }
    return pageNumbers;
  };

  const StyledButton = ({ title, isDisabled, onClickFunc, classes }) => {
    return (
      <button
        onClick={onClickFunc}
        disabled={isDisabled}
        className={`relative inline-flex items-center ${classes} ${getEdgeClass(edge, "rounded-md")}`}
      >
        {title}
      </button>
    );
  };
  const handlePageChange = (page) => {
    scrollToTopFunction();
    onPageChange(page);
  };

  return (
    <div className="flex items-center justify-between sm:px-6">
      {/* For smaller devices */}
      <div className="flex flex-1 gap-2 justify-between sm:hidden">
        <StyledButton
          title={t("/vehicleDetails.Previous")}
          isDisabled={currentPage === 1}
          onClickFunc={() => handlePageChange(Math.max(currentPage - 1, 1))}
          classes={`px-4 py-2 text-sm font-medium ${
            currentPage === 1
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-[var(--primary-color-single)] text-white cursor-pointer hover:bg-primary-dark"
          }`}
        />
        <StyledButton
          title={t("/vehicleDetails.Next")}
          isDisabled={currentPage === totalPages}
          onClickFunc={() =>
            handlePageChange(Math?.min(currentPage + 1, totalPages))
          }
          classes={`px-4 py-2 text-sm font-medium ${
            currentPage === totalPages
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-[var(--primary-color-single)] text-white cursor-pointer hover:bg-primary-dark"
          }`}
        />
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <nav
            className={`isolate inline-flex -space-x-px text-[var(--text-black-white)] ${getEdgeClass(edge, "rounded-md")} shadow-sm`}
            aria-label="Pagination"
          >
            {/* Previous button */}
            <StyledButton
              title={
                <SVGSelector
                  name="arrow-left-svg"
                  pathFill={"var(--text-black-white)"}
                />
              }
              isDisabled={currentPage === 1}
              onClickFunc={() =>
                handlePageChange(Math?.max(currentPage - 1, 1))
              }
              classes={`px-2 py-2 cursor-not-allowed ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage !== 1 &&
                "cursor-pointer text-[var(--text-black-white)] bg-[var(--white-light-smoke-color)]"
              }`}
            />
            {/* Page  numbers */}
            {getPageNumbers()?.map((page, index) => (
              <StyledButton
                key={index}
                title={page}
                onClickFunc={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                classes={` px-4 py-2 text-sm font-semibold ${
                  page === currentPage
                    ? "bg-[var(--primary-color-single)] ring-1 ring-inset ring-gray-300 text-white"
                    : "ring-1 ring-inset ring-gray-300 hover:bg-[var(--primary-color-single)] hover:text-white"
                } focus:z-20 focus:outline-offset-0`}
                isDisabled={typeof page === "string"}
              />
            ))}
            {/* Next button */}
            <StyledButton
              title={
                <SVGSelector
                  name="arrow-right-svg"
                  pathFill={"var(--text-black-white)"}
                />
              }
              onClickFunc={() =>
                handlePageChange(Math?.min(currentPage + 1, totalPages))
              }
              isDisabled={currentPage === totalPages}
              classes={`px-2 py-2 cursor-not-allowed ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage !== totalPages &&
                "cursor-pointer text-[var(--text-black-white)] hover:bg-[var(--primary-color-single)]"
              }`}
            />
          </nav>
        </div>
      </div>
    </div>
  );
};
export default CustomPagination;
