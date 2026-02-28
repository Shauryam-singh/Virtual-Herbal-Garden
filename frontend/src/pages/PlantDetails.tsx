import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchPlants } from "../api/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { FaGlobe, FaFlask, FaExclamationTriangle, FaMapMarkedAlt, FaChevronLeft, FaShareAlt, FaLeaf } from "react-icons/fa";

// Interface remains the same
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
  { key: "details", label: "Overview", icon: <FaLeaf /> },
  { key: "medicinal", label: "Medicinal Uses", icon: <FaFlask /> },
  { key: "preparation", label: "Preparation", icon: <FaGlobe /> },
  { key: "precautions", label: "Safety", icon: <FaExclamationTriangle /> },
  { key: "map", label: "Habitat Map", icon: <FaMapMarkedAlt /> },
];

export default function PlantDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
        <FaLeaf className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-600 animate-pulse" />
      </div>
      <p className="mt-4 font-bold text-slate-400 uppercase tracking-widest text-xs">Analyzing Species...</p>
    </div>
  );

  if (!plant) return <div className="p-20 text-center">Plant not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-green-600 font-bold transition-colors">
            <FaChevronLeft /> Back to Explorer
          </button>
          <button 
            onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link Copied!"); }}
            className="p-2 bg-slate-100 rounded-full hover:bg-green-100 hover:text-green-600 transition-all"
          >
            <FaShareAlt />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left Column: Image & Stats Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-32">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 border-8 border-white">
                <img src={plant.image_url} alt={plant.name} className="w-full aspect-square object-cover" />
              </div>
              
              <div className="mt-8 bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Scientific Classification</label>
                  <p className="text-lg font-bold italic text-green-700">{plant.scientific_name}</p>
                </div>
                <div className="h-px bg-slate-100" />
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Primary Habitat</label>
                  <p className="text-lg font-bold text-slate-800">{plant.habitat}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-none">
                {plant.name}
              </h1>
              
              {/* Modern Tab Switcher */}
              <div className="flex-wrap gap-2 mb-10 bg-slate-100 p-1.5 rounded-2xl inline-flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm ${
                      activeTab === tab.key 
                        ? "bg-white text-green-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Animated Tab Content */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-slate-600 text-lg leading-relaxed"
                  >
                    {activeTab === "details" && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 italic">"The Botanical Essence"</h2>
                        <p>{plant.description}</p>
                      </div>
                    )}

                    {activeTab === "medicinal" && (
                      <ul className="grid md:grid-cols-2 gap-4">
                        {plant.medicinal_uses?.map((use, idx) => (
                          <li key={idx} className="flex gap-4 p-4 bg-green-50 rounded-2xl items-start">
                            <span className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0">{idx + 1}</span>
                            <span className="font-medium text-slate-800">{use}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {activeTab === "preparation" && (
                      <div className="space-y-6">
                        {plant.preparation_methods?.map((method, idx) => (
                          <div key={idx} className="border-l-4 border-green-500 pl-6 py-2 bg-slate-50 rounded-r-2xl">
                             <p className="font-bold text-slate-800">{method}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "precautions" && (
                      <div className="bg-amber-50 border-2 border-amber-100 p-8 rounded-3xl flex gap-6">
                        <FaExclamationTriangle className="text-amber-500 text-4xl flex-shrink-0" />
                        <p className="text-amber-900 font-medium">{plant.precautions}</p>
                      </div>
                    )}

                    {activeTab === "map" && (
                      <div className="h-[450px] w-full rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-inner">
                        {plant.locations?.length ? (
                          <MapContainer center={[plant.locations[0].lat, plant.locations[0].lng]} zoom={4} style={{ height: "100%" }}>
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                            {plant.locations.map((loc, idx) => (
                              <Marker key={idx} position={[loc.lat, loc.lng]} icon={L.icon({
                                iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                                iconSize: [30, 30],
                              })}>
                                <Popup><span className="font-bold text-green-700">{loc.label}</span></Popup>
                              </Marker>
                            ))}
                          </MapContainer>
                        ) : <p className="text-center p-20">No habitat mapping found.</p>}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}