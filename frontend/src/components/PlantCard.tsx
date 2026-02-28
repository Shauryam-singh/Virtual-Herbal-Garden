import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaMicroscope, FaArrowRight } from "react-icons/fa";

interface PlantCardProps {
  name: string;
  info: string;
  scientific_name: string;
  habitat: string;
  image_url: string;
}

export default function PlantCard({ name, info, scientific_name, habitat, image_url }: PlantCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-green-200/40 transition-all duration-300 flex flex-col h-full group"
    >
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={image_url || "https://images.unsplash.com/photo-1501004318641-729e8454bd0e?q=80&w=1000&auto=format&fit=crop"} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Scientific Name Badge (Glassmorphism) */}
        <div className="absolute bottom-3 left-3 right-3 backdrop-blur-md bg-white/70 border border-white/20 px-3 py-1.5 rounded-xl">
          <p className="text-[10px] uppercase tracking-widest font-black text-green-800 flex items-center gap-1.5">
            <FaMicroscope className="text-green-600" /> {scientific_name}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="font-black text-2xl text-gray-900 leading-tight group-hover:text-green-600 transition-colors">
            {name}
          </h3>
          
          <div className="flex items-center gap-2 mt-2 text-slate-400">
            <FaMapMarkerAlt size={12} className="text-green-500" />
            <span className="text-xs font-bold uppercase tracking-tighter">{habitat}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
          {info}
        </p>

        {/* Action Button */}
        <div className="mt-auto">
          <button
            className="w-full group/btn flex items-center justify-center gap-2 bg-slate-50 hover:bg-green-600 text-gray-900 hover:text-white py-3.5 rounded-2xl font-bold transition-all duration-300"
            onClick={() => navigate(`/plants/${encodeURIComponent(name)}`)}
          >
            Explore Wisdom
            <FaArrowRight className="text-green-500 group-hover/btn:text-white transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}