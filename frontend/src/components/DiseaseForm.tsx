import { useState } from "react";
import { getDiseaseTreatment } from "../api/api";

export default function DiseaseForm() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const res = await getDiseaseTreatment(input);
      const data = res.data.results || [];
      setResults(data);

      if (data.length > 0 && !recentSearches.includes(input)) {
        setRecentSearches((prev) => [input, ...prev].slice(0, 5));
      }
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          className="border p-3 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter disease name or symptom"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
        >
          Search
        </button>
      </form>

      {/* Loading */}
      {loading && <p className="text-center text-green-700 mb-4">Searching...</p>}

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-green-700 mb-2">Recent Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm cursor-pointer hover:bg-green-300 transition"
                onClick={() => setInput(term)}
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex flex-col gap-4">
        {results.length > 0 ? (
          results.map((res, idx) => (
            <div
              key={idx}
              className="border border-green-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <p className="text-lg font-semibold text-green-800"><strong>Disease:</strong> {res.disease}</p>
              <p className="text-gray-700"><strong>Symptoms:</strong> {res.symptoms.join(", ")}</p>
              <p className="text-gray-700">
                <strong>Treatment:</strong>{" "}
                {res.treatment.length > 120
                  ? res.treatment.slice(0, 120) + "..."
                  : res.treatment}
              </p>
              {res.plant && <p className="text-green-600"><strong>Plant:</strong> {res.plant}</p>}
            </div>
          ))
        ) : !loading ? (
          <p className="text-center text-gray-600">No results found.</p>
        ) : null}
      </div>
    </div>
  );
}
