import { useState } from "react";
import TechnologySelector from "../form/TechnologySelector";

export default function ChatCandidateForm({ onSubmit }) {
  const [descripcion, setDescripcion] = useState("");
  const [tecnologiaSeleccionada, setTecnologiaSeleccionada] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!descripcion.trim()) return;

    onSubmit({ descripcion, tecnologiaSeleccionada });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="flex justify-end">
        <div className="bg-blue-100 text-blue-900 rounded-2xl px-4 py-3 max-w-xl w-full shadow-sm">
          <label className="block text-sm font-semibold text-right mb-1">
            Descripción del perfil
          </label>
          <textarea
            rows={4}
            placeholder="Incluye tecnologías deseadas, años de experiencia, etc."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full bg-blue-100 text-right resize-none placeholder-blue-400 text-sm font-normal focus:outline-none"
          />
        </div>
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
          disabled={!descripcion.trim()}
          className={`px-6 py-2 rounded-xl text-white font-semibold transition
            bg-blue-600 hover:bg-blue-700
            disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300
          `}
        >
          Buscar candidatos
        </button>
      </div>
    </form>
  );
}