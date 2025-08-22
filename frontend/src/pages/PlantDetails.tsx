import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchPlants } from "../api/api";

interface Plant {
  name: string;
  scientific_name: string;
  habitat: string;
  description: string;
  image_url: string;
  model_url?: string;
  medicinal_uses?: string[];
  preparation_methods?: string[];
  precautions?: string;
}

export default function PlantDetails() {
  const { id } = useParams<{ id: string }>();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (id) {
      searchPlants(id)
        .then((res) => {
          const data = res.data;
          const firstKey = Object.keys(data)[0];
          if (firstKey) setPlant(data[firstKey]);
        })
        .catch((err) => console.error("Error fetching plant details:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p className="text-center text-gray-500 mt-20">Loading plant details...</p>;
  if (!plant) return <p className="text-center text-gray-500 mt-20">Plant not found</p>;

  return (
    <div className="min-h-screen bg-green-50 py-6 px-4 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row">
          {/* Plant Image */}
          <div className="flex-1">
            <img
              src={plant.image_url}
              alt={plant.name}
              className="h-64 sm:h-80 md:h-full w-full object-cover"
            />
          </div>

          {/* Info Section */}
          <div className="flex-1 p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-4">
              {plant.name}
            </h1>
            <p className="text-gray-700 text-base sm:text-lg mb-4">{plant.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
              <p>
                <strong className="text-green-700">Scientific Name:</strong>{" "}
                <span className="italic">{plant.scientific_name}</span>
              </p>
              <p>
                <strong className="text-green-700">Habitat:</strong> {plant.habitat}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("✅ Link copied to clipboard!");
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold shadow text-sm sm:text-base"
              >
                🔗 Share
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t px-4 sm:px-6 py-4">
          <div className="flex flex-wrap gap-4 border-b mb-6">
            {["details", "medicinal", "preparation", "precautions"].map((tab) => (
              <button
                key={tab}
                className={`pb-2 text-base sm:text-lg font-semibold ${
                  activeTab === tab
                    ? "text-green-700 border-b-2 border-green-700"
                    : "text-gray-500 hover:text-green-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "details"
                  ? "Details"
                  : tab === "medicinal"
                  ? "Medicinal Uses"
                  : tab === "preparation"
                  ? "Preparation Methods"
                  : "Precautions"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mb-6 text-gray-700 text-sm sm:text-base">
            {activeTab === "details" && <p>{plant.description}</p>}

            {activeTab === "medicinal" && plant.medicinal_uses && (
              <ul className="list-disc list-inside space-y-2">
                {plant.medicinal_uses.map((use, idx) => (
                  <li key={idx}>{use}</li>
                ))}
              </ul>
            )}

            {activeTab === "preparation" && plant.preparation_methods && (
              <ul className="list-disc list-inside space-y-2">
                {plant.preparation_methods.map((method, idx) => (
                  <li key={idx}>{method}</li>
                ))}
              </ul>
            )}

            {activeTab === "precautions" && plant.precautions && <p>{plant.precautions}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
