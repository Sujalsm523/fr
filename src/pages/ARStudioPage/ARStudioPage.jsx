// import React, { useRef, useEffect } from "react";
// import BabylonScene from "../components/BabylonScene";
// import { useParams } from "react-router-dom";
// import { useFurnitureContext } from "../context/FurnitureContext";

// const ARStudioPage = () => {
//   const babylonSceneRef = useRef(null);
//   const { userID, scene } = useParams();

//   const { fetchScene, roomDimensions } = ();

//   useEffect(() => {
//     fetchScene(userID, scene);
//   }, []);

//   // Default dimensions for the scene
//   const dimensions = {
//     width: roomDimensions.width,
//     height: roomDimensions.height,
//     depth: roomDimensions.depth,
//   };

//   return (
//     <div className="w-full h-screen">
//       <BabylonScene ref={babylonSceneRef} {...dimensions} />
//     </div>
//   );
// };

// export default ARStudioPage;

import React from "react";

const ARStudioPage = () => {
  return <div>ARStudioPage</div>;
};

export default ARStudioPage;
