import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const Portal = ({
  children,
  domNode = document.body,
  prepend,
  identifier,
  clsName = "pxc-portal",
}) => {
  const portalContainer = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    if (!portalContainer.current) {
      const container = document.createElement("div");
      container.setAttribute("id", identifier);
      container.setAttribute("class", clsName);
      portalContainer.current = container;

      if (prepend) {
        domNode.prepend(container);
      } else {
        domNode.appendChild(container);
      }
    }
    setIsMounted(true);

    return () => {
      if (
        portalContainer.current &&
        domNode.contains(portalContainer.current)
      ) {
        domNode.removeChild(portalContainer.current);
      }
    };
  }, [domNode, prepend, identifier]);
  useEffect(() => {
    console.log("Portal mounted:", portalContainer.current, isMounted);
    return () => {
      console.log("Portal unmounted:", portalContainer.current);
    };
  }, [portalContainer, isMounted]);
  if (!isMounted) return null;
  return createPortal(children, portalContainer.current);
};

export default Portal;
