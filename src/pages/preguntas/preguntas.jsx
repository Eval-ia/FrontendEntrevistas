import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../../components/general/Header";
import Footer from "../../components/general/Footer";

export default function PreguntasFormulario() {
  const location = useLocation();
  const navigate = useNavigate();

  const puestoId = location.state?.puestoId;
  const entrevistaId = location.state?.entrevistaId;
  const idEntrevistador = location.state?.idEntrevistador;
  const idCandidato = location.state?.idCandidato;

  const [preguntasGenericas, setPreguntasGenericas] = useState([]);
  const [preguntasEspecificas, setPreguntasEspecificas] = useState([]);
  const [preguntasPersonalizadas, setPreguntasPersonalizadas] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState("");
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
    if (location.state?.respuestas) {
      const respuestasGuardadas = {};
      location.state.respuestas.forEach(r => {
        respuestasGuardadas[`${r.tipo}-${r.id}`] = r.value;
      });
      setRespuestas(respuestasGuardadas);
    }
  }, []);

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const respGen = await fetch("http://localhost:8080/api/preguntas/genericas");
        if (respGen.ok) {
          const gen = await respGen.json();
          setPreguntasGenericas(gen);
        }

        if (puestoId) {
          const respEsp = await fetch(`http://localhost:8080/api/preguntas/puesto/${puestoId}`);
          if (respEsp.ok) {
            const esp = await respEsp.json();
            setPreguntasEspecificas(esp);
          }
        }

        if (entrevistaId) {
          const respPers = await fetch(`http://localhost:8080/api/preguntas/personalizada/${entrevistaId}`);
          if (respPers.ok) {
            const pers = await respPers.json();
            setPreguntasPersonalizadas(pers);
          } else {
            setPreguntasPersonalizadas([]);
          }
        }
      } catch (err) {
        console.error("Error al cargar preguntas:", err);
      }
    };

    fetchPreguntas();
  }, [puestoId, entrevistaId]);

  const handleChange = (id, value) => {
    setRespuestas(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const respuestasPreparadas = Object.entries(respuestas).map(([key, value]) => {
      const [tipo, id] = key.split("-");

      const pregunta = preguntasGenericas
        .concat(preguntasEspecificas, preguntasPersonalizadas)
        .find(p =>
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

  const handleAgregarPregunta = async (e) => {
    e.preventDefault();
    const texto = nuevaPregunta.trim();
    if (!texto || !entrevistaId) return;

    try {
      const response = await fetch("http://localhost:8080/api/preguntas/personalizada", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          texto,
          entrevistaId
        })
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

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col font-sans text-blue-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-white/70 shadow-2xl rounded-3xl p-10 max-w-4xl mx-auto border border-blue-200 backdrop-blur-md">
          <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-10 tracking-tight">
            Preguntas de la Entrevista
          </h1>

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

function PreguntaSection({ titulo, preguntas, prefix, respuestas, onChange, esPersonalizada = false, onEliminar }) {
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
                  className="absolute top-0 right-0 mt-1 mr-1 text-red-500 hover:text-red-700 font-bold text-lg"
                  title="Eliminar pregunta"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
