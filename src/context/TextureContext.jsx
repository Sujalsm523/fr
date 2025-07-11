import { createContext, useContext } from "react";

export const TextureContext = createContext();

export const useTextureContext = () => {
  return useContext(TextureContext);
};
