import { create } from "zustand"; // Fixed import
import * as THREE from "three";

export const matrix = new THREE.Matrix4();
export const positions = {
  Top: [0, 10, 0],
  Bottom: [0, -10, 0],
  Left: [-10, 0, 0],
  Right: [10, 0, 0],
  Back: [0, 0, -10],
  Front: [0, 0, 10],
};

export const useStore = create((set) => ({
  projection: "Perspective",
  top: "Back",
  middle: "Top",
  bottom: "Right",
  setPanelView: (which, view) => set({ [which]: view }),
  setProjection: (projection) => set({ projection }),
}));
