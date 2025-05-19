import React, { useState } from "react";
import TechnologySelector from "../form/TechnologySelector";

export default function ChatCandidateForm({ onSubmit }) {
  const [descripcion, setDescripcion] = useState("");
  const [puesto, setPuesto] = useState("");
  const [tecnologiaSeleccionada, setTecnologiaSeleccionada] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!puesto || !descripcion || !tecnologiaSeleccionada) return;

    onSubmit({ puesto, descripcion, tecnologia: tecnologiaSeleccionada });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div>
        <label className="block font-semibold mb-1">Descripción del perfil</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
          placeholder="Incluye tecnologías deseadas, años de experiencia, etc."
          className="w-full border border-blue-300 rounded-xl px-4 py-2"
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
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
        >
          Buscar candidatos
        </button>
      </div>
    </form>
  );
}