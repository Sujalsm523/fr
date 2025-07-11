import React from "react";
import { SceneContext } from "./SceneContext";

const SceneContextProvider = ({ children }) => {
  const sceneContextValue = {};
  return (
    <SceneContext.Provider value={sceneContextValue}>
      {children}
    </SceneContext.Provider>
  );
};

export default SceneContextProvider;
