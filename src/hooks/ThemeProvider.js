import React, { createContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { setGlobalCSSVariables } from "../utils";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const {
    theme = false,
    content = false,
    i18n = false,
  } = useSelector((state) => state?.uiConfig?.uiConfigData) || {};
  useEffect(() => {
    if (content && theme && i18n?.currencySymbol) {
      setGlobalCSSVariables(content, theme, i18n?.currencySymbol);
    }
  }, [content, theme, i18n?.currencySymbol]);

  return (
    <ThemeContext.Provider value={content}>{children}</ThemeContext.Provider>
  );
};
