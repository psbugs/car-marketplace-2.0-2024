import { useSelector, useDispatch } from "react-redux";
import { clearStorageData, toggleItem } from "../redux/TransferCodeSlice";
import { useTranslation } from "react-i18next";

export function useFavorites() {
  const favorites = useSelector((state) => state?.transferCode?.favData);
  const { edge } = useSelector((state) => state?.uiConfig);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const toggleFavorite = (id) => {
    dispatch(toggleItem({ id, dataType: "favorites", t, edge }));
  };

  const isFavorite = (id) => {
    const favoritesItems = Array.isArray(favorites?.items)
      ? favorites?.items
      : [];
    return favoritesItems?.some((item) => item?.id === id);
  };
  const clearFavorites = () => {
    dispatch(clearStorageData());
  };

  return {
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
}
