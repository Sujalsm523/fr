import React, { useState, useRef } from "react";
import HomeButton from "../../../../components/buttons/HomeButton";
import InfoButton from "../../../../components/buttons/InfoButton";
import { useModelContext } from "../../../../context/ModelContext";
import { useTextureContext } from "../../../../context/TextureContext";
import { FaChevronDown, FaChevronRight, FaCube, FaImage } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

const LeftSidebar = ({ onRoomCreate }) => {
  const { libraryModels } = useModelContext();
  const { libraryTextures } = useTextureContext();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeLibraryTab, setActiveLibraryTab] = useState("models");
  const [selectedUnit, setSelectedUnit] = useState("m");
  const [isDragging, setIsDragging] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: 5,
    height: 5,
    depth: 5,
  });
  const [showGuidelines, setShowGuidelines] = useState(false);
  const dragImageRef = useRef(null);

  const guidelines = [
    "📦 The Inventory panel (right side) holds all generated 3D models",
    "🎬 The Scene section lets you create new scenes and switch between them",
    "📤 The Floor Box shows 2D mapping of models placed on the floor",
    "🪑 Drag and drop models from this library into the scene for placement",
    "📏 Set room dimensions before creating your room for accurate scaling",
    "🖱️ Click on any model to select and move it within the scene",
    "💾 Use the Save button to store your scene configurations",
    "🔄 Press 'R' to rotate selected models, '+' to scale up, '-' to scale down",
  ];

  const unitConversions = {
    m: 1,
    cm: 0.01,
    ft: 0.3048,
  };

  const convertToMeters = (value, fromUnit) =>
    Number((value * unitConversions[fromUnit]).toFixed(2));

  const convertFromMeters = (value, toUnit) =>
    Number((value / unitConversions[toUnit]).toFixed(2));

  // Group models by category
  const groupedModels = libraryModels.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Group textures by category
  const groupedTextures = libraryTextures.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleDragStart = (e, item, type) => {
    setIsDragging(true);

    // Create drag image
    const dragImage = new Image();
    dragImage.src =
      type === "model" ? "/founders/ab.jpg" : "/placeholder-texture.png";
    dragImageRef.current = dragImage;

    if (e.dataTransfer.setDragImage) {
      e.dataTransfer.setDragImage(dragImage, 24, 24);
    }

    // Set transfer data
    const itemData = {
      id: Date.now().toString(),
      name: item.name,
      category: item.category,
      type,
      ...(type === "model"
        ? { thumbnail: item.thumbnail }
        : { previewColor: item.previewColor }),
    };

    e.dataTransfer.setData("application/json", JSON.stringify(itemData));
  };

  const handleDragEnd = () => setIsDragging(false);

  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const handleDimensionChange = (dimension, value) => {
    setDimensions((prev) => ({ ...prev, [dimension]: value }));
  };

  const handleUnitChange = (newUnit) => {
    const newDimensions = {
      width: convertFromMeters(
        convertToMeters(dimensions.width, selectedUnit),
        newUnit
      ),
      height: convertFromMeters(
        convertToMeters(dimensions.height, selectedUnit),
        newUnit
      ),
      depth: convertFromMeters(
        convertToMeters(dimensions.depth, selectedUnit),
        newUnit
      ),
    };
    setSelectedUnit(newUnit);
    setDimensions(newDimensions);
  };

  const handleCreateRoom = () => {
    const { width, height, depth } = dimensions;
    if (width && height && depth) {
      onRoomCreate({
        width: convertToMeters(width, selectedUnit),
        height: convertToMeters(height, selectedUnit),
        depth: convertToMeters(depth, selectedUnit),
      });
    }
  };

  // Animation variants
  const categoryVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.2 },
    }),
  };

  return (
    <>
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #efe5dc transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #efe5dc;
          border-radius: 3px;
        }
      `}</style>

      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-[#493D31] text-white w-64 p-4 h-full flex flex-col shadow-xl"
      >
        {/* Top Buttons */}
        <div className="flex justify-between mb-4">
          <div className="bg-gradient-to-r from-[#60483E] to-[#BF7E3C] p-[2px] rounded-sm">
            <HomeButton className="bg-[#EFE5DC] hover:bg-[#D7CCC6]" />
          </div>
          <div className="bg-gradient-to-r from-[#60483E] to-[#BF7E3C] p-[2px] rounded-sm">
            <InfoButton
              onClick={() => setShowGuidelines(true)}
              className="bg-[#EFE5DC] hover:bg-[#D7CCC6]"
            />
          </div>
        </div>

        {/* Guidelines Popup */}
        {showGuidelines && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-[#EFE5DC] text-[#493D31] rounded-lg p-6 max-w-md w-full shadow-xl"
            >
              <button
                onClick={() => setShowGuidelines(false)}
                className="absolute top-4 right-4 text-xl text-[#493D31] hover:text-[#BF7E3C]"
              >
                <IoClose />
              </button>
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Guidelines
              </h2>
              <ul className="space-y-2">
                {guidelines.map((point, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}

        {/* Library Tabs */}
        <div className="flex mb-4 bg-[#A29F98] p-1 rounded-lg">
          <button
            onClick={() => setActiveLibraryTab("models")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              activeLibraryTab === "models"
                ? "bg-[#EFE5DC] shadow-md"
                : "hover:bg-[#A29F98]"
            }`}
          >
            <FaCube className="text-sm text-[#493D31]" />
            <span className="text-[#493D31]">Models</span>
          </button>
          <button
            onClick={() => setActiveLibraryTab("textures")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              activeLibraryTab === "textures"
                ? "bg-[#EFE5DC] shadow-md"
                : "hover:bg-[#A29F98]"
            }`}
          >
            <FaImage className="text-sm text-[#493D31]" />
            <span className="text-[#493D31]">Textures</span>
          </button>
        </div>

        {/* Models Library */}
        {activeLibraryTab === "models" && (
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4">
            <h3 className="text-lg font-semibold mb-3 text-[#EFE5DC]">
              3D Models Library
            </h3>
            {Object.entries(groupedModels).map(([category, items]) => (
              <div key={`model-${category}`} className="mb-3">
                <button
                  onClick={() => toggleCategory(`model-${category}`)}
                  className="w-full flex justify-between items-center p-2 bg-[#EFE5DC] rounded-md"
                >
                  <span className="font-medium text-[#493D31] flex items-center gap-2">
                    <FaCube className="text-[#493D31]" />
                    {category}
                  </span>
                  {activeCategory === `model-${category}` ? (
                    <FaChevronDown className="text-xs text-[#493D31]" />
                  ) : (
                    <FaChevronRight className="text-xs text-[#493D31]" />
                  )}
                </button>

                <AnimatePresence>
                  {activeCategory === `model-${category}` && (
                    <motion.div
                      variants={categoryVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="mt-2"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {items.map((item, i) => (
                          <motion.div
                            key={item.id}
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={itemVariants}
                            draggable
                            onDragStart={(e) =>
                              handleDragStart(e, item, "model")
                            }
                            onDragEnd={handleDragEnd}
                            className={`border border-[#BF7E3C] rounded-md p-2 cursor-grab bg-[#EFE5DC] ${
                              isDragging ? "opacity-70" : "hover:bg-[#D7CCC6]"
                            }`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <div className="text-3xl mb-1 flex justify-center">
                              {item.thumbnail}
                            </div>
                            <p className="text-sm font-medium text-[#493D31] text-center truncate">
                              {item.name}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {/* Textures Library */}
        {activeLibraryTab === "textures" && (
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4">
            <h3 className="text-lg font-semibold mb-3 text-[#EFE5DC]">
              Textures Library
            </h3>
            {Object.entries(groupedTextures).map(([category, items]) => (
              <div key={`texture-${category}`} className="mb-3">
                <button
                  onClick={() => toggleCategory(`texture-${category}`)}
                  className="w-full flex justify-between items-center p-2 bg-[#EFE5DC] rounded-md"
                >
                  <span className="font-medium text-[#493D31] flex items-center gap-2">
                    <FaImage className="text-[#493D31]" />
                    {category}
                  </span>
                  {activeCategory === `texture-${category}` ? (
                    <FaChevronDown className="text-xs text-[#493D31]" />
                  ) : (
                    <FaChevronRight className="text-xs text-[#493D31]" />
                  )}
                </button>

                <AnimatePresence>
                  {activeCategory === `texture-${category}` && (
                    <motion.div
                      variants={categoryVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="mt-2"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {items.map((item, i) => (
                          <motion.div
                            key={item.id}
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={itemVariants}
                            draggable
                            onDragStart={(e) =>
                              handleDragStart(e, item, "texture")
                            }
                            onDragEnd={handleDragEnd}
                            className={`rounded-md cursor-grab overflow-hidden ${
                              isDragging
                                ? "opacity-70"
                                : "hover:ring-2 hover:ring-[#BF7E3C]"
                            }`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <div
                              className="w-full h-12 rounded-md"
                              style={{ backgroundColor: item.previewColor }}
                            />
                            <p className="text-xs text-center text-[#EFE5DC] mt-1 truncate px-1">
                              {item.name}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {/* Room Dimensions */}
        <div className="mt-auto pt-4 border-t border-[#BF7E3C]">
          <div className="bg-gradient-to-r from-[#60483E] to-[#BF7E3C] p-[2px] rounded-sm mb-3">
            <div className="bg-[#EFE5DC] rounded-sm p-2">
              <h3 className="text-md font-semibold text-[#493D31] mb-2 flex items-center gap-2">
                <div className="bg-[#493D31] p-1 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-[#EFE5DC]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                  </svg>
                </div>
                Room Dimensions
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-[#D7CCC6] mb-1 block">
                  Width
                </label>
                <input
                  type="number"
                  min="0"
                  value={dimensions.width}
                  onChange={(e) =>
                    handleDimensionChange("width", e.target.value)
                  }
                  className="w-full p-2 bg-[#EFE5DC] border border-[#493D31] rounded-md text-xs text-[#493D31]"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-[#D7CCC6] mb-1 block">
                  Height
                </label>
                <input
                  type="number"
                  min="0"
                  value={dimensions.height}
                  onChange={(e) =>
                    handleDimensionChange("height", e.target.value)
                  }
                  className="w-full p-2 bg-[#EFE5DC] border border-[#493D31] rounded-md text-xs text-[#493D31]"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-[#D7CCC6] mb-1 block">
                  Depth
                </label>
                <input
                  type="number"
                  min="0"
                  value={dimensions.depth}
                  onChange={(e) =>
                    handleDimensionChange("depth", e.target.value)
                  }
                  className="w-full p-2 bg-[#EFE5DC] border border-[#493D31] rounded-md text-xs text-[#493D31]"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-[#D7CCC6] mb-1 block">
                  Unit
                </label>
                <select
                  value={selectedUnit}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  className="w-full p-2 bg-[#EFE5DC] border border-[#493D31] rounded-md text-xs text-[#493D31]"
                >
                  <option value="m">Meters</option>
                  <option value="cm">Centimeters</option>
                  <option value="ft">Feet</option>
                </select>
              </div>
            </div>

            <motion.button
              onClick={handleCreateRoom}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#60483E] to-[#BF7E3C] text-white py-2 px-4 rounded-md font-semibold text-sm"
            >
              Create Room
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default LeftSidebar;
