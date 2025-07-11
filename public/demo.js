// // const demoScene = {
// //   status: true,
// //   scenes: [
// //     {
// //       scene_id: "scene_2a5886c6",
// //       scene_name: "Living Room",
// //       scene_dim: "100x100",
// //       created_at: "2023-06-15T10:30:00.000Z",
// //       last_updated: "2023-06-15T11:45:00.000Z",
// //       model_count: 5,
// //       texture_count: 3,
// //     },
// //     {
// //       scene_id: "scene_2a56",
// //       scene_name: "Living Room 2",
// //       scene_dim: "100x100",
// //       created_at: "2023-06-15T10:30:00.000Z",
// //       last_updated: "2023-06-15T11:45:00.000Z",
// //       model_count: 5,
// //       texture_count: 3,
// //     },
// //   ],
// //   total_scenes: 1,
// // };

// // const demoPlacedItems = [
// //   {
// //     id: 1749737547503,
// //     name: "Wooden Table",
// //     category: "Table",
// //     model_url: "/src/models/table.glb",
// //     model_front_img: "/src/assets/table.png",
// //     model_top_img: "/src/assets/table.png",
// //     pos_ref: "Floor",
// //     pos: {
// //       x: 0.6349567817101831,
// //       y: 0,
// //       z: -1.110571675981014,
// //     },
// //     rotation: {
// //       x: 0,
// //       y: 0,
// //       z: 0,
// //     },
// //     scale: 1,
// //   },
// //   {
// //     id: 1749737557667,
// //     name: "Wooden Table",
// //     category: "Table",
// //     model_url: "/src/models/table.glb",
// //     model_front_img: "/src/assets/table.png",
// //     model_top_img: "/src/assets/table.png",
// //     pos_ref: "Floor",
// //     pos: {
// //       x: -1.849877259418506,
// //       y: 8.445041656488462e-21,
// //       z: 3.0982372900422543,
// //     },
// //     rotation: {
// //       x: 0,
// //       y: 0,
// //       z: 0,
// //     },
// //     scale: 1,
// //   },
// //   {
// //     id: 1749737574636,
// //     name: "Cushion Sofa",
// //     category: "Sofa",
// //     model_url: "https://furnoaitesting.s3.us-east-1.amazonaws.com/sofa.glb",
// //     model_front_img: "/src/assets/sofa.png",
// //     model_top_img: "/src/assets/sofa.png",
// //     pos_ref: "Floor",
// //     pos: {
// //       x: -1.2450431530771082,
// //       y: 1.8391089576602301e-16,
// //       z: 1.1052322767434863,
// //     },
// //     rotation: {
// //       x: 0,
// //       y: 0,
// //       z: 0,
// //     },
// //     scale: 1,
// //   },
// // ];

// const demoappliedTextures = [
//   {
//     id: 1749762286083,
//     texture_name: "granite wall",
//     texture_url: "/src/assets/wall.png",
//     texture_ref: "Floor",
//   },
//   {
//     id: 1749762296748,
//     texture_name: "Room Wall",
//     texture_url: "/src/assets/texture1.jpg",
//     texture_ref: "D",
//   },
//   {
//     id: 1749762299467,
//     texture_name: "Room Wall",
//     texture_url: "/src/assets/texture1.jpg",
//     texture_ref: "A",
//   },
//   {
//     id: 1749762290995,
//     texture_name: "granite wall",
//     texture_url: "/src/assets/wall.png",
//     texture_ref: "Roof",
//   },
//   {
//     id: 1749762294415,
//     texture_name: "Room Wall",
//     texture_url: "/src/assets/texture1.jpg",
//     texture_ref: "B",
//   },
//   {
//     id: 1749762302428,
//     texture_name: "Room Wall",
//     texture_url: "/src/assets/texture1.jpg",
//     texture_ref: "C",
//   },
// ];

