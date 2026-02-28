/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react"; // Added useRef
import PlantCard from "../components/PlantCard";
import { searchPlants, uploadPlantImage } from "../api/api";
import { FaSearch, FaUpload, FaLeaf, FaCamera, FaMagic } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Garden() {
  const [query, setQuery] = useState("");
  const [plants, setPlants] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [popularPlants, setPopularPlants] = useState<any[]>([]);

  // Create a reference for the results section
  const resultsRef = useRef<HTMLDivElement>(null);

  // Helper function for smooth scrolling
  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const fetchPopularPlants = async () => {
      try {
        const res = await searchPlants("");
        const data = Object.entries(res.data).map(([name, info]: [string, any]) => ({ name, ...info }));
        setPopularPlants(data.slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };
    fetchPopularPlants();
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await searchPlants(query);
      const data = Object.entries(res.data).map(([name, info]: [string, any]) => ({ name, ...info }));
      setPlants(data);
      // Scroll down after results are set
      setTimeout(scrollToResults, 100); 
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
      // Scroll down after AI classification
      setTimeout(scrollToResults, 100);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12 px-4 md:px-8">
      <section className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
          >
            <FaMagic /> AYUSH Intelligent Explorer
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
            Garden <span className="text-green-600">Explorer</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Bridge the gap between technology and nature. Identify medicinal plants or diagnose leaf health issues in seconds.
          </p>
        </div>

        {/* Action Dashboard */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Manual Search Card */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                <FaSearch size={20} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Manual Search</h3>
              <p className="text-gray-500 mb-6">Explore the AYUSH database for specific plants and their traditional uses.</p>
              <div className="relative group">
                <input
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-green-500 outline-none transition-all group-hover:border-green-200"
                  placeholder="Search Neem, Tulsi, Aloe..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                />
                <FaLeaf className="absolute left-4 top-5 text-slate-300" />
              </div>
            </div>
            <button
              className="mt-6 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
              onClick={handleSearch}
            >
              Analyze Database
            </button>
          </div>

          {/* AI Visual Scan Card */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
              <FaCamera size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">AI Visual Scan</h3>
            <p className="text-gray-500 mb-6">Upload a photo to classify species or diagnose leaf diseases instantly.</p>
            <div className={`relative border-2 border-dashed rounded-2xl transition-all ${preview ? "border-green-500 bg-green-50" : "border-slate-200 bg-slate-50 hover:border-green-400"}`}>
              <input type="file" onChange={onFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <div className="p-4 text-center">
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="h-28 mx-auto rounded-xl shadow-sm object-cover" />
                    <p className="mt-2 text-xs font-bold text-green-600 uppercase tracking-widest">Image Loaded</p>
                  </div>
                ) : (
                  <div className="py-2">
                    <FaUpload className="text-3xl text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 font-medium tracking-tight">Tap to upload or drop image</p>
                  </div>
                )}
              </div>
            </div>
            <button
              disabled={!file || loading}
              className={`mt-6 w-full py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${file ? "bg-green-600 text-white hover:bg-green-700 shadow-green-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
              onClick={handleUpload}
            >
              {loading ? "Processing..." : "Classify with AI"}
            </button>
          </div>
        </div>

        {/* Results Grid - ATTACHED THE REF HERE */}
        <div ref={resultsRef} className="space-y-8 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-black text-gray-900">
              {plants.length > 0 ? "Search Results" : "🌱 Featured Botanical Collection"}
            </h2>
            {plants.length > 0 && (
              <button 
                onClick={() => { setPlants([]); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                className="text-sm font-bold text-green-600 hover:text-green-700"
              >
                Clear & Back to Top
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-[2rem]" />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {(plants.length > 0 ? plants : popularPlants).map((plant, idx) => (
                  <motion.div whileHover={{ y: -10 }} key={idx}>
                    <PlantCard {...plant} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Footer Tip */}
        <div className="mt-24 p-12 bg-gray-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
          <div className="relative z-10 md:w-2/3">
            <h4 className="text-3xl font-bold mb-4">How our AI helps AYUSH</h4>
            <p className="text-gray-400 text-lg leading-relaxed">
              Our model analyzes leaf vein patterns and discoloration to detect anomalies. By mapping these to traditional AYUSH texts, we provide holistic remedy suggestions.
            </p>
          </div>
          <div className="relative z-10 md:w-1/3 bg-green-500/10 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
             <div className="flex items-center gap-3 mb-2">
               <FaLeaf className="text-green-500" />
               <span className="font-bold uppercase tracking-widest text-xs">AI Tip</span>
             </div>
             <p className="text-sm text-gray-300 italic">"Ensure the leaf is flat and well-lit for a 99% accurate diagnosis."</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/20 rounded-full blur-[80px]"></div>
        </div>
      </section>
    </div>
  );
}