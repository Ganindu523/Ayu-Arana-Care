import React, { useState } from "react";

const AdminGalleryUpload = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("description", description);

    try {
      const res = await fetch("http://localhost:5000/api/gallery/upload", {
  method: "POST",
  body: formData,
});


      if (res.ok) {
        alert("Gallery post uploaded successfully!");
        setDescription("");
        setImage(null);
        document.getElementById("image").value = null;
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Gallery Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border rounded px-4 py-2"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border rounded px-4 py-2"
          rows={4}
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default AdminGalleryUpload;
