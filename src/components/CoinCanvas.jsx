import { CameraControls, Gltf } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

const CoinModel = () => {
  const coinRef = useRef();

  useFrame((state, delta) => {
    if (coinRef.current) {
      coinRef.current.rotation.y += delta;
    }
  });

  return (
    <Gltf
      src="/models/coin.glb"
      scale={16}
      position={[0, 0, 0]}
      ref={coinRef}
    />
  );
};

const CoinCanvas = () => {
  return (
    <Canvas>
      {/* Enhanced ambient light */}
      <ambientLight intensity={1.5} color="#ffffff" />

      {/* Primary directional light */}
      <directionalLight
        position={[3, 5, 2]}
        intensity={2.5}
        color="#ffffff"
        castShadow
      />

      {/* Secondary directional light (fill light) */}
      <directionalLight
        position={[-3, 2, -1]}
        intensity={1.2}
        color="#ffeedd"
      />

      {/* Backlight for rim highlights */}
      <directionalLight
        position={[0, -1, -3]}
        intensity={1.8}
        color="#4466ff"
      />

      {/* Point light for specular highlights */}
      <pointLight
        position={[1, 3, 0]}
        intensity={15}
        distance={10}
        decay={2}
        color="#ffeeaa"
      />

      <CoinModel />
      <CameraControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        truckSpeed={0}
      />
    </Canvas>
  );
};

export default CoinCanvas;
