import { useEffect, useRef, useState } from "react";

export const useDocumentTitle = () => {
  const defaultTitle = useRef(document.title);
  const [title, setTitle] = useState(defaultTitle.current);
  const [prevailOnUnmount, setPrevailOnUnmount] = useState(false);

  useEffect(() => {
    document.title = `${title}`;
  }, [title]);
  useEffect(
    () => () => {
      if (!prevailOnUnmount) {
        document.title = defaultTitle.current;
      }
      //eslint-disable-next-line
    },
    [prevailOnUnmount],
  );

  const docTitle = (title, prevailOnUnmount = false) => {
    setTitle(`${title}` || "Marketplace");
    setPrevailOnUnmount(prevailOnUnmount);
  };

  return docTitle;
};
