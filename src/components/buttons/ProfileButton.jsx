import React from "react";
import { CgProfile } from "react-icons/cg";

const ProfileButton = () => {
  return (
    <div className="size-full rounded-full p-2 border border-gray-300 bg-white/20 backdrop-blur-md cursor-pointer">
      <CgProfile className="w-fit h-full" />
    </div>
  );
};

export default ProfileButton;
