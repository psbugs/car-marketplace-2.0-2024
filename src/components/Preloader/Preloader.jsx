import React, { useEffect } from "react";

const Preloader = () => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
  return (
    <div
      className="fixed w-full h-full bg-[#0000002a] z-50 top-0 left-0"
      style={{ display: "block" }}
    >
      <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 flex">
        <div className="spinner-bounce one_block mr-4 rounded-full inline-block origin-center h-[45px] w-[45px] will-change-transform"></div>
        <div className="spinner-bounce two_block mr-4 rounded-full inline-block origin-center h-[45px] w-[45px] will-change-transform"></div>
        <div className="spinner-bounce three_block rounded-full inline-block origin-center h-[45px] w-[45px] will-change-transform "></div>
      </div>
    </div>
  );
};

export default Preloader;
