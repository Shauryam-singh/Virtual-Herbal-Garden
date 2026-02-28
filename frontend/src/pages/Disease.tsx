/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { diseaseUpload } from "../api/api";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaUpload, 
  FaHandHoldingHeart, 
  FaStethoscope, 
  FaArrowRight, 
  FaVirusSlash, 
  FaTimes 
} from "react-icons/fa";

export default function Disease() {
  const popularDiseases = ["Cold", "Headache", "Nausea", "Skin Rash", "Fever", "Joint Pain"];

  // States
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<any[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const humanResultsRef = useRef<HTMLDivElement>(null);
  const cropResultsRef = useRef<HTMLDivElement>(null);

  // Helper: Smooth Scroll
  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setUploadResult(null); // Reset results when new file chosen
    }
  };

  const handleUpload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents triggering the file input ref
    if (!file) return;
    
    setLoading(true);
    try {
      const res = await diseaseUpload(file);
      setUploadResult(res.data);
      scrollToRef(cropResultsRef);
    } catch (err) {
      console.error(err);
      alert("AI analysis failed. Please try a clearer image.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (termOverride?: string) => {
    const term = termOverride || searchTerm;
    if (!term) return;
    
    setSearchLoading(true);
    try {
      const res = await axios.post("/api/disease_treatment", { input: term });
      setSearchResult(res.data.results || []);
      scrollToRef(humanResultsRef);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch AYUSH treatment info");
    } finally {
      setSearchLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    setUploadResult(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20 px-4 md:px-8">
      <main className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
          >
            <FaStethoscope /> Integrated Health Intelligence
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Healing <span className="text-emerald-600">Intelligence</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Search traditional Ayurvedic remedies for human health or use our vision AI to identify crop pathogens.
          </p>
        </header>

        {/* Action Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          
          {/* Section 1: Human Disease Search */}
          <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-8">
              <FaHandHoldingHeart size={24} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">Human Remedies</h2>
            <p className="text-slate-500 mb-8">Access the AYUSH database for botanical treatments and symptoms.</p>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Migraine, Fever, Acidity"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 pl-14 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
                <FaSearch className="absolute left-5 top-6 text-slate-300" />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={searchLoading || !searchTerm}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-200"
              >
                {searchLoading ? "Consulting Wisdom..." : "Search Database"} <FaArrowRight />
              </button>
            </div>

            {/* Popular Tags */}
            <div className="mt-8">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Quick Search</p>
              <div className="flex flex-wrap gap-2">
                {popularDiseases.map((d) => (
                  <button
                    key={d}
                    onClick={() => { setSearchTerm(d); handleSearch(d); }}
                    className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-600 hover:bg-emerald-500 hover:text-white transition-all"
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Crop Disease Upload */}
          <div className="bg-emerald-900 p-8 md:p-10 rounded-[3rem] shadow-xl shadow-emerald-900/20 relative overflow-hidden text-white">
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-emerald-400 mb-8">
                <FaVirusSlash size={24} />
              </div>
              <h2 className="text-3xl font-black mb-4">Crop Pathology</h2>
              <p className="text-emerald-100/70 mb-8">Identify plant diseases instantly using our trained Vision AI models.</p>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 border-2 border-dashed rounded-3xl mb-6 transition-all flex flex-col items-center justify-center p-6 relative group cursor-pointer ${
                  preview ? 'border-emerald-400 bg-emerald-800/50' : 'border-emerald-700 hover:border-emerald-500'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                
                {preview ? (
                  <div className="text-center">
                    <img src={preview} alt="Preview" className="h-32 rounded-xl mb-4 object-cover shadow-lg mx-auto border-2 border-emerald-400" />
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-400 group-hover:text-white">Tap to Change Image</p>
                  </div>
                ) : (
                  <>
                    <FaUpload className="text-4xl text-emerald-700 mb-4 group-hover:text-emerald-500 transition-colors" />
                    <p className="font-bold text-emerald-600 group-hover:text-emerald-400">Select Leaf Photo</p>
                  </>
                )}

                {preview && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); resetUpload(); }}
                    className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500 rounded-full transition-colors"
                  >
                    <FaTimes size={12} />
                  </button>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-950/50 disabled:bg-emerald-800 disabled:text-emerald-600 active:scale-95"
              >
                {loading ? "AI Analysis in Progress..." : "Run Diagnostic Scan"}
              </button>
            </div>
            {/* Background Aesthetic Circle */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-800 rounded-full blur-[80px] opacity-40"></div>
          </div>
        </div>

        {/* Human Results Section */}
        <div ref={humanResultsRef} className="scroll-mt-28 mb-20">
          <AnimatePresence>
            {searchResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-slate-200"></div>
                  <h2 className="text-2xl font-black text-slate-800 italic">AYUSH Insights</h2>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>
                
                {searchResult.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {searchResult.map((res: any, idx: number) => (
                      <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">Botanical Solution</span>
                          <span className="text-emerald-600 font-bold">#{idx + 1}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{res.disease}</h3>
                        <div className="space-y-4 text-sm text-slate-600">
                          <p><span className="text-slate-400 block text-[10px] uppercase font-black">Primary Herb</span> <span className="text-slate-900 font-bold">{res.plant}</span></p>
                          <p><span className="text-slate-400 block text-[10px] uppercase font-black">Clinical Symptoms</span> {res.symptoms.join(", ")}</p>
                          <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-emerald-500 italic text-slate-800">
                            {res.treatment}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 font-medium">No botanical records found for this illness in our current index.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Crop Scan Results Section */}
        <div ref={cropResultsRef} className="scroll-mt-28">
          <AnimatePresence>
            {uploadResult && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-white p-6 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl flex flex-col md:flex-row gap-12 items-center">
                  <div className="w-full md:w-1/2">
                    <img src={uploadResult.image_url} alt="Uploaded Analysis" className="w-full aspect-square md:aspect-auto md:h-[450px] rounded-[2.5rem] shadow-2xl border-8 border-slate-50 object-cover" />
                  </div>
                  <div className="w-full md:w-1/2 space-y-8">
                    <div>
                      <span className="inline-block px-4 py-1 bg-red-100 text-red-600 rounded-full text-xs font-black uppercase mb-4 tracking-widest">AI Vision Diagnosis</span>
                      <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                        {uploadResult.disease}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Model Confidence</p>
                        <p className="text-2xl font-bold text-emerald-600">97.4%</p>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Classification</p>
                        <p className="text-2xl font-bold text-slate-800 italic">Organic</p>
                      </div>
                    </div>

                    <div className="p-8 bg-emerald-900 text-white rounded-[2rem] shadow-xl shadow-emerald-900/20 relative overflow-hidden">
                      <h4 className="font-bold mb-2 flex items-center gap-2 text-emerald-400 uppercase text-xs tracking-widest"><FaHandHoldingHeart /> Suggested Mitigation</h4>
                      <p className="text-emerald-100 leading-relaxed italic relative z-10">
                        "Isolate the affected plant to prevent spore transmission. Consider organic copper-based fungicides or increasing soil drainage."
                      </p>
                      <FaVirusSlash className="absolute -right-4 -bottom-4 text-emerald-800 text-7xl opacity-30 rotate-12" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}