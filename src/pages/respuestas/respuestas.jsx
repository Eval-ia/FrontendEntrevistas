import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/general/Header";
import Footer from "../../components/general/Footer";
import { useEntrevistaStore } from "../../stores/entrevistaStore";
import { guardarRespuestas } from "../../services/respuestas";

export default function Respuestas() {
  const navigate = useNavigate();
  const { entrevista, limpiarEntrevista } = useEntrevistaStore();

  const [mostrarResumenJSON, setMostrarResumenJSON] = useState(false);
  const [resumenEntrevistaJSON, setResumenEntrevistaJSON] = useState(null);
  const [mensajeError, setMensajeError] = useState(null);

  // Volver a la pantalla de preguntas
  const handleVolverAPreguntas = () => {
    navigate("/preguntas");
  };

  // Finalizar la entrevista y guardar respuestas
  const handleFinalizarEntrevista = async () => {
    try {
      setMensajeError(null);

      // Guardar las respuestas en el backend
      await guardarRespuestas(entrevista.respuestas, entrevista.idEntrevista);

      // Construir el resumen de la entrevista en formato JSON
      const resumenEntrevista = {
        idEntrevistador: entrevista.idEntrevistador,
        idCandidato: entrevista.idCandidato,
        idPuesto: entrevista.idPuesto,
        respuestas: entrevista.respuestas.map((respuesta) =>
          respuesta.tipo === "personalizada"
            ? {
                textoPreguntaPersonalizada: respuesta.label,
                respuesta: respuesta.value
              }
            : {
                idPregunta: respuesta.id,
                respuesta: respuesta.value
              }
        )
      };

      setResumenEntrevistaJSON(resumenEntrevista);
      setMostrarResumenJSON(true);
      limpiarEntrevista();
    } catch (error) {
      setMensajeError("No se pudieron guardar las respuestas.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col font-sans text-blue-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-white/70 shadow-2xl rounded-3xl p-10 max-w-4xl mx-auto border border-blue-200 backdrop-blur-md">
          <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-10 tracking-tight">
            Respuestas Enviadas
          </h1>
          <ul className="space-y-4">
            {entrevista.respuestas.map((respuesta, indice) => (
              <li key={indice} className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow">
                <p className="font-semibold text-blue-800">{respuesta.label}</p>
                <p className="text-blue-600">{respuesta.value || "Sin respuesta"}</p>
              </li>
            ))}
          </ul>
          <div className="flex justify-center gap-6 mt-10">
            <button
              onClick={handleVolverAPreguntas}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-xl font-semibold transition-transform transform hover:scale-105"
            >
              Volver
            </button>
            <button
              onClick={handleFinalizarEntrevista}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-xl font-semibold transition-transform transform hover:scale-105"
            >
              Finalizar
            </button>
          </div>
          {mensajeError && <p className="text-red-600 mt-4 text-center">{mensajeError}</p>}
          {mostrarResumenJSON && resumenEntrevistaJSON && (
            <div className="mt-12 p-6 bg-gray-100 border border-gray-300 rounded-xl">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">JSON generado:</h3>
              <pre className="text-sm overflow-x-auto text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(resumenEntrevistaJSON, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
