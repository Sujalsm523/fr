import {
  useGLTF,
  Environment,
  Grid,
  OrbitControls,
  Outlines,
  Text,
  CameraControls,
  DragControls, // Import DragControls
} from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useMemo,
  memo,
} from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

const DraggableModel = memo(
  ({
    url,
    position,
    rotation = [0, 0, 0],
    scale = 1,
    onSelect,
    isSelected,
    onPositionUpdate,
    modelId,
    roomDimensions = { width: 10, height: 5, depth: 10 },
  }) => {
    const model = useGLTF(url);
    const meshRef = useRef();
    const groupRef = useRef();
    const [dimensions, setDimensions] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const { camera, gl } = useThree();
    const [currentSurface, setCurrentSurface] = useState("floor");

    useLayoutEffect(() => {
      if (model.nodes.geometry_0?.geometry) {
        const geometry = model.nodes.geometry_0.geometry;
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        setDimensions({
          width: size.x * scale,
          height: size.y * scale,
          depth: size.z * scale,
        });
      }
    }, [model, scale]);

    // Detect which surface the model is on
    const detectSurface = (pos) => {
      const { width, height, depth } = roomDimensions;
      const threshold = 0.3;
      const halfWidth = width / 2;
      const halfDepth = depth / 2;

      // Floor detection
      if (pos[1] < threshold) return "floor";
      // Ceiling detection
      if (pos[1] > height - threshold) return "ceiling";
      // Wall detection
      if (Math.abs(pos[2] + halfDepth) < threshold) return "back";
      if (Math.abs(pos[2] - halfDepth) < threshold) return "front";
      if (Math.abs(pos[0] + halfWidth) < threshold) return "left";
      if (Math.abs(pos[0] - halfWidth) < threshold) return "right";

      return "floor";
    };

    const handleDragStart = (e) => {
      e.stopPropagation();
      setIsDragging(true);
      onSelect();
      const position = groupRef.current.position.toArray();
      setCurrentSurface(detectSurface(position));
    };

    const handleDrag = (e) => {
      if (!isDragging || !groupRef.current || !dimensions) return;

      const newPosition = groupRef.current.position.toArray();
      const { width, height, depth } = roomDimensions;
      const halfWidth = width / 2;
      const halfDepth = depth / 2;
      const roomHeight = height;

      // Calculate model's half dimensions for accurate collision detection
      const modelHalfWidth = dimensions.width / 2;
      const modelHalfDepth = dimensions.depth / 2;
      const modelHalfHeight = dimensions.height / 2;

      // Apply surface-specific constraints
      switch (currentSurface) {
        case "floor":
        case "ceiling":
          newPosition[1] = groupRef.current.position.y; // Lock to surface height
          newPosition[0] = Math.max(
            -halfWidth + modelHalfWidth,
            Math.min(halfWidth - modelHalfWidth, newPosition[0])
          );
          newPosition[2] = Math.max(
            -halfDepth + modelHalfDepth,
            Math.min(halfDepth - modelHalfDepth, newPosition[2])
          );
          break;

        case "back":
        case "front":
          newPosition[2] = groupRef.current.position.z; // Lock to wall depth
          newPosition[0] = Math.max(
            -halfWidth + modelHalfWidth,
            Math.min(halfWidth - modelHalfWidth, newPosition[0])
          );
          newPosition[1] = Math.max(
            modelHalfHeight,
            Math.min(roomHeight - modelHalfHeight, newPosition[1])
          );
          break;

        case "left":
        case "right":
          newPosition[0] = groupRef.current.position.x; // Lock to wall position
          newPosition[2] = Math.max(
            -halfDepth + modelHalfDepth,
            Math.min(halfDepth - modelHalfDepth, newPosition[2])
          );
          newPosition[1] = Math.max(
            modelHalfHeight,
            Math.min(roomHeight - modelHalfHeight, newPosition[1])
          );
          break;
      }

      groupRef.current.position.set(...newPosition);
      onPositionUpdate(modelId, newPosition);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    useEffect(() => {
      if (groupRef.current && !isDragging) {
        const position = groupRef.current.position.toArray();
        setCurrentSurface(detectSurface(position));
      }
    }, [position, isDragging]);

    return (
      <DragControls
        enabled={isSelected}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        <group
          ref={groupRef}
          position={position}
          rotation={rotation}
          scale={[scale, scale, scale]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          <mesh
            castShadow
            receiveShadow
            ref={meshRef}
            geometry={model.nodes.geometry_0.geometry}
            material={model.materials[""]}
          >
            {isSelected && <Outlines angle={0} thickness={1.1} color="red" />}
          </mesh>

          {/* {dimensions && isSelected && (
            <Text
              position={[0, dimensions.height / scale + 0.2, 0]}
              color="white"
              fontSize={0.2}
              anchorX="center"
              anchorY="middle"
            >
              {`W:${dimensions.width.toFixed(2)} H:${dimensions.height.toFixed(
                2
              )} D:${dimensions.depth.toFixed(2)}`}
            </Text>
          )} */}
        </group>
      </DragControls>
    );
  }
);

const Wall = memo(
  ({
    position,
    rotation,
    geometryArgs,
    wallId,
    textureUrl,
    isHighlighted,
    onDragOver,
    onDragLeave,
    onDrop,
  }) => {
    const materialRef = useRef();

    useLayoutEffect(() => {
      if (textureUrl) {
        const loader = new THREE.TextureLoader();
        loader.load(textureUrl, (texture) => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(5, 5);
          if (materialRef.current) {
            materialRef.current.map = texture;
            materialRef.current.needsUpdate = true;
          }
        });
      } else if (materialRef.current) {
        materialRef.current.map = null;
        materialRef.current.needsUpdate = true;
      }
    }, [textureUrl]);

    return (
      <mesh
        position={position}
        rotation={rotation}
        onPointerOver={() => onDragOver(wallId)}
        onPointerOut={() => onDragLeave(wallId)}
        onPointerUp={(e) => {
          if (e.intersections[0]?.object === e.eventObject) {
            onDrop(wallId);
          }
        }}
      >
        <planeGeometry args={geometryArgs} />
        <meshStandardMaterial
          ref={materialRef}
          color={isHighlighted ? "#ff9999" : "white"}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  }
);

const Room = memo(
  ({
    width = 10,
    height = 5,
    depth = 10,
    position = [0, 0, 0],
    wallTextures = {},
    highlightedWall = null,
    onDragOver,
    onDragLeave,
    onDrop,
  }) => {
    return (
      <group position={position}>
        <Wall
          position={[0, 0, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          geometryArgs={[width, depth]}
          wallId="floor"
          textureUrl={wallTextures.floor}
          isHighlighted={highlightedWall === "floor"}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        />
        <Wall
          position={[0, height, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          geometryArgs={[width, depth]}
          wallId="ceiling"
          textureUrl={wallTextures.ceiling}
          isHighlighted={highlightedWall === "ceiling"}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        />
        <Wall
          position={[0, height / 2, -depth / 2]}
          rotation={[0, 0, 0]}
          geometryArgs={[width, height]}
          wallId="back"
          textureUrl={wallTextures.back}
          isHighlighted={highlightedWall === "back"}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        />
        <Wall
          position={[0, height / 2, depth / 2]}
          rotation={[0, Math.PI, 0]}
          geometryArgs={[width, height]}
          wallId="front"
          textureUrl={wallTextures.front}
          isHighlighted={highlightedWall === "front"}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        />
        <Wall
          position={[-width / 2, height / 2, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          geometryArgs={[depth, height]}
          wallId="left"
          textureUrl={wallTextures.left}
          isHighlighted={highlightedWall === "left"}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        />
        <Wall
          position={[width / 2, height / 2, 0]}
          rotation={[0, Math.PI / 2, 0]}
          geometryArgs={[depth, height]}
          wallId="right"
          textureUrl={wallTextures.right}
          isHighlighted={highlightedWall === "right"}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        />
      </group>
    );
  }
);

const StudioScene = ({
  models = [],
  appliedTextures = [],
  onTextureApplied,
  selectedModel,
  onSelectModel,
  onModelPositionUpdate,
}) => {
  const { gridSize, ...gridConfig } = useControls({
    gridSize: [10.5, 10.5],
    cellSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    cellColor: "#6f6f6f",
    sectionSize: { value: 3.3, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    sectionColor: "#9d4b4b",
    fadeDistance: { value: 25, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: false,
    infiniteGrid: true,
  });

  const [highlightedWall, setHighlightedWall] = useState(null);
  const [pendingTexture, setPendingTexture] = useState(null);
  const roomDimensions = useMemo(
    () => ({ width: 10, height: 5, depth: 10 }),
    []
  );

  // Convert appliedTextures array to wallTextures object
  const wallTextures = useMemo(() => {
    const textures = {
      floor: null,
      ceiling: null,
      back: null,
      front: null,
      left: null,
      right: null,
    };

    if (appliedTextures) {
      appliedTextures.forEach((texture) => {
        if (
          texture.ref &&
          Object.prototype.hasOwnProperty.call(textures, texture.ref)
        ) {
          textures[texture.ref] = texture.url || texture.textureUrl;
        }
      });
    }

    return textures;
  }, [appliedTextures]);

  const handleDragOver = (wallId) => {
    setHighlightedWall(wallId);
  };

  const handleDragLeave = (wallId) => {
    if (highlightedWall === wallId) {
      setHighlightedWall(null);
    }
  };

  const handleDrop = (wallId) => {
    if (pendingTexture) {
      if (onTextureApplied) {
        onTextureApplied(pendingTexture.name, wallId, pendingTexture);
      }
      setPendingTexture(null);
    }
    setHighlightedWall(null);
  };

  useEffect(() => {
    const handleTextureDragOver = (e) => {
      if (e.dataTransfer.types.includes("texture")) {
        e.preventDefault();
      }
    };

    const handleTextureDrop = (e) => {
      if (e.dataTransfer.types.includes("texture")) {
        e.preventDefault();
        const textureData = JSON.parse(e.dataTransfer.getData("texture"));
        setPendingTexture(textureData);
      }
    };

    document.body.addEventListener("dragover", handleTextureDragOver);
    document.body.addEventListener("drop", handleTextureDrop);

    return () => {
      document.body.removeEventListener("dragover", handleTextureDragOver);
      document.body.removeEventListener("drop", handleTextureDrop);
    };
  }, []);

  return (
    <>
      <Physics gravity={[0, -9.8, 0]}>
        <ambientLight intensity={0.5} />
        <Environment preset="city" />
        <Grid
          position={[0, -0.01, 0]}
          side={THREE.DoubleSide}
          args={gridSize}
          {...gridConfig}
        />
        <RigidBody type="fixed">
          <Room
            width={10}
            height={5}
            depth={10}
            position={[0, 0.01, 0]}
            wallTextures={wallTextures}
            highlightedWall={highlightedWall}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        </RigidBody>

        {models.map((model) => (
          <RigidBody key={model.id}>
            <DraggableModel
              url={model.url}
              position={model.position}
              rotation={model.rotation}
              scale={model.scale}
              onSelect={() => onSelectModel(model.id)}
              isSelected={selectedModel === model.id}
              onPositionUpdate={onModelPositionUpdate}
              modelId={model.id}
              roomDimensions={roomDimensions}
            />
          </RigidBody>
        ))}
      </Physics>
    </>
  );
};

export default StudioScene;
