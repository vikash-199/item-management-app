import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ViewItems() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/items")
      .then((res) => setItems(res.data));
  }, []);

  const handleEnquire = async () => {
    const userEmail = prompt("Enter your email to enquire:");
    if (!userEmail) return;

    await axios.post("http://localhost:5000/api/items/enquire", {
      itemName: selected.name,
      userEmail,
    });

    alert("📩 Enquiry sent successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🛍️ View Items</h1>
        <button
          onClick={() => navigate("/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          ➕ Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelected(item)}
              className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition"
            >
              <img
                src={`http://localhost:5000/uploads/${item.coverImage}`}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-500">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {selected.name}
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Type:</strong> {selected.type}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <strong>Description:</strong> {selected.description}
            </p>

            <div className="overflow-x-auto whitespace-nowrap mb-4 flex gap-2">
              {[selected.coverImage, ...selected.additionalImages].map(
                (img, i) => (
                  <img
                    key={i}
                    src={`http://localhost:5000/uploads/${img}`}
                    alt={`preview-${i}`}
                    className="h-28 w-28 object-cover rounded shadow-sm"
                  />
                )
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleEnquire}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                ✉️ Enquire
              </button>
              <button
                onClick={() => setSelected(null)}
                className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded"
              >
                ✖️ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
