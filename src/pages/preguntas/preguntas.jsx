import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/general/Header";
import Footer from "../../components/general/Footer";
import { useEntrevistaStore } from "../../stores/entrevistaStore";
import { usePreguntasStore } from "../../stores/preguntasStore";
import {
  getPreguntasGenericas,
  getPreguntasPuesto,
  getPreguntasPersonalizadas,
  eliminarPreguntaPersonalizada,
} from "../../services/preguntas";

export default function PreguntasFormulario() {
  const navigate = useNavigate();

  // Obtenemos datos desde el store
  const entrevista = useEntrevistaStore((state) => state.entrevista);
  const { setRespuestas: setRespuestasStore } = useEntrevistaStore();

  const {
    preguntasGenericas,
    setPreguntasGenericas,
    preguntasPuesto,
    setPreguntasPuesto,
    preguntasPersonalizadas,
    setPreguntasPersonalizadas,
  } = usePreguntasStore();

  const [respuestas, setRespuestas] = useState({});
  const [nuevaPregunta, setNuevaPregunta] = useState("");
  useEffect(() => {
    if (entrevista?.respuestas?.length > 0) {
      const respuestasIniciales = {};
      entrevista.respuestas.forEach((r) => {
        respuestasIniciales[r.id] = r.value;
      });
      setRespuestas(respuestasIniciales);
    }
  }, []);

  useEffect(() => {
    if (!entrevista) return;

    const { idPuesto, idEntrevista } = entrevista;

    console.log(idPuesto);

    getPreguntasGenericas().then(setPreguntasGenericas);

    if (idPuesto) getPreguntasPuesto(idPuesto).then(setPreguntasPuesto);
    if (idEntrevista)
      getPreguntasPersonalizadas(idEntrevista).then(setPreguntasPersonalizadas);
  }, [entrevista]);

  const handleRespuesta = (id, value) => {
    setRespuestas((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const respuestasPreparadas = [
      ...preguntasGenericas.map((p) => ({
        id: p.idPregunta,
        label: p.texto,
        tipo: "generica",
        value: respuestas[p.idPregunta] || "",
      })),
      ...preguntasPuesto.map((p) => ({
        id: p.idPregunta,
        label: p.texto,
        tipo: "especifica",
        value: respuestas[p.idPregunta] || "",
      })),
      ...preguntasPersonalizadas.map((p) => ({
        id: p.idPreguntaPersonalizada ?? null,
        label: p.texto,
        tipo: "personalizada",
        value: respuestas[p.texto] || "",
      })),
    ];
    console.log(entrevista);

    setRespuestasStore(respuestasPreparadas);
    navigate("/respuestas");
  };

  const handleAgregarPregunta = (e) => {
    e.preventDefault();

    const texto = nuevaPregunta.trim();
    if (!texto) return;

    // ✅ Validación para evitar preguntas duplicadas por texto
    if (preguntasPersonalizadas.some((p) => p.texto === texto)) {
      alert("Esa pregunta ya existe");
      return;
    }

    const nueva = {
      texto, // para mostrar en pantalla
      respuesta: "", // inicializada vacía
    };

    setPreguntasPersonalizadas([...preguntasPersonalizadas, nueva]);
    setNuevaPregunta("");
  };

  const handleEliminarPregunta = async (id) => {
    try {
      await eliminarPreguntaPersonalizada(id);
      setPreguntasPersonalizadas(
        preguntasPersonalizadas.filter((p) => p.idPreguntaPersonalizada !== id)
      );
    } catch {
      alert("No se pudo eliminar la pregunta personalizada");
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
              tipo="generica"
              respuestas={respuestas}
              onChange={handleRespuesta}
            />
            <PreguntaSection
              titulo="Preguntas Específicas del Puesto"
              preguntas={preguntasPuesto}
              tipo="especifica"
              respuestas={respuestas}
              onChange={handleRespuesta}
            />
            <PreguntaSection
              titulo="Preguntas Personalizadas"
              preguntas={preguntasPersonalizadas}
              tipo="personalizada"
              respuestas={respuestas}
              onChange={handleRespuesta}
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
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Añadir pregunta personalizada
            </h2>
            <form
              onSubmit={handleAgregarPregunta}
              className="flex gap-4 items-center"
            >
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

function PreguntaSection({
  titulo,
  preguntas,
  tipo,
  respuestas,
  onChange,
  esPersonalizada = false,
  onEliminar,
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6 text-blue-700">{titulo}</h2>
      <div className="grid gap-6">
        {preguntas.map((p) => {
          const id =
            tipo === "personalizada"
              ? p.idPreguntaPersonalizada || p.texto
              : p.idPregunta;

          return (
            <div key={id} className="relative">
              <label
                htmlFor={id}
                className="block text-sm font-semibold text-blue-800 mb-2"
              >
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
                  onClick={() => onEliminar(id)}
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
