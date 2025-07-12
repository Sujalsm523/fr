import React, { useState, useRef } from "react";
import { HiOutlineSparkles, HiOutlinePhotograph } from "react-icons/hi";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../../../context/AuthContext";

const StudioInput = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Get data from context
  const {
    user,
    placedItems = [],
    appliedTextures = [],
    roomDimensions,
    currentSceneId,
    saveScene,
    generate3DContent,
    generate3DContentFromImage, // New function for image-based generation
  } = useAuthContext();

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      handleGenerate();
    }
  };

  const handleGenerate = async () => {
    if (!user || !user.user_id) {
      toast.error("Please log in to generate content");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate content");
      return;
    }

    try {
      setIsGenerating(true);
      const result = await generate3DContent(
        user.user_id,
        prompt.trim(),
        currentSceneId
      );

      if (result) {
        setPrompt("");
        toast.success("3D model generated successfully!");
        if (onGenerate) onGenerate(result);
      }
    } catch (error) {
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast.error("Image size exceeds 10MB limit");
      return;
    }

    try {
      setIsGenerating(true);
      setSelectedImage(URL.createObjectURL(file));

      // Call the image generation API
      const result = await generate3DContentFromImage(
        user.user_id,
        file,
        currentSceneId
      );

      if (result) {
        toast.success("3D model generated from image!");
        if (onGenerate) onGenerate(result);
      }
    } catch (error) {
      toast.error("Failed to generate from image");
    } finally {
      setIsGenerating(false);
      // Reset file input
      e.target.value = null;
    }
  };

  const handleSave = async () => {
    if (!user || !user.user_id) {
      toast.error("Please log in to save scenes");
      return;
    }

    try {
      const models = placedItems.map((item) => ({
        id: item.id,
        name: item.name || "",
        pos: item.pos,
        rotation: item.rotation,
        dim: item.dim || { w: 1, l: 1, d: 1 },
        category: item.category,
        pos_ref: item.pos_ref,
        model_url: item.model_url,
        model_front_img: item.model_front_img,
        model_top_img: item.model_top_img,
      }));

      const textures = appliedTextures.map((texture) => ({
        texture_name: texture.texture_name || "",
        texture_url: texture.texture_url || "",
        texture_ref: texture.texture_ref || "",
      }));

      const sceneData = {
        scene_dim: `${roomDimensions.width}x${roomDimensions.height}x${roomDimensions.depth}`,
        models,
        textures,
      };

      await saveScene(user.user_id, currentSceneId, sceneData);
      toast.success("Scene saved successfully!");
    } catch (error) {
      toast.error("Failed to save scene");
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="size-full p-2 bg-white bg-opacity-95 flex flex-wrap gap-3 z-10 justify-between items-center shadow-lg ">
      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Prompt input */}
      <form onSubmit={handlePromptSubmit} className="flex gap-3 flex-1 w-full">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Generate a cushion sofa..."
          className="flex w-full p-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={isGenerating}
        />
        <button
          type="submit"
          className="bg-amber-600 flex justify-center items-center text-white w-fit px-4 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!prompt.trim() || isGenerating}
        >
          <HiOutlineSparkles className="inline mr-1" />
          Generate
        </button>
      </form>

      {/* Action buttons */}
      <div className="flex gap-3">
        {/* Image Upload Button */}
        <button
          onClick={triggerImageUpload}
          className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isGenerating}
        >
          <HiOutlinePhotograph className="w-5 h-5 mr-2" />
          Upload Image
        </button>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!user || isGenerating}
        >
          Save Scene
        </button>
      </div>

      {/* Image preview */}
      {selectedImage && (
        <div className="absolute bottom-full mb-2 right-4 bg-white p-2 rounded-lg shadow-lg">
          <img
            src={selectedImage}
            alt="Upload preview"
            className="w-16 h-16 object-cover border border-gray-300"
          />
          <span className="text-xs text-gray-500 block mt-1">
            Processing...
          </span>
        </div>
      )}

      {/* Loading indicator */}
      {isGenerating && (
        <div className="absolute bottom-full mb-2 left-4 bg-amber-500 text-white px-3 py-1 rounded-lg text-sm flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Generating 3D model...
        </div>
      )}
    </div>
  );
};

export default StudioInput;
