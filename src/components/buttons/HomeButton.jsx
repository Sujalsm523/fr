import React from "react";
import { IoHomeSharp } from "react-icons/io5";

const HomeButton = () => {
  return (
    <div className="size-full rounded-full p-2 border border-gray-300 bg-white/20 backdrop-blur-md cursor-pointer">
      <IoHomeSharp className="w-fit h-full" />
    </div>
  );
};

export default HomeButton;
