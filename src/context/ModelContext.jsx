import { createContext, useContext } from "react";

export const ModelContext = createContext();

export const useModelContext = () => {
  return useContext(ModelContext);
};
