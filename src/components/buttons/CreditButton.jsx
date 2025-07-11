import React from "react";
import CoinCanvas from "../CoinCanvas";

const CreditButton = () => {
  return (
    <button
      className="flex w-full items-center gap-1 justify-between rounded-full border border-gray-300 bg-white/20 backdrop-blur-md transition-all hover:bg-white/30 cursor-pointer"
      aria-label="Credits: 69"
    >
      {/* 3D Model Container */}
      <div className="w-1/2 h-10">
        <CoinCanvas />
      </div>

      {/* Credit Count */}
      <div className="w-1/2 py-2 px-2">
        <p className="text-lg font-semibold text-gray-800">69</p>
      </div>
    </button>
  );
};

export default CreditButton;
