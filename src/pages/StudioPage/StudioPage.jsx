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

const wallNames = {
  floor: "Floor",
  ceiling: "Ceiling",
  back: "Back Wall",
  front: "Front Wall",
  left: "Left Wall",
  right: "Right Wall",
};

const StudioPage = () => {
  const viewBoxRef = useRef();
  const mainSceneRef = useRef();
  const [refsReady, setRefsReady] = useState(false);
  const { appliedModels, setAppliedModels } = useModelContext();
  const { appliedTextures, setAppliedTextures } = useTextureContext();
  const [selectedModelId, setSelectedModelId] = useState(null);

  // Handle texture application notification
  const handleTextureApplied = (textureName, wallId) => {
    toast.success(`${textureName} applied to ${wallNames[wallId]}`);

    // Update appliedTextures - remove existing texture with same ref and add new one
    setAppliedTextures((prev) => {
      const filtered = prev
        ? prev.filter((texture) => texture.ref !== wallId)
        : [];
      return [...filtered, { ref: wallId, textureName, wallId }];
    });
  };

  // Handle model position update
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

  // Handle keyboard shortcuts
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
          // Delete selected model
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

          <div className={"w-full  h-full"}>
            <div className="size-full flex flex-col">
              <div className="w-full h-[90%] bg-[#303035]">
                <div className="border-1 size-full relative">
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

          <div className="w-1/5 h-full">
            <div className="size-full flex flex-col items-center ">
              <div className="w-full flex justify-between p-2">
                <div className="w-2/5">
                  <CreditButton />
                </div>
                <div className="w-fit">
                  <ProfileButton />
                </div>
              </div>

              <div className="w-full p-2"></div>

              <div className="w-full h-50 overflow-hidden p-2">
                <div className="w-full h-full overflow-hidden">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudioPage;
