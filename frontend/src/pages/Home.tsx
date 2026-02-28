import { FaLeaf, FaMicroscope, FaCamera, FaPrescriptionBottleAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-white text-gray-900 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-slate-50">
        {/* Decorative Background */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-green-700 uppercase bg-green-100 rounded-full">
              Bridging Ancient Wisdom & Modern AI
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
              Modernizing <span className="text-green-600">AYUSH</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                With Intelligence
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Scan plants, diagnose leaf diseases, and discover traditional medicinal uses from the AYUSH systems to heal your body naturally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/garden"
                className="group px-8 py-4 bg-green-600 text-white font-bold rounded-xl shadow-xl shadow-green-200 hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                Scan a Plant
                <FaCamera className="group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="/disease"
                className="px-8 py-4 bg-white text-gray-900 border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
              >
                Check Leaf Health
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI & AYUSH Core Features */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Our Tech-Powered Healing</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Using computer vision to identify, diagnose, and prescribe natural wellness.</p>
            <div className="h-1.5 w-20 bg-green-500 mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1: Identification */}
            <div className="group p-8 bg-slate-50 border border-slate-100 rounded-3xl transition-all duration-300 hover:bg-white hover:shadow-2xl hover:border-green-200">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform">
                <FaCamera />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">AI Plant Identifier</h3>
              <p className="text-gray-600 leading-relaxed">
                Found an unknown herb? Snap a photo and our AI model will classify it instantly, pulling deep data from traditional AYUSH texts.
              </p>
            </div>

            {/* Feature 2: Disease Diagnosis */}
            <div className="group p-8 bg-slate-50 border border-slate-100 rounded-3xl transition-all duration-300 hover:bg-white hover:shadow-2xl hover:border-green-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform">
                <FaMicroscope />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Leaf Health Scan</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload a leaf image to detect diseases. Our system identifies fungal or bacterial infections and suggests organic treatments.
              </p>
            </div>

            {/* Feature 3: Medicinal Wisdom */}
            <div className="group p-8 bg-slate-50 border border-slate-100 rounded-3xl transition-all duration-300 hover:bg-white hover:shadow-2xl hover:border-green-200">
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform">
                <FaPrescriptionBottleAlt />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">AYUSH Prescriptions</h3>
              <p className="text-gray-600 leading-relaxed">
                Learn exactly how to prepare and consume plants as medicine based on Ayurveda, Siddha, and Unani principles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section: Why AYUSH? */}
      <section className="py-24 bg-green-50 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-black text-gray-900 mb-6">Promoting Global <br/>Wellness through AYUSH</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              AYUSH systems of medicine are among the oldest in the world. We believe that by digitizing this knowledge, we can make holistic health accessible to everyone, everywhere.
            </p>
            <ul className="space-y-4">
              {['Ayurveda & Yoga', 'Unani & Siddha', 'Homeopathy'].map((item) => (
                <li key={item} className="flex items-center gap-3 font-bold text-green-800">
                  <FaLeaf /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2 bg-white p-4 rounded-[2rem] shadow-2xl rotate-2">
            {/* Placeholder for a leaf disease detection visual */}
            <div className="aspect-video bg-gray-100 rounded-[1.5rem] flex items-center justify-center overflow-hidden border-4 border-white">
               <span className="text-gray-400 font-medium">[ AI Diagnosis Interface Preview ]</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-gray-900 text-white rounded-[3rem] mx-4 my-8 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 italic">"Empowering people to grow their own pharmacy."</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: "Dr. Ananya Rao", role: "Ayurvedic Practitioner", text: "Healthify makes it easy for my patients to identify the right herbs in their own backyard." },
              { name: "Rajesh Kumar", role: "Farmer", text: "The leaf disease scanner saved my crop this season. I knew exactly what was wrong in seconds." },
              { name: "Sunita Williams", role: "Wellness Enthusiast", text: "I love how it explains the medicinal benefits of plants I've walked past for years." }
            ].map((t, i) => (
              <div key={i} className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-green-500 transition-colors">
                <p className="text-gray-300 mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-white">{t.name[0]}</div>
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-green-400 uppercase tracking-tighter">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-green-600 rounded-[2rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Heal with Nature.</h2>
            <p className="text-lg text-green-100 mb-10 max-w-xl mx-auto">
              Start identifying medicinal plants and protecting your garden with our AI tools.
            </p>
            <button className="px-10 py-4 bg-white text-green-700 font-bold rounded-full hover:bg-green-50 transition-all transform hover:scale-105">
              Get Started for Free
            </button>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-green-500 rounded-full opacity-50"></div>
        </div>
      </section>
    </div>
  );
}