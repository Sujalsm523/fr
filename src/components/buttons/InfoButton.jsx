import React from "react";
import { IoMdInformationCircle } from "react-icons/io";

const InfoButton = () => {
  return (
    <div className="size-full rounded-full p-1 border border-gray-300 bg-white/20 backdrop-blur-md cursor-pointer">
      <IoMdInformationCircle className="w-fit h-full" />
    </div>
  );
};

export default InfoButton;
