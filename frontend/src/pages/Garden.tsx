import { useState, useEffect } from "react";
import PlantCard from "../components/PlantCard";
import { searchPlants, uploadPlantImage } from "../api/api";
import { FaSearch, FaUpload, FaLeaf } from "react-icons/fa";

export default function Garden() {
  const [query, setQuery] = useState("");
  const [plants, setPlants] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [popularPlants, setPopularPlants] = useState<any[]>([]);

  useEffect(() => {
    const fetchPopularPlants = async () => {
      try {
        const res = await searchPlants("");
        const data = Object.entries(res.data).map(([name, info]: any) => ({ name, ...info }));
        setPopularPlants(data.slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };
    fetchPopularPlants();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await searchPlants(query);
      const data = Object.entries(res.data).map(([name, info]: any) => ({ name, ...info }));
      setPlants(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await uploadPlantImage(file);
      setPlants([res.data]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-50 flex flex-col items-center min-h-screen py-8 px-4">
      <section className="w-full max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-6 text-center">
          🌿 Garden Explorer
        </h1>

        <p className="text-center text-green-800 mb-8">
          Search for plants, explore their information, or upload a photo to identify it instantly!
        </p>

        {/* Search & Upload */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center w-full">
          <div className="flex flex-1 w-full md:w-auto gap-2">
            <input
              className="flex-1 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
              placeholder="Search plants by name or info"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button
              className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition w-32 md:w-auto justify-center"
              onClick={handleSearch}
            >
              <FaSearch /> Search
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 items-center w-full md:w-auto">
            <input
              type="file"
              onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
              className="file:border-0 file:bg-green-200 file:text-green-800 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer w-full sm:w-auto"
            />
            <button
              className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition w-full sm:w-auto justify-center"
              onClick={handleUpload}
            >
              <FaUpload /> Upload & Classify
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && <p className="text-center text-green-700 mb-4">Loading...</p>}

        {/* Plant Results */}
        {plants.length === 0 && !loading ? (
          <>
            <p className="text-center text-gray-700 mb-6">No plants to display.</p>
            <h2 className="text-2xl font-semibold text-green-800 mb-4 text-center">🌱 Featured Plants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {popularPlants.map((plant, idx) => (
                <PlantCard key={idx} {...plant} />
              ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {plants.map((plant, idx) => (
              <PlantCard key={idx} {...plant} />
            ))}
          </div>
        )}

        {/* Footer / Tips */}
        <div className="mt-12 text-center text-green-900">
          <p className="mb-2"><FaLeaf className="inline mr-2" /> Tip: Use exact plant names for faster results.</p>
          <p><FaLeaf className="inline mr-2" /> Upload clear photos of leaves or flowers for accurate identification.</p>
        </div>
      </section>
    </div>
  );
}
