import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import { PerspectiveCamera } from "@react-three/drei";
import normalizeWheel from "normalize-wheel";
import TextOverlay from "./TextOverlay";
import { useScrollContext } from "../../../context/ScrollContext";

const HomePageExperience = () => {
  const cameraGroup = useRef();
  const camera = useRef();
  const scrollSpeed = 0.005;
  const lerpFactor = 0.1;
  const isSwiping = useRef(false);
  const mouseOffset = useRef(new THREE.Vector3());
  const isModalOpen = false;
  const lastTouchY = useRef(null);

  // Mobile speed multiplier ref
  const touchMultiplier = useRef(0.3);

  // Use scroll context
  const { scrollProgress, setScrollProgress, targetScrollProgress } =
    useScrollContext();

  useEffect(() => {
    // Detect mobile devices and adjust speed
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (isMobile) {
      touchMultiplier.current = 0.6; // Double the original 0.3 value
    }

    // Mouse wheel: scroll down = forward, scroll up = backward
    const handleWheel = (e) => {
      if (isModalOpen) return;
      const normalized = normalizeWheel(e);

      targetScrollProgress.current +=
        Math.sign(normalized.pixelY) * // Removed negative sign for your requirements
        scrollSpeed *
        Math.min(Math.abs(normalized.pixelY) / 100, 1);
    };

    const handleMouseMove = (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = (e.clientY / window.innerHeight) * 2 - 1;

      const sensitivityX = 0.25;
      const sensitivityY = 0.25;

      mouseOffset.current.x = mouseX * sensitivityX;
      mouseOffset.current.y = mouseY * sensitivityY;
    };

    // Touch: down = backward, up = forward
    const handleTouchStart = (e) => {
      if (isModalOpen) return;
      isSwiping.current = true;
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!isSwiping.current) return;

      if (lastTouchY.current !== null) {
        const deltaY = e.touches[0].clientY - lastTouchY.current;
        // Use mobile-adjusted multiplier
        targetScrollProgress.current +=
          -Math.sign(deltaY) * scrollSpeed * touchMultiplier.current;
      }
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      isSwiping.current = false;
      lastTouchY.current = null;
    };

    const handleMouseDown = (e) => {
      if (isModalOpen || e.pointerType === "touch") return;
      isSwiping.current = true;
    };

    // Mouse drag: down = backward, up = forward
    const handleMouseDrag = (e) => {
      if (!isSwiping.current || e.pointerType === "touch") return;
      const mouseMultiplier = 0.2;
      targetScrollProgress.current +=
        -Math.sign(e.movementY) * scrollSpeed * mouseMultiplier;
    };

    const handleMouseUp = () => {
      isSwiping.current = false;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseDrag);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseDrag);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isModalOpen]);

  return (
    <>
      <Canvas eventSource={document.getElementById("root")}>
        <ambientLight intensity={1.5} />
        <Scene
          cameraGroup={cameraGroup}
          camera={camera}
          scrollProgress={scrollProgress}
          setScrollProgress={setScrollProgress}
          targetScrollProgress={targetScrollProgress}
          lerpFactor={lerpFactor}
          mouseOffset={mouseOffset}
        />
        <group ref={cameraGroup}>
          <PerspectiveCamera
            ref={camera}
            makeDefault
            fov={70}
            position={[0, 0, 0]}
          />
        </group>
      </Canvas>
      <TextOverlay scrollProgress={scrollProgress} />
    </>
  );
};

export default HomePageExperience;
