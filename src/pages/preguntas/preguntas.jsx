// Importaciones
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../../components/general/Header";
import Footer from "../../components/general/Footer";

// Componente principal
export default function PreguntasFormulario() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extraer datos pasados por navegación
  const { puestoId, entrevistaId, idEntrevistador, idCandidato } = location.state || {};

  // Estados del componente
  const [preguntasGenericas, setPreguntasGenericas] = useState([]);
  const [preguntasEspecificas, setPreguntasEspecificas] = useState([]);
  const [preguntasPersonalizadas, setPreguntasPersonalizadas] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState("");
  const [respuestas, setRespuestas] = useState({});

  // Cargar respuestas guardadas (en caso de volver atrás)
  useEffect(() => {
    if (location.state?.respuestas) {
      const respuestasGuardadas = {};
      location.state.respuestas.forEach(r => {
        respuestasGuardadas[`${r.tipo}-${r.id}`] = r.value;
      });
      setRespuestas(respuestasGuardadas);
    }
  }, []);

  // Cargar preguntas desde la API
  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        // Preguntas genéricas
        const respGen = await fetch("http://localhost:8080/api/preguntas/genericas");
        if (respGen.ok) setPreguntasGenericas(await respGen.json());

        // Preguntas específicas por puesto
        if (puestoId) {
          const respEsp = await fetch(`http://localhost:8080/api/preguntas/puesto/${puestoId}`);
          if (respEsp.ok) setPreguntasEspecificas(await respEsp.json());
        }

        // Preguntas personalizadas por entrevista
        if (entrevistaId) {
          const respPers = await fetch(`http://localhost:8080/api/preguntas/personalizada/${entrevistaId}`);
          setPreguntasPersonalizadas(respPers.ok ? await respPers.json() : []);
        }

      } catch (err) {
        console.error("Error al cargar preguntas:", err);
      }
    };

    fetchPreguntas();
  }, [puestoId, entrevistaId]);

  // Manejar cambio de respuestas
  const handleChange = (id, value) => {
    setRespuestas(prev => ({ ...prev, [id]: value }));
  };

  // Enviar respuestas y navegar
  const handleSubmit = (e) => {
    e.preventDefault();

    const respuestasPreparadas = Object.entries(respuestas).map(([key, value]) => {
      const [tipo, id] = key.split("-");

      const pregunta = [...preguntasGenericas, ...preguntasEspecificas, ...preguntasPersonalizadas].find(p =>
        (tipo === "generica" && p.idPregunta === parseInt(id)) ||
        (tipo === "especifica" && p.idPregunta === parseInt(id)) ||
        (tipo === "personalizada" && p.idPreguntaPersonalizada === parseInt(id))
      );

      return {
        label: pregunta?.texto || "Pregunta",
        value,
        tipo,
        id: parseInt(id),
        campoId: tipo === "personalizada" ? "idPreguntaPersonalizada" : "idPregunta"
      };
    });

    navigate("/respuestas", {
      state: {
        respuestas: respuestasPreparadas,
        entrevistaId,
        puestoId,
        idEntrevistador,
        idCandidato
      }
    });
  };

  // Añadir pregunta personalizada
  const handleAgregarPregunta = async (e) => {
    e.preventDefault();
    const texto = nuevaPregunta.trim();
    if (!texto || !entrevistaId) return;

    try {
      const response = await fetch("http://localhost:8080/api/preguntas/personalizada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, entrevistaId })
      });

      if (!response.ok) throw new Error("Error al guardar pregunta personalizada");

      const nueva = await response.json();
      setPreguntasPersonalizadas(prev => [...prev, nueva]);
      setNuevaPregunta("");

    } catch (err) {
      console.error("Error al añadir pregunta personalizada:", err);
      alert("No se pudo guardar la pregunta.");
    }
  };

  // Eliminar pregunta personalizada
  const handleEliminarPregunta = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/preguntas/personalizada/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Error al eliminar pregunta");

      setPreguntasPersonalizadas(prev => prev.filter(p => p.idPreguntaPersonalizada !== id));

    } catch (err) {
      console.error("Error al eliminar pregunta:", err);
      alert("No se pudo eliminar la pregunta.");
    }
  };

  // Render principal
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col font-sans text-blue-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-white/70 shadow-2xl rounded-3xl p-10 max-w-4xl mx-auto border border-blue-200 backdrop-blur-md">
          <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-10 tracking-tight">
            Preguntas de la Entrevista
          </h1>

          {/* Formulario de preguntas */}
          <form onSubmit={handleSubmit} className="space-y-12">
            <PreguntaSection
              titulo="Preguntas Genéricas"
              preguntas={preguntasGenericas}
              prefix="generica"
              respuestas={respuestas}
              onChange={handleChange}
            />
            <PreguntaSection
              titulo="Preguntas Específicas del Puesto"
              preguntas={preguntasEspecificas}
              prefix="especifica"
              respuestas={respuestas}
              onChange={handleChange}
            />
            <PreguntaSection
              titulo="Preguntas Personalizadas"
              preguntas={preguntasPersonalizadas}
              prefix="personalizada"
              respuestas={respuestas}
              onChange={handleChange}
              esPersonalizada
              onEliminar={handleEliminarPregunta}
            />

            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-xl font-semibold transition-transform transform hover:scale-105"
              >
                Enviar respuestas
              </button>
            </div>
          </form>

          {/* Sección para agregar preguntas personalizadas */}
          <div className="mt-14 pt-6 border-t border-blue-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Añadir pregunta personalizada</h2>
            <form onSubmit={handleAgregarPregunta} className="flex gap-4 items-center">
              <input
                type="text"
                value={nuevaPregunta}
                onChange={(e) => setNuevaPregunta(e.target.value)}
                placeholder="Escribe una nueva pregunta"
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-xl font-semibold"
              >
                Añadir
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Componente reutilizable para mostrar una sección de preguntas
function PreguntaSection({
  titulo,
  preguntas,
  prefix,
  respuestas,
  onChange,
  esPersonalizada = false,
  onEliminar
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6 text-blue-700">{titulo}</h2>
      <div className="grid gap-6">
        {preguntas.map((p) => {
          const id = `${prefix}-${p.idPregunta || p.idPreguntaPersonalizada}`;
          return (
            <div key={id} className="relative">
              <label htmlFor={id} className="block text-sm font-semibold text-blue-800 mb-2">
                {p.texto}
              </label>
              <input
                type="text"
                id={id}
                name={id}
                value={respuestas[id] || ""}
                onChange={(e) => onChange(id, e.target.value)}
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              {esPersonalizada && (
                <button
                type="button"
                onClick={() => onEliminar(p.idPreguntaPersonalizada)}
                className="absolute -top-2 right-2 bg-red-100 text-red-700 font-semibold py-1 px-4 rounded-full hover:bg-red-200 transition"
                title="Eliminar pregunta"
              >
                Eliminar
              </button>

              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
