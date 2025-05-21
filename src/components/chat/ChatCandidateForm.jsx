import { useState } from "react";
import TechnologySelector from "../form/TechnologySelector";

export default function ChatCandidateForm({ onSubmit }) {
  const [descripcion, setDescripcion] = useState("");
  const [tecnologiaSeleccionada, setTecnologiaSeleccionada] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!descripcion || !tecnologiaSeleccionada) return;

    onSubmit({ descripcion, tecnologiaSeleccionada });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div>
        <label className="block font-semibold mb-1">Descripción del perfil</label>
        <textarea
          rows={4}
          placeholder="Incluye tecnologías deseadas, años de experiencia, etc."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
                    bg-white text-blue-900 placeholder:text-blue-300 transition"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Tecnología requerida</label>
        <TechnologySelector
          selected={tecnologiaSeleccionada}
          onSelect={setTecnologiaSeleccionada}
        />
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={!descripcion.trim() || !tecnologiaSeleccionada}
          className={`px-6 py-2 rounded-xl text-white font-semibold transition ${
            descripcion.trim() && tecnologiaSeleccionada
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Buscar candidatos
        </button>
      </div>
    </form>
  );
}