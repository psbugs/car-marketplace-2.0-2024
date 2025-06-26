import { useSelector, useDispatch } from "react-redux";
import { clearStorageData, toggleItem } from "../redux/TransferCodeSlice";
import { useTranslation } from "react-i18next";

export function useCompares() {
  const comparables = useSelector(
    (state) => state.transferCode.comparablesData,
  );
  const { edge } = useSelector((state) => state?.uiConfig);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const toggleComparison = (id) => {
    dispatch(toggleItem({ id, dataType: "comparables", t, edge }));
  };

  const isComparable = (id) => {
    const comparablesItems = Array.isArray(comparables?.items)
      ? comparables?.items
      : [];
    return comparablesItems?.some((item) => item?.id === id);
  };

  const clearComparables = () => {
    dispatch(clearStorageData());
  };

  return {
    toggleComparison,
    isComparable,
    clearComparables,
  };
}
