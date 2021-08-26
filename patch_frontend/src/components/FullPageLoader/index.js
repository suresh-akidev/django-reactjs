import React from "react";
import Loader from "react-loader-spinner";
const FullPageLoader = () => {
  // const min = 1;
  // const max = 12;
  // const rand = Math.floor(Math.random() * (max - min + 1) + min);
  const rand = Math.floor(Math.random() * 12 + 1);
  const val = [
    "Audio",
    "BallTriangle",
    "Bars",
    "Circles",
    "Grid",
    "Hearts",
    "Oval",
    "Puff",
    "RevolvingDot",
    "Rings",
    "TailSpin",
    "ThreeDots",
    "Watch",
  ];
  return (
    <div className="loading-overlay">
      <div className="spinner d-flex justify-content-center">
        <Loader
          type={val[rand]}
          color="#F7CF2B"
          height="75"
          width="75"
          // className="loadingBarIcon"
          // timeout={5000}
        />
      </div>
    </div>
  );
};

export default FullPageLoader;
