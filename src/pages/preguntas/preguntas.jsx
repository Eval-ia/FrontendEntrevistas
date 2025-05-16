import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/general/Header";
import Footer from "../../components/general/Footer";

export default function PreguntasFormulario() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const puestoId = searchParams.get("puestoId");

  const [preguntasGenericas, setPreguntasGenericas] = useState([]);
  const [preguntasEspecificas, setPreguntasEspecificas] = useState([]);
  const [preguntasExtra, setPreguntasExtra] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [contadorExtra, setContadorExtra] = useState(1);

  useEffect(() => {
    const respuestasGuardadas = location.state?.respuestas;

    const fetchPreguntas = async () => {
      try {
        const respGenericas = await fetch("http://localhost:8080/api/preguntas");
        if (!respGenericas.ok) throw new Error("Error al obtener preguntas genéricas");
        const dataGenericas = await respGenericas.json();
        const formateadasGenericas = dataGenericas
          .filter(p => p.esGenerica)
          .map((p, index) => ({
            id: `generica${index + 1}`,
            label: p.texto,
            value: "",
          }));

        let formateadasEspecificas = [];
        if (puestoId) {
          const respEspecificas = await fetch(`http://localhost:8080/api/preguntas/puesto/${puestoId}`);
          if (!respEspecificas.ok) throw new Error("Error al obtener preguntas específicas");
          const dataEspecificas = await respEspecificas.json();
          formateadasEspecificas = dataEspecificas.map((p, index) => ({
            id: `especifica${index + 1}`,
            label: p.texto,
            value: "",
          }));
        }

        if (respuestasGuardadas) {
          const genericas = respuestasGuardadas.filter(r => r.id.startsWith("generica"));
          const especificas = respuestasGuardadas.filter(r => r.id.startsWith("especifica"));
          const extra = respuestasGuardadas.filter(r => r.id.startsWith("preguntaExtra"));

          setPreguntasGenericas(genericas.length ? genericas : formateadasGenericas);
          setPreguntasEspecificas(especificas.length ? especificas : formateadasEspecificas);
          setPreguntasExtra(extra);
          setContadorExtra(extra.length + 1);
        } else {
          setPreguntasGenericas(formateadasGenericas);
          setPreguntasEspecificas(formateadasEspecificas);
        }
      } catch (error) {
        console.error("❌ Error al cargar preguntas:", error);
      }
    };

    fetchPreguntas();
  }, [puestoId, location.state]);

  const handleAgregarPregunta = async (e) => {
    e.preventDefault();
    const texto = nuevaPregunta.trim();
    if (!texto) return;

    try {
      const response = await fetch("http://localhost:8080/api/preguntas/personalizada", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texto }),
      });

      if (!response.ok) throw new Error("Error al guardar la pregunta");

      const nueva = {
        id: `preguntaExtra${contadorExtra}`,
        label: texto,
        value: "",
      };

      setPreguntasExtra([...preguntasExtra, nueva]);
      setContadorExtra(contadorExtra + 1);
      setNuevaPregunta("");
    } catch (error) {
      console.error("Error al guardar en el backend:", error);
      alert("No se pudo guardar la pregunta.");
    }
  };

  const handleEliminarPreguntaExtra = (id) => {
    setPreguntasExtra((prev) => prev.filter((pregunta) => pregunta.id !== id));
  };

  const handleInputChange = (id, value, setStateFn) => {
    setStateFn((prev) =>
      prev.map((pregunta) => (pregunta.id === id ? { ...pregunta, value } : pregunta))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const respuestas = [
      ...preguntasGenericas,
      ...preguntasEspecificas,
      ...preguntasExtra,
    ];
    navigate("/respuestas", { state: { respuestas } });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col font-sans text-blue-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-white/70 shadow-2xl rounded-3xl p-10 max-w-4xl mx-auto border border-blue-200 backdrop-blur-md">
          <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-10 tracking-tight">
            Entrevista Técnica
          </h1>

          <form className="space-y-10" onSubmit={handleSubmit}>
            <Section
              title="Preguntas Genéricas"
              preguntas={preguntasGenericas}
              onInputChange={(id, value) => handleInputChange(id, value, setPreguntasGenericas)}
            />

            <Section
              title={`Preguntas Específicas ${puestoId ? `(Puesto ${puestoId})` : "(Puesto no especificado)"}`}
              preguntas={preguntasEspecificas}
              onInputChange={(id, value) => handleInputChange(id, value, setPreguntasEspecificas)}
            />

            <Section
              title="Preguntas Personalizadas"
              preguntas={preguntasExtra}
              onInputChange={(id, value) => handleInputChange(id, value, setPreguntasExtra)}
              onEliminar={handleEliminarPreguntaExtra}
            />

            <div className="text-center mt-10">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-xl font-semibold transition-transform transform hover:scale-105"
              >
                Enviar respuestas
              </button>
            </div>
          </form>

          <div className="mt-14 pt-6 border-t border-blue-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Añadir pregunta</h2>
            <form onSubmit={handleAgregarPregunta} className="flex gap-4 items-center">
              <input
                type="text"
                id="nuevaPregunta"
                value={nuevaPregunta}
                onChange={(e) => setNuevaPregunta(e.target.value)}
                placeholder="Escribe la nueva pregunta"
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-xl font-semibold transition-transform transform hover:scale-105"
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

function Section({ title, preguntas, onInputChange, onEliminar }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">{title}</h2>
      <div className="grid gap-6">
        {preguntas.map((pregunta) => (
          <div key={pregunta.id} className="relative">
            <label htmlFor={pregunta.id} className="block text-sm font-semibold text-blue-800 mb-2">
              {pregunta.label}
            </label>
            <input
              type="text"
              id={pregunta.id}
              name={pregunta.id}
              value={pregunta.value}
              onChange={(e) => onInputChange(pregunta.id, e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            />
            {onEliminar && (
              <button
                type="button"
                onClick={() => onEliminar(pregunta.id)}
                className="absolute top-0 right-0 -translate-y-2 mr-1 px-4 py-1 text-red-700 bg-red-100 rounded-full text-sm font-medium hover:bg-red-200 transition"
                title="Eliminar"
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
