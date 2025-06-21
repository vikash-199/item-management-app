import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddItem() {
  const [form, setForm] = useState({ name: "", type: "", description: "" });
  const [coverImage, setCoverImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.type || !form.description || !coverImage) {
      alert("⚠️ Please fill in all fields and upload a cover image.");
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => data.append(key, val));
    data.append("coverImage", coverImage);
    additionalImages.forEach((img) => data.append("additionalImages", img));

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/items", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Item successfully added");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl space-y-6 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          ➕ Add New Item
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g., Cotton Shirt"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Type
          </label>
          <input
            type="text"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full border rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g., Shirt, Shoes, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full border rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Describe the item here..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
            className="block w-full text-sm"
          />
          {coverImage && (
            <img
              src={URL.createObjectURL(coverImage)}
              alt="Cover Preview"
              className="mt-3 h-40 w-full object-cover rounded-md shadow"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setAdditionalImages(Array.from(e.target.files))}
            className="block w-full text-sm"
          />
          {additionalImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {additionalImages.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  alt={`preview-${i}`}
                  className="h-20 w-20 object-cover rounded shadow"
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Uploading..." : "🚀 Add Item"}
        </button>
      </form>
    </div>
  );
}