// const furnitureModelsLibrary = [
//   {
//     name: "Wooden Chair",
//     category: "Chair",
//     model_url: chairmodel_url,
//     model_front_img: chairImg,
//     model_top_img: chairImg,
//     pos_ref: "Floor",
//     dim: { w: 1, l: 1, d: 1 },
//     pos: { x: 0, y: 0, z: 0 },
//     rotation: { x: 0, y: 0, z: 0 },
//   },
//   {
//     name: "Wooden Table",
//     category: "Table",
//     model_url: tablemodel_url,
//     model_front_img: tableImg,
//     model_top_img: tableImg,
//     pos_ref: "Floor",
//     dim: { w: 2, l: 1, d: 1 }, // Example dimensions, adjust as needed
//     pos: { x: 0, y: 0, z: 0 },
//     rotation: { x: 0, y: 0, z: 0 },
//   },
//   {
//     name: "Cushion Sofa",
//     category: "Sofa",
//     model_url: "https://furnoaitesting.s3.us-east-1.amazonaws.com/sofa.glb",
//     model_front_img: sofaImg,
//     model_top_img: sofaImg,
//     pos_ref: "Floor",
//     dim: { w: 2, l: 1, d: 1 }, // Example dimensions, adjust as needed
//     pos: { x: 0, y: 0, z: 0 },
//     rotation: { x: 0, y: 0, z: 0 },
//   },
//   {
//     name: "Wooden Door E",
//     category: "Door",
//     model_url: doormodel_url,
//     model_front_img: doorImg,
//     model_top_img: doorImg,
//     pos_ref: "E",
//     dim: { w: 1, l: 0.1, d: 2 }, // Example dimensions, adjust as needed
//     pos: { x: 0, y: 0, z: 0 },
//     rotation: { x: 0, y: 0, z: 0 },
//   },
//   {
//     name: "Wooden Door A",
//     category: "Door",
//     model_url: doormodel_url,
//     model_front_img: doorImg,
//     model_top_img: doorImg,
//     pos_ref: "A",
//     dim: { w: 1, l: 0.1, d: 2 }, // Example dimensions, adjust as needed
//     pos: { x: 0, y: 0, z: 0 },
//     rotation: { x: 0, y: 0, z: 0 },
//   },
//   {
//     name: "Wooden Door B",
//     category: "Door",
//     model_url: doormodel_url,
//     model_front_img: doorImg,
//     model_top_img: doorImg,
//     pos_ref: "B",
//     dim: { w: 1, l: 0.1, d: 2 }, // Example dimensions, adjust as needed
//     pos: { x: 0, y: 0, z: 0 },
//     rotation: { x: 0, y: 0, z: 0 },
//   },
//   {
//     name: "Wooden Door C",
//     category: "Door",
//     model_url: doormodel_url,
//     model_front_img: doorImg,
//     model_top_img: doorImg,
//     pos_ref: "C",
//     dim: { w: 1, l: 0.1, d: 2 }, // Example dimensions, adjust as needed
//     pos: { x: 0, y: 0, z: 0 },
//     rotation: { x: 0, y: 0, z: 0 },
//   },
//   {
//     name: "Wooden Door D",
//     category: "Door",
//     model_url: doormodel_url,
//     model_front_img: doorImg,
//     model_top_img: doorImg,
//     pos_ref: "D",
//     dim: { w: 1, l: 0.1, d: 2 }, // Example dimensions, adjust as needed
//     pos: { x: 0, y: 0, z: 0 },
//     rotation: { x: 0, y: 0, z: 0 },
//   },
//   {
//     name: "Wooden Fan",
//     category: "Fan",
//     model_url: fanmodel_url,
//     model_front_img: fanImg,
//     model_top_img: fanImg,
//     pos_ref: "Roof",
//     dim: { w: 1, l: 1, d: 1 },
//     pos: { x: 0, y: 0, z: 0 },
//     rotation: { x: 0, y: 0, z: 0 },
//   },
//   {
//     name: "Wooden TV",
//     category: "TV",
//     model_url: "",
//     model_front_img: tvImg,
//     model_top_img: tvImg,
//     pos_ref: "A",
//     dim: { w: 1, l: 0.1, d: 0.7 }, // Example dimensions, adjust as needed
//     pos: { x: 0, y: 0, z: 0 },
//     rotation: { x: 0, y: 0, z: 0 },
//   },
// ];

// const furnitureModelsInventory = [
//   {
//     name: "Wooden Chair",
//     category: "Chair",
//     model_url: chairmodel_url,
//     model_front_img: chairImg,
//     model_top_img: chairImg,
//     pos_ref: "Floor",
//     dim: { w: 1, l: 1, d: 1 },
//     pos: { x: 0, y: 0, z: 0 },
//     rotation: { x: 0, y: 0, z: 0 },
//   },
//   {
//     name: "Wooden Table",
//     category: "Table",
//     model_url: tablemodel_url,
//     model_front_img: tableImg,
//     model_top_img: tableImg,
//     pos_ref: "Floor",
//     dim: { w: 2, l: 1, d: 1 }, // Example dimensions, adjust as needed
//     pos: { x: 0, y: 0, z: 0 },
//     rotation: { x: 0, y: 0, z: 0 },
//   },
// ];

// const textureLibrary = [
//   {
//     texture_name: "granite wall",
//     texture_url: textureImg,
//     texture_ref: "Floor",
//   },
//   {
//     texture_name: "Room Wall",
//     texture_url: textureImg2,
//     texture_ref: "Roof",
//   },
//   {
//     texture_name: "Room Wall A",
//     texture_url: textureImg2,
//     texture_ref: "A",
//   },
//   {
//     texture_name: "Room Wall E",
//     texture_url: textureImg2,
//     texture_ref: "E",
//   },
// ];

// const textureInventory = [
//   {
//     texture_name: "granite wall",
//     texture_url: textureImg,
//     texture_ref: "Floor",
//   },
//   {
//     texture_name: "Room Wall",
//     texture_url: textureImg2,
//     texture_ref: "Roof",
//   },
//   {
//     texture_name: "Room Wall A",
//     texture_url: textureImg2,
//     texture_ref: "A",
//   },
//   {
//     texture_name: "Room Wall E",
//     texture_url: textureImg2,
//     texture_ref: "E",
//   },
// ];
