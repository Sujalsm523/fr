import { useGLTF } from "@react-three/drei";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const HouseModel = ({ position = [0, 0, 0], scale = 1 }) => {
  const group = useRef();
  const { scene } = useGLTF("/models/roomrooften.glb");
  const originalMaterials = useRef(new Map());

  // Mobile compatibility fixes
  useEffect(() => {
    if (!scene) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Store original materials for restoration
        originalMaterials.current.set(child, child.material);

        // Fix black material issue
        child.material.needsUpdate = true;

        // Ensure proper color space
        if (child.material.map) {
          child.material.map.colorSpace = THREE.SRGBColorSpace;
          child.material.map.flipY = false;
          child.material.map.minFilter = THREE.LinearFilter;
          child.material.map.magFilter = THREE.LinearFilter;
        }

        // Fix completely black materials
        if (child.material.color?.getHex() === 0x000000) {
          child.material.color.setHex(0x808080);
        }

        // Mobile-specific optimizations
        if (isMobile) {
          // Simplify materials for mobile
          if (child.material.isMeshStandardMaterial) {
            // Reduce texture quality
            if (child.material.map) {
              child.material.map.anisotropy = 1;
            }

            // Disable expensive features
            child.material.roughness = 1;
            child.material.metalness = 0;
            child.material.envMapIntensity = 0;
            if (child.material.normalMap) {
              child.material.normalScale.set(0, 0);
            }
          }
        }
      }
    });

    return () => {
      // Restore original materials to prevent memory leaks
      originalMaterials.current.forEach((material, child) => {
        if (child.isMesh) child.material = material;
      });
    };
  }, [scene]);

  return (
    <group ref={group} position={position} scale={scale}>
      <primitive
        object={scene}
        dispose={null}
        position={[0, 2, 0]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
};

export default HouseModel;
