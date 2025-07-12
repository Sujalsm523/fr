import { useEffect, useRef, useState, useCallback } from "react";
import LeftSidebar from "./components/LeftSidebar/LeftSidebar";
import ProfileButton from "../../components/buttons/ProfileButton";
import CreditButton from "../../components/buttons/CreditButton";
import { Canvas } from "@react-three/fiber";
import {
  CameraControls,
  ContactShadows,
  OrbitControls,
  OrthographicCamera,
  View,
} from "@react-three/drei";
import StudioScene from "./components/MiddleStudioSection/components/StudioScene";
import { Physics } from "@react-three/rapier";
import StudioInput from "./components/MiddleStudioSection/components/StudioInput";
import { Toaster, toast } from "react-hot-toast";
import { useModelContext } from "../../context/ModelContext";
import { useTextureContext } from "../../context/TextureContext";
import { motion } from "framer-motion";
import { FaUser, FaDollarSign } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import Inventory from "./components/RightSideBar/components/Inventory";
import SceneList from "./components/RightSideBar/components/SceneList";

const wallNames = {
  floor: "Floor",
  ceiling: "Ceiling",
  back: "Back Wall",
  front: "Front Wall",
  left: "Left Wall",
  right: "Right Wall",
};

const StudioPage = () => {
  // Original StudioPage state and refs
  const viewBoxRef = useRef();
  const mainSceneRef = useRef();
  const [refsReady, setRefsReady] = useState(false);
  const { appliedModels, setAppliedModels } = useModelContext();
  const { appliedTextures, setAppliedTextures } = useTextureContext();
  const [selectedModelId, setSelectedModelId] = useState(null);

  // Room2DLayout state and refs
  const [placedFurniture, setPlacedFurniture] = useState([]);
  const panelRef = useRef(null);
  const dragItemRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const { userCredits } = useAuthContext();

  // Room2DLayout handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleMouseDown = (e, id) => {
    e.preventDefault();
    const panelRect = panelRef.current.getBoundingClientRect();
    const furniture = placedFurniture.find((f) => f.id === id);
    if (!furniture) return;

    dragItemRef.current = id;
    dragOffset.current = {
      x: e.clientX - (panelRect.left + furniture.x),
      y: e.clientY - (panelRect.top + furniture.y),
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!dragItemRef.current) return;

    const panelRect = panelRef.current.getBoundingClientRect();
    const x = e.clientX - panelRect.left - dragOffset.current.x;
    const y = e.clientY - panelRect.top - dragOffset.current.y;

    setPlacedFurniture((prev) =>
      prev.map((item) =>
        item.id === dragItemRef.current
          ? {
              ...item,
              x: Math.max(0, Math.min(x, panelRect.width)),
              y: Math.max(0, Math.min(y, panelRect.height)),
            }
          : item
      )
    );
  };

  const handleMouseUp = () => {
    dragItemRef.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  // Original StudioPage effects
  const handleTextureApplied = (textureName, wallId) => {
    toast.success(`${textureName} applied to ${wallNames[wallId]}`);
    setAppliedTextures((prev) => {
      const filtered = prev
        ? prev.filter((texture) => texture.ref !== wallId)
        : [];
      return [...filtered, { ref: wallId, textureName, wallId }];
    });
  };

  const handleModelPositionUpdate = useCallback(
    (modelId, newPosition) => {
      setAppliedModels((prev) =>
        prev.map((model) =>
          model.id === modelId ? { ...model, position: newPosition } : model
        )
      );
    },
    [setAppliedModels]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!selectedModelId) return;

      const modelIndex = appliedModels.findIndex(
        (model) => model.id === selectedModelId
      );
      if (modelIndex === -1) return;

      const model = appliedModels[modelIndex];
      let updatedModel = { ...model };

      switch (e.key.toLowerCase()) {
        case "r": // Rotate around Y axis
          updatedModel.rotation = [
            model.rotation?.[0] || 0,
            (model.rotation?.[1] || 0) + Math.PI / 4,
            model.rotation?.[2] || 0,
          ];
          break;
        case "u": // Rotate around Z axis
          updatedModel.rotation = [
            model.rotation?.[0] || 0,
            model.rotation?.[1] || 0,
            (model.rotation?.[2] || 0) + Math.PI / 4,
          ];
          break;
        case "+": // Scale up
          updatedModel.scale = (model.scale || 1) * 1.1;
          break;
        case "-": // Scale down
          updatedModel.scale = Math.max(0.5, (model.scale || 1) * 0.9);
          break;
        case "delete":
        case "backspace":
          setAppliedModels((prev) =>
            prev.filter((m) => m.id !== selectedModelId)
          );
          setSelectedModelId(null);
          toast.success("Model deleted");
          return;
        default:
          return;
      }

      const newModels = [...appliedModels];
      newModels[modelIndex] = updatedModel;
      setAppliedModels(newModels);
    },
    [selectedModelId, appliedModels, setAppliedModels]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (mainSceneRef.current) {
      setRefsReady(true);

      const mainDiv = mainSceneRef.current;

      const handleModelDrop = (e) => {
        e.preventDefault();
        if (!e.dataTransfer.types.includes("model")) return;

        const modelData = JSON.parse(e.dataTransfer.getData("model"));

        const rect = mainDiv.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 10 - 5;
        const y = 0.5;
        const z = -((e.clientY - rect.top) / rect.height) * 10 + 5;

        const newModel = {
          ...modelData,
          position: [x, y, z],
          id: `${modelData.id}-${Date.now()}`,
          rotation: [0, 0, 0],
          scale: 1,
        };

        setAppliedModels((prev) => [...prev, newModel]);
        setSelectedModelId(newModel.id);
      };

      const handleDragOver = (e) => {
        if (
          e.dataTransfer.types.includes("model") ||
          e.dataTransfer.types.includes("texture")
        ) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }
      };

      mainDiv.addEventListener("dragover", handleDragOver);
      mainDiv.addEventListener("drop", handleModelDrop);

      return () => {
        mainDiv.removeEventListener("dragover", handleDragOver);
        mainDiv.removeEventListener("drop", handleModelDrop);
      };
    }
  }, [setAppliedModels]);

  return (
    <>
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.3) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 3px;
          transition: background 0.2s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>

      {refsReady && (
        <Canvas
          shadows
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
          eventSource={document.body}
          eventPrefix="client"
        >
          <View.Port />
        </Canvas>
      )}
      <div className="h-screen w-full bg-[#103c1f] overflow-hidden">
        <div className="size-full flex">
          <div className="w-1/5 h-full">
            <LeftSidebar />
          </div>

          <div className="w-full h-full">
            <div className="size-full flex flex-col">
              <div className="w-full h-[90%] bg-[#303035]">
                <div className="size-full relative">
                  <div className="size-full" ref={mainSceneRef}>
                    <View className="size-full">
                      <ContactShadows
                        scale={20}
                        position={[0, 0, 0]}
                        opacity={0.8}
                        blur={2}
                      />
                      <StudioScene
                        models={appliedModels}
                        appliedTextures={appliedTextures}
                        onTextureApplied={handleTextureApplied}
                        selectedModel={selectedModelId}
                        onSelectModel={setSelectedModelId}
                        onModelPositionUpdate={handleModelPositionUpdate}
                      />
                      <OrbitControls makeDefault />
                    </View>
                  </div>
                </div>
              </div>
              <div className="w-full h-[10%]">
                <StudioInput />
              </div>
            </div>
          </div>

          {/* Integrated Room2DLayout */}
          <div className="w-1/5 h-full">
            <motion.aside
              ref={panelRef}
              onDragOver={handleDragOver}
              style={{ userSelect: "none" }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className=" overflow-hidden bg-[#AD9A8C] text-white w-full p-4 h-full flex flex-col shadow-xl"
            >
              <div className="h-full flex flex-col items-end justify-between">
                <div className="flex-grow overflow-hidden mb-3 w-full">
                  <div className="flex justify-between items-center">
                    <div className="bg-gradient-to-r w-fit from-[#60483E] p-1 to-[#BF7E3C] rounded-sm">
                      <div className="bg-[#EFE5DC] px-2 py-1 rounded-sm flex items-center gap-1">
                        <FaDollarSign className="text-[#493D31] text-sm" />
                        <span className="text-[#493D31] font-medium">
                          {userCredits}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r w-fit from-[#60483E] p-1 to-[#BF7E3C] rounded-sm">
                      <div className="bg-[#EFE5DC] px-2 py-1.5 rounded-sm cursor-pointer hover:bg-[#D7CCC6] transition-colors duration-200">
                        <FaUser className="text-[#493D31] text-xl" />
                      </div>
                    </div>
                  </div>
                  <Inventory />
                </div>
                <SceneList />
                <motion.div
                  className="mt-auto mx-auto pt-4 w-[50%]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                    <div className="bg-[#EFE5DC] p-1.5 rounded-md ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="#493D31"
                      >
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                      </svg>
                    </div>
                    <p className="text-[#653A1A]">Floor Box</p>
                  </h3>
                  <div className="space-y-3 w-full aspect-square">
                    <div ref={viewBoxRef} className="size-full border-1">
                      <View className="size-full">
                        <ContactShadows
                          scale={20}
                          position={[0, 0, 0]}
                          opacity={0.8}
                          blur={2}
                        />
                        <StudioScene
                          models={appliedModels}
                          appliedTextures={appliedTextures}
                          onTextureApplied={handleTextureApplied}
                          selectedModel={selectedModelId}
                          onSelectModel={setSelectedModelId}
                          onModelPositionUpdate={handleModelPositionUpdate}
                        />
                        <OrthographicCamera
                          makeDefault // Activate this camera for the view
                          position={[0, 10, 0]} // Center of room (x), above ceiling (y), center (z)
                          rotation={[-Math.PI / 2, 0, 0]} // Rotate to look straight down
                          near={5} // Start rendering 5 units below camera
                          far={15} // Render up to 15 units below camera
                          left={-5} // Frustum bounds (room width: 10)
                          right={5}
                          zoom={100}
                          top={5} // Room depth: 10
                          bottom={-5}
                        />
                      </View>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudioPage;
