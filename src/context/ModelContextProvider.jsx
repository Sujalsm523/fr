import { useState } from "react";
import { ModelContext } from "./ModelContext";

const models = [
  {
    id: "indoor-plant",
    name: "Indoor Plant",
    category: "plant",
    url: "https://furnouserdatabase.s3.ap-south-1.amazonaws.com/users/user_760309/scene_a2052295/model_2489754749.glb",
    thumbnail: "🌿",
    initialPosition: [0, 1, 0],
    initialRotation: [0, 0, 0],
  },
  {
    id: "chair",
    name: "Modern Chair",
    category: "furniture",
    url: "https://furnouserdatabase.s3.ap-south-1.amazonaws.com/users/user_760309/scene_a2052295/model_0243514227.glb",
    thumbnail: "🪑",
    initialPosition: [0, 0, 0],
    initialRotation: [0, Math.PI / 2, 0],
  },
  {
    id: "bed",
    name: "the bed",
    category: "furniture",
    url: "https://furnouserdatabase.s3.ap-south-1.amazonaws.com/users/user_12345/scene_2c7c66d5/model_6984096452.glb",
    thumbnail: "🛏️",
    initialPosition: [0, 0, 0],
    initialRotation: [0, Math.PI / 2, 0],
  },
  {
    id: "sofa the",
    name: "the sofa",
    category: "furniture",
    url: "https://furnouserdatabase.s3.ap-south-1.amazonaws.com/users/user_12345/scene_2c7c66d5/model_6019256313.glb",
    thumbnail: "🛋️",
    initialPosition: [0, 0, 0],
    initialRotation: [0, Math.PI / 2, 0],
  },
  {
    id: "wardrobe the",
    name: "the wardrobe",
    category: "furniture",
    url: "https://furnouserdatabase.s3.ap-south-1.amazonaws.com/users/user_12345/scene_2c7c66d5/model_0134865573.glb",
    thumbnail: "🛋️",
    initialPosition: [0, 0, 0],
    initialRotation: [0, Math.PI / 2, 0],
  },
  {
    id: "tv the",
    name: "the tv",
    category: "furniture",
    url: "https://furnouserdatabase.s3.ap-south-1.amazonaws.com/users/user_12345/scene_2c7c66d5/model_1834376564.glb",
    thumbnail: "🛋️",
    initialPosition: [0, 0, 0],
    initialRotation: [0, Math.PI / 2, 0],
  },
];

const demoAppliedModels = [
  {
    id: "indoor-plant",
    name: "Indoor Plant",
    category: "plant",
    url: "https://furnouserdatabase.s3.ap-south-1.amazonaws.com/users/user_760309/scene_a2052295/model_2489754749.glb",
    thumbnail: "🌿",
    initialPosition: [0, 1, 0],
    initialRotation: [0, 0, 0],
  },
];

export const ModelContextProvider = ({ children }) => {
  const [libraryModels, setLibraryModels] = useState(models);
  const [inventoryModels, setInventoryModels] = useState();
  const [appliedModels, setAppliedModels] = useState(demoAppliedModels);
  const [selectedModelId, setSelectedModelId] = useState(null);

  const modelContextValue = {
    appliedModels,
    libraryModels,
    inventoryModels,
    selectedModelId,
    setAppliedModels,
    setLibraryModels,
    setInventoryModels,
    setSelectedModelId,
  };
  return (
    <ModelContext.Provider value={modelContextValue}>
      {children}
    </ModelContext.Provider>
  );
};
