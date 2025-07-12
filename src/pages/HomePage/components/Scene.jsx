import { React, Suspense, useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Environment, Html, useDetectGPU } from "@react-three/drei";
import HouseModel from "./HouseModel";
import { useScrollContext } from "../../../context/ScrollContext";

// WebGL availability check
function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

const Scene = ({ cameraGroup, camera, lerpFactor = 0.1, mouseOffset }) => {
  const { scrollProgress, setScrollProgress, targetScrollProgress } =
    useScrollContext();
  const [isMobile, setIsMobile] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const GPUTier = useDetectGPU();

  const [pulseIntensity, setPulseIntensity] = useState(0);
  const [textOpacity, setTextOpacity] = useState(1);
  const [currentText, setCurrentText] = useState(0);
  const textTimeout = useRef();
  const [rotationBufferQuat] = useState(
    new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.12, 0.17, 0.02))
  );

  // Mobile detection and WebGL check
  useEffect(() => {
    const mobileCheck = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);
    setWebglAvailable(isWebGLAvailable());

    // Reduce quality for mobile
    if (mobileCheck && camera?.current) {
      THREE.Cache.enabled = true;
      camera.current.fov = 60;
      camera.current.updateProjectionMatrix();
    }
  }, [camera]);

  // Camera curve definition
  const cameraCurve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-3, 3, 4.5), //0
      new THREE.Vector3(-2.2, 3, 4.3), //0
      new THREE.Vector3(-2.5, 3, 2), //1
      new THREE.Vector3(-3, 3, 1), //2
      new THREE.Vector3(-3.2, 3, 0), //3
      new THREE.Vector3(-3.5, 3.2, -2), //4
      new THREE.Vector3(-3, 3.5, -3), //5
      new THREE.Vector3(-2.7, 3, -2), //6
      new THREE.Vector3(-2.7, 3, -0.9), //7
      new THREE.Vector3(-0.6, 3, -0.9), //8
      new THREE.Vector3(0, 3, -2.5), //9
      new THREE.Vector3(1, 3.5, -3.3), //10
      new THREE.Vector3(3, 3, -2.5), //11
      new THREE.Vector3(2, 3, -0.5), //12
      new THREE.Vector3(1, 3.5, -0.5), //13
      new THREE.Vector3(0, 3, -0.5), //14
      new THREE.Vector3(0, 3, 1), //15
      new THREE.Vector3(-0.2, 3, 3.5), //16
      new THREE.Vector3(0.2, 3.5, 3.1), //17
      new THREE.Vector3(2, 3, 3), //18
      new THREE.Vector3(2.4, 3, 2), //19
      new THREE.Vector3(6, 3, 1.7), //20
      new THREE.Vector3(10, 3, 1.7), //21
    ],
    false
  );

  const rotationTargets = [
    {
      progress: 0,
      rotation: new THREE.Euler(0, -0.3, 0.02),
    },
    {
      progress: 0.03,
      rotation: new THREE.Euler(0, 0.1, 0.02),
    },
    {
      progress: 0.15,
      rotation: new THREE.Euler(0, -0.3, 0.02),
    },
    {
      progress: 0.16,
      rotation: new THREE.Euler(0, -0.4, 0.02),
    },
    {
      progress: 0.22,
      rotation: new THREE.Euler(0, -3, 0.02),
    },
    {
      progress: 0.32,
      rotation: new THREE.Euler(0, -1.48, 0.02),
    },
    {
      progress: 0.32,
      rotation: new THREE.Euler(0, -1.48, 0.02),
    },
    {
      progress: 0.37,
      rotation: new THREE.Euler(0, -Math.PI / 2, 0),
    },
    {
      progress: 0.54,
      rotation: new THREE.Euler(0, 2, 0),
    },
    {
      progress: 0.6,
      rotation: new THREE.Euler(0, -0.5, 0),
    },
    {
      progress: 0.65,
      rotation: new THREE.Euler(0, 3, 0),
    },
    {
      progress: 0.7,
      rotation: new THREE.Euler(0, 3, 0),
    },
    {
      progress: 0.75,
      rotation: new THREE.Euler(0, 0, 0),
    },
    {
      progress: 0.89,
      rotation: new THREE.Euler(0, -Math.PI / 2, 0),
    },
    {
      progress: 0.9,
      rotation: new THREE.Euler(0, -Math.PI / 2, 0),
    },
    {
      progress: 1,
      rotation: new THREE.Euler(0, -Math.PI / 2, 0),
    },
  ];

  const getLerpedRotation = (progress) => {
    for (let i = 0; i < rotationTargets.length - 1; i++) {
      const start = rotationTargets[i];
      const end = rotationTargets[i + 1];
      if (progress >= start.progress && progress <= end.progress) {
        const lerpFactor =
          (progress - start.progress) / (end.progress - start.progress);

        const startQuaternion = new THREE.Quaternion().setFromEuler(
          start.rotation
        );
        const endQuaternion = new THREE.Quaternion().setFromEuler(end.rotation);

        const lerpingQuaternion = new THREE.Quaternion();
        lerpingQuaternion.slerpQuaternions(
          startQuaternion,
          endQuaternion,
          lerpFactor
        );

        return lerpingQuaternion;
      }
    }
    return new THREE.Quaternion().setFromEuler(
      rotationTargets[rotationTargets.length - 1].rotation
    );
  };

  useFrame((state) => {
    if (!camera?.current || !webglAvailable) return;

    // Reduce rendering frequency on mobile to improve performance
    if (isMobile && state.clock.elapsedTime % 2 < 0.1) return;

    const newPulseIntensity = (Math.sin(state.clock.elapsedTime * 3) + 1) / 2;
    setPulseIntensity(newPulseIntensity);

    let newProgress = THREE.MathUtils.lerp(
      scrollProgress,
      targetScrollProgress.current,
      lerpFactor
    );

    if (newProgress > 1) {
      newProgress = 1;
      targetScrollProgress.current = 1;
    } else if (newProgress < 0) {
      newProgress = 0;
      targetScrollProgress.current = 0;
    }

    setScrollProgress(newProgress);

    const basePoint = cameraCurve.getPoint(newProgress);

    // Update group position (path animation)
    if (cameraGroup?.current) {
      cameraGroup.current.position.x = THREE.MathUtils.lerp(
        cameraGroup.current.position.x,
        basePoint.x,
        0.1
      );
      cameraGroup.current.position.y = THREE.MathUtils.lerp(
        cameraGroup.current.position.y,
        basePoint.y,
        0.1
      );
      cameraGroup.current.position.z = THREE.MathUtils.lerp(
        cameraGroup.current.position.z,
        basePoint.z,
        0.1
      );

      const targetQuaternion = getLerpedRotation(newProgress);
      rotationBufferQuat.slerp(targetQuaternion, 0.1);
      cameraGroup.current.quaternion.copy(rotationBufferQuat);
    }

    // Update camera local position (parallax)
    if (mouseOffset?.current) {
      camera.current.position.x = THREE.MathUtils.lerp(
        camera.current.position.x,
        mouseOffset.current.x,
        0.1
      );
      camera.current.position.y = THREE.MathUtils.lerp(
        camera.current.position.y,
        -mouseOffset.current.y,
        0.1
      );
      camera.current.position.z = 0;
    }

    // Text overlay logic
    const shouldSwitchText = newProgress >= 0.5;
    const targetOpacity = shouldSwitchText === (currentText === 1) ? 1 : 0;

    // Smooth opacity animation
    setTextOpacity((prev) => THREE.MathUtils.lerp(prev, targetOpacity, 0.1));

    // Switch text content when opacity is low enough
    if (textOpacity < 0.01 && shouldSwitchText !== (currentText === 1)) {
      clearTimeout(textTimeout.current);
      textTimeout.current = setTimeout(() => {
        setCurrentText(shouldSwitchText ? 1 : 0);
        setTextOpacity(0);
      }, 50);
    }
  });

  if (!webglAvailable) {
    return (
      <Html center>
        <div
          style={{
            padding: "2rem",
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            textAlign: "center",
            borderRadius: "8px",
            maxWidth: "80vw",
          }}
        >
          <h2>WebGL Not Supported</h2>
          <p>
            Your device/browser does not support WebGL. Please try a modern
            browser like Chrome or Firefox.
          </p>
        </div>
      </Html>
    );
  }

  return (
    <>
      <Environment
        background={true}
        backgroundRotation={[0, Math.PI / 2, 0]}
        files={[
          "/tenefirecm/posx.jpg",
          "/tenefirecm/negx.jpg",
          "/tenefirecm/posy.jpg",
          "/tenefirecm/negy.jpg",
          "/tenefirecm/posz.jpg",
          "/tenefirecm/negz.jpg",
        ]}
      />

      <HouseModel />
    </>
  );
};

export default Scene;
