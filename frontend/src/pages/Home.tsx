import { FaLeaf, FaFlask, FaSeedling } from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center bg-green-50 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Welcome to Healthify
        </h1>
        <p className="text-lg md:text-2xl mb-6 max-w-2xl">
          Discover personalized health solutions powered by nature and technology.
        </p>
        <a
          href="/garden"
          className="px-8 py-4 bg-gray-900/2 text-green-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          Explore Plants
        </a>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-800 mb-12">Our Features</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8">
            <div className="p-6 shadow-lg rounded-2xl hover:shadow-2xl transition transform hover:-translate-y-2">
              <FaLeaf className="text-green-600 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Medicinal Plant Guide</h3>
              <p className="text-gray-700">
                Explore a wide variety of plants used in traditional and modern medicine.
              </p>
            </div>
            <div className="p-6 shadow-lg rounded-2xl hover:shadow-2xl transition transform hover:-translate-y-2">
              <FaFlask className="text-green-500 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Disease & Treatment</h3>
              <p className="text-gray-700">
                Get AI-driven plant-based remedies for common ailments and symptoms.
              </p>
            </div>
            <div className="p-6 shadow-lg rounded-2xl hover:shadow-2xl transition transform hover:-translate-y-2">
              <FaSeedling className="text-green-400 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Virtual Garden</h3>
              <p className="text-gray-700">
                Browse and interact with plants, upload images, and identify new species.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-green-50 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-900 mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition">
              <p className="text-gray-700 mb-4">
                "This tool completely changed the way I approach my health. Highly recommended!"
              </p>
              <h3 className="font-semibold text-green-800">- Sarah Johnson</h3>
            </div>
            <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition">
              <p className="text-gray-700 mb-4">
                "The health assessment was so accurate, and I loved learning about natural remedies."
              </p>
              <h3 className="font-semibold text-green-800">- Michael Lee</h3>
            </div>
            <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition">
              <p className="text-gray-700 mb-4">
                "Simple, intuitive, and effective. A must-have for anyone exploring natural health."
              </p>
              <h3 className="font-semibold text-green-800">- Emma Davis</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 to-green-700 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Start Your Health Journey Today!</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Embrace the power of nature for a healthier life. Join thousands discovering the benefits of natural remedies and personalized health tips.
          </p>
          <a
            href="/garden"
            className="px-8 py-4 bg-white text-green-700 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition"
          >
            Explore Plants
          </a>
        </div>
      </section>
    </div>
  );
}
