import { useState } from "react";
import { diseaseUpload } from "../api/api";
import axios from "axios";

export default function Disease() {
  const popularDiseases = [
    "Cold & Flu",
    "Headache",
    "Digestive Issues",
    "Skin Rash",
    "Fever",
    "Joint Pain",
  ];

  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await diseaseUpload(file);
      setUploadResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    setSearchLoading(true);
    try {
      const res = await axios.post("/api/disease_treatment", {
        input: searchTerm,
      });
      setSearchResult(res.data.results || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch treatment info");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <main className="flex-1 mt-16 mb-8 px-4 md:px-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-green-800 mb-4">
            Disease & Treatment Explorer
          </h1>
          <p className="text-green-700 text-lg max-w-3xl mx-auto">
            Discover plant-based remedies for human diseases or identify plant/crop diseases by uploading an image.
          </p>
        </header>

        {/* Search Human Disease */}
        <section className="max-w-3xl mx-auto mb-12 bg-white rounded-3xl shadow-lg p-6 md:p-10">
          <h2 className="text-3xl font-semibold text-green-800 mb-6 text-center">
            Search Human Disease
          </h2>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter disease name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
            />
            <button
              onClick={handleSearch}
              disabled={!searchTerm || searchLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold"
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </div>

          {searchResult && searchResult.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {searchResult.map((res: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 bg-green-50 rounded-2xl shadow hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-xl text-green-800 mb-2">{res.disease}</h3>
                  <p><span className="font-semibold">Recommended Plant:</span> {res.plant}</p>
                  <p><span className="font-semibold">Symptoms:</span> {res.symptoms.join(", ")}</p>
                  <p><span className="font-semibold">Treatment:</span> {res.treatment}</p>
                </div>
              ))}
            </div>
          ) : (
            searchResult && <p className="text-gray-500 text-center mt-4">No treatment found for this disease.</p>
          )}
        </section>

        {/* Upload Plant/Crop Image */}
        <section className="max-w-3xl mx-auto mb-12 bg-white rounded-3xl shadow-lg p-6 md:p-10 text-center">
          <h2 className="text-3xl font-semibold text-green-800 mb-6">Upload Plant/Crop Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4 p-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold mb-6"
          >
            {loading ? "Analyzing..." : "Upload"}
          </button>

          {uploadResult && (
            <div className="mt-6 p-4 bg-green-50 rounded-2xl shadow-md text-left">
              <h3 className="font-bold text-xl mb-3 text-green-800">Result</h3>
              <img
                src={uploadResult.image_url}
                alt="Uploaded"
                className="mb-4 max-h-64 w-full object-contain rounded-xl"
              />
              <p><span className="font-semibold">Disease Identified:</span> {uploadResult.disease}</p>
            </div>
          )}
        </section>

        {/* Popular Human Diseases */}
        <section className="max-w-6xl mx-auto mb-12 px-4">
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
            Popular Human Diseases
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {popularDiseases.map((disease, idx) => (
              <button
                key={idx}
                className="px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition font-medium"
                onClick={() => setSearchTerm(disease)}
              >
                {disease}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
