import { createContext, useContext } from "react";

export const SceneContext = createContext();

export const useSceneContext = () => {
  return useContext(SceneContext);
};
