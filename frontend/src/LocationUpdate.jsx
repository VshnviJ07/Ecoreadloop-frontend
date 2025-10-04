import { useState } from "react";
import axios from "axios";

export default function LocationUpdate() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [manual, setManual] = useState(false);

  // ✅ Use environment variable for backend base URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // 📍 Auto Location Fetch
  const handleAutoLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = `${latitude},${longitude}`;
        setLocation(coords);

        try {
          const token = localStorage.getItem("token");
          await axios.put(
            `${API_BASE}/api/user/location`,
            { location: coords },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          alert("Location updated successfully ✅");
        } catch (error) {
          console.error(error);
          alert("Failed to update location ❌");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        alert("Failed to fetch location ❌");
        setLoading(false);
      }
    );
  };

  // 📍 Manual Location Save
  const handleManualSave = async () => {
    if (!location.trim()) {
      alert("Please enter a location");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE}/api/user/location`,
        { location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Manual location saved ✅");
    } catch (error) {
      console.error(error);
      alert("Failed to save location ❌");
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-4">Update Location</h1>

      {/* Auto Location Button */}
      <button
        onClick={handleAutoLocation}
        disabled={loading}
        className="bg-blue-600 px-4 py-2 rounded-lg mr-3 hover:bg-blue-700"
      >
        {loading ? "Fetching..." : "Use My Live Location"}
      </button>

      {/* Toggle Manual Input */}
      <button
        onClick={() => setManual(!manual)}
        className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
      >
        {manual ? "Close Manual Edit" : "Enter Location Manually"}
      </button>

      {/* Manual Location Input */}
      {manual && (
        <div className="mt-4">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your city / address"
            className="px-3 py-2 w-72 rounded-lg text-black"
          />
          <button
            onClick={handleManualSave}
            className="ml-3 bg-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-700"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
