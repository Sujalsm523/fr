import React from "react";
import HomeButton from "../../../../components/buttons/HomeButton";
import InfoButton from "../../../../components/buttons/InfoButton";
import { useModelContext } from "../../../../context/ModelContext";
import { useTextureContext } from "../../../../context/TextureContext";

const LeftSidebar = () => {
  const { libraryModels } = useModelContext();
  const { libraryTextures } = useTextureContext();

  const handleDragStartModel = (e, item) => {
    e.dataTransfer.setData("model", JSON.stringify(item));
  };

  const handleDragStartTexture = (e, item) => {
    e.dataTransfer.setData("texture", JSON.stringify(item));
  };

  return (
    <div className="size-full flex flex-col items-center">
      <div className="w-full flex justify-between p-2">
        <div className="w-full border-b-1 flex justify-between px-1 pb-2">
          <div className="w-fit">
            <HomeButton />
          </div>
          <div className="w-fit">
            <InfoButton />
          </div>
        </div>
      </div>

      <div className="w-full p-4">
        <h3 className="text-lg font-semibold mb-4">3D Models Library</h3>
        <div className="grid grid-cols-2 gap-4">
          {libraryModels.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStartModel(e, item)}
              className="border rounded-lg p-3 cursor-grab hover:bg-gray-100 transition"
            >
              <div className="text-3xl mb-2">{item.thumbnail}</div>
              <p className="text-sm font-medium">{item.name}</p>
              <span className="text-xs text-gray-500">{item.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Textures Section */}
      <div className="w-full p-4">
        <h3 className="text-lg font-semibold mb-4">Textures Library</h3>
        <div className="grid grid-cols-2 gap-4">
          {libraryTextures.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStartTexture(e, item)}
              className="border rounded-lg p-3 cursor-grab hover:bg-gray-100 transition"
            >
              <div
                className="w-full h-12 mb-2 rounded-md"
                style={{ backgroundColor: item.previewColor }}
              ></div>
              <p className="text-sm font-medium">{item.name}</p>
              <span className="text-xs text-gray-500">{item.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
