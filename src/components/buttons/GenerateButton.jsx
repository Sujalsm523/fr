import React from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const GenerateButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/studio");
  };

  return (
    <button
      className="flex items-center border-2 border-yellow px-3 py-2 bg-gradient-to-r from-[#633a1c] to-[#c17238] text-white rounded-full hover:from-[#4e2e16] hover:to-[#c17238] pointer-events-auto transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer group"
      onClick={handleClick}
      type="button"
    >
      <HiOutlineSparkles className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
      <span className="font-medium">FURNO STUDIO</span>
    </button>
  );
};

export default GenerateButton;
