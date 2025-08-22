import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchPlants } from "../api/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

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
  locations?: { lat: number; lng: number; label?: string }[];
}

const tabs = [
  { key: "details", label: "Details" },
  { key: "medicinal", label: "Medicinal Uses" },
  { key: "preparation", label: "Preparation Methods" },
  { key: "precautions", label: "Precautions" },
  { key: "map", label: "Habitat Map" },
];

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="animate-pulse text-green-600 text-lg">🌱 Loading plant details...</p>
      </div>
    );
  }

  if (!plant) {
    return (
      <p className="text-center text-gray-500 mt-20">
        ❌ Plant not found. Try searching again.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-6 px-4 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row">
          <div className="flex-1">
            <img
              src={plant.image_url || "/placeholder-plant.jpg"}
              alt={plant.name}
              className="h-64 sm:h-80 md:h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-plant.jpg";
              }}
            />
          </div>

          <div className="flex-1 p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-4">
              {plant.name}
            </h1>
            <p className="text-gray-700 text-base sm:text-lg mb-4">
              {plant.description || "No description available."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
              <p>
                <strong className="text-green-700">Scientific Name:</strong>{" "}
                <span className="italic">{plant.scientific_name || "N/A"}</span>
              </p>
              <p>
                <strong className="text-green-700">Habitat:</strong>{" "}
                {plant.habitat || "Unknown"}
              </p>
            </div>

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
          <div
            className="flex flex-wrap gap-4 border-b mb-6"
            role="tablist"
            aria-label="Plant details tabs"
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                className={`pb-2 text-base sm:text-lg font-semibold ${
                  activeTab === tab.key
                    ? "text-green-700 border-b-2 border-green-700"
                    : "text-gray-500 hover:text-green-600"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mb-6 text-gray-700 text-sm sm:text-base">
            {activeTab === "details" && (
              <p>{plant.description || "No details available."}</p>
            )}

            {activeTab === "medicinal" && (
              plant.medicinal_uses?.length ? (
                <ul className="list-disc list-inside space-y-2">
                  {plant.medicinal_uses.map((use, idx) => (
                    <li key={idx}>{use}</li>
                  ))}
                </ul>
              ) : (
                <p>No medicinal uses available.</p>
              )
            )}

            {activeTab === "preparation" && (
              plant.preparation_methods?.length ? (
                <ul className="list-disc list-inside space-y-2">
                  {plant.preparation_methods.map((method, idx) => (
                    <li key={idx}>{method}</li>
                  ))}
                </ul>
              ) : (
                <p>No preparation methods available.</p>
              )
            )}

            {activeTab === "precautions" && (
              <p>{plant.precautions || "No precautions listed."}</p>
            )}

            {activeTab === "map" && plant.locations?.length ? (
              <div className="h-96 w-full rounded-lg overflow-hidden shadow">
                <MapContainer
                  center={[plant.locations[0].lat, plant.locations[0].lng]}
                  zoom={3}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  {plant.locations.map((loc, idx) => (
                    <Marker
                      key={idx}
                      position={[loc.lat, loc.lng]}
                      icon={L.icon({
                        iconUrl:
                          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })}
                    >
                      <Popup>{loc.label || "Habitat Area"}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            ) : (
              activeTab === "map" && <p>No habitat data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
