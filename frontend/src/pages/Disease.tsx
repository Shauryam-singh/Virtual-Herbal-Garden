import DiseaseForm from "../components/DiseaseForm";
import { FaLeaf, FaStethoscope, FaHandsHelping } from "react-icons/fa";

export default function Disease() {
  const popularDiseases = [
    "Cold & Flu",
    "Headache",
    "Digestive Issues",
    "Skin Rash",
    "Fever",
    "Joint Pain",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      {/* Header */}
      <main className="flex-1 mt-16 mb-8 px-4">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-4">
          Disease & Treatment Explorer
        </h1>
        <p className="text-center text-green-700 max-w-2xl mx-auto mb-8">
          Search for plant-based remedies and treatments. Enter a disease name or symptom, and discover relevant medicinal plants and their uses. Stay informed about natural healing!
        </p>

        {/* Search Form */}
        <div className="max-w-3xl mx-auto mb-12">
          <DiseaseForm />
        </div>

        {/* How It Works */}
        <section className="max-w-6xl mx-auto mb-12 px-4 text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <FaLeaf className="text-green-600 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Search Symptoms</h3>
              <p className="text-gray-700">
                Enter a symptom or disease name to find potential natural remedies.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <FaStethoscope className="text-green-500 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Get Plant-Based Remedies</h3>
              <p className="text-gray-700">
                View a curated list of medicinal plants and their applications.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <FaHandsHelping className="text-green-400 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Follow Safe Practices</h3>
              <p className="text-gray-700">
                Learn how to use herbs and natural remedies safely and effectively.
              </p>
            </div>
          </div>
        </section>

        {/* Popular Diseases */}
        <section className="max-w-6xl mx-auto mb-12 px-4">
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
            Popular Diseases
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {popularDiseases.map((disease, idx) => (
              <button
                key={idx}
                className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
              >
                {disease}
              </button>
            ))}
          </div>
        </section>

        {/* Tips Section */}
        <section className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-6">Natural Remedies Tips</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2 max-w-2xl mx-auto">
            <li>Always consult a healthcare professional before using herbs.</li>
            <li>Use fresh or properly dried plants for maximum effectiveness.</li>
            <li>Combine multiple remedies carefully to avoid interactions.</li>
            <li>Maintain a healthy lifestyle to enhance the effects of natural remedies.</li>
            <li>Track your symptoms and improvements for better results.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
