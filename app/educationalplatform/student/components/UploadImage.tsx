"use client";
import React, { useState, useEffect } from "react";

const UploadImage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<{ url: string; description: string }[]>([]);

  // Load stored images from localStorage on component mount
  useEffect(() => {
    const storedImages = localStorage.getItem("images");
    if (storedImages) {
      setImages(JSON.parse(storedImages));
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        setImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (image && description.trim()) {
      const newImage = { url: image, description };
      const updatedImages = [...images, newImage];

      // Save to localStorage
      localStorage.setItem("images", JSON.stringify(updatedImages));
      setImages(updatedImages);

      alert("Image uploaded successfully!");
      setImage(null);
      setDescription("");
    } else {
      alert("Please upload an image and provide a description.");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-bold">Upload an Image</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-2" />
      {image && <img src={image} alt="Preview" className="w-40 h-40 object-cover mt-2" />}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter image description..."
        className="w-full p-2 border rounded mt-2"
      />
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
        Upload
      </button>
    </div>
  );
};

export default UploadImage;
