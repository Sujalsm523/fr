import { useState } from "react";
import { TextureContext } from "./TextureContext";

const textures = [
  {
    id: "wood-oak",
    name: "Oak Wood",
    category: "wood",
    url: "https://furnouserdatabase.s3.ap-south-1.amazonaws.com/users/user_760309/scene_a2052295/texture_3446355027.png",
    thumbnail: "🪵",
    previewColor: "#deb887",
  },
  {
    id: "marble-white",
    name: "White Marble",
    category: "marble",
    url: "https://furnouserdatabase.s3.ap-south-1.amazonaws.com/users/user_760309/scene_a2052295/texture_9397327790.png",
    thumbnail: "🧱",
    previewColor: "#f8f8ff",
  },
];

export const TextureContextProvider = ({ children }) => {
  const [libraryTextures, setLibraryTextures] = useState(textures);
  const [inventoryTextures, setInventoryTextures] = useState([]);
  const [appliedTextures, setAppliedTextures] = useState([]);

  const textureContextValue = {
    appliedTextures,
    libraryTextures,
    inventoryTextures,
    setAppliedTextures,
    setLibraryTextures,
    setInventoryTextures,
  };

  return (
    <TextureContext.Provider value={textureContextValue}>
      {children}
    </TextureContext.Provider>
  );
};
