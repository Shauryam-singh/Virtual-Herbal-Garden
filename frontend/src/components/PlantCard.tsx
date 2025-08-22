import { useNavigate } from "react-router-dom";

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
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 w-64 flex flex-col">
      {/* Image */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={image_url}
          alt={name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-xl text-green-800">{name}</h3>
          <p className="text-gray-700 text-sm mt-1 line-clamp-3">{info}</p>
          <p className="text-gray-500 italic text-xs mt-2">Scientific: {scientific_name}</p>
          <p className="text-gray-500 text-xs">Habitat: {habitat}</p>
        </div>

        <button
          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-colors"
          onClick={() => navigate(`/plants/${encodeURIComponent(name)}`)}
        >
          Learn More
        </button>
      </div>
    </div>
  );
}
