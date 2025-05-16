// Importaciones
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/general/Header";
import Footer from "../../components/general/Footer";

// Componente principal
export default function Respuestas() {
  const location = useLocation();
  const navigate = useNavigate();

  // Datos recibidos desde navegación previa
  const respuestasIniciales = location.state?.respuestas || [];
  const entrevistaId = location.state?.entrevistaId;
  const puestoId = location.state?.puestoId;
  const idEntrevistador = location.state?.idEntrevistador;
  const idCandidato = location.state?.idCandidato;

  // Estados del componente
  const [mostrarJSON, setMostrarJSON] = useState(false);
  const [jsonFinal, setJsonFinal] = useState(null);

  // Volver atrás a la pantalla de preguntas, con datos preservados
  const handleVolver = () => {
    navigate("/preguntas", {
      state: {
        respuestas: respuestasIniciales,
        entrevistaId,
        puestoId,
        idEntrevistador,
        idCandidato
      }
    });
  };

  // Finalizar entrevista y guardar respuestas
  const handleFinalizar = async () => {
    try {
      // Construcción del payload para la API
      const payloadBackend = respuestasIniciales.map((r) => {
        const respuesta = {
          entrevista: { idEntrevista: entrevistaId },
          textoRespuesta: r.value
        };

        // Distinguir entre pregunta normal y personalizada
        if (r.tipo === "personalizada") {
          respuesta.preguntaPersonalizada = { idPreguntaPersonalizada: r.id };
        } else {
          respuesta.pregunta = { idPregunta: r.id };
        }

        return respuesta;
      });

      // Enviar respuestas al backend
      const response = await fetch("http://localhost:8080/api/respuestas/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadBackend)
      });

      if (!response.ok) throw new Error("Error al guardar respuestas");

      // Crear JSON de resumen para mostrar al usuario
      const resumen = {
        idEntrevistador,
        idCandidato,
        idPuesto: puestoId,
        respuestas: respuestasIniciales.map((r) =>
          r.tipo === "personalizada"
            ? {
                textoPreguntaPersonalizada: r.label,
                respuesta: r.value
              }
            : {
                idPregunta: r.id,
                respuesta: r.value
              }
        )
      };

      setJsonFinal(resumen);
      setMostrarJSON(true);
      console.log("JSON generado:", resumen);

    } catch (err) {
      console.error("Error al guardar respuestas:", err);
    }
  };

  // Renderizado del componente
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col font-sans text-blue-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-white/70 shadow-2xl rounded-3xl p-10 max-w-4xl mx-auto border border-blue-200 backdrop-blur-md">
          <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-10 tracking-tight">
            Respuestas Enviadas
          </h1>

          {/* Listado de respuestas mostradas */}
          <ul className="space-y-4">
            {respuestasIniciales.map((resp, idx) => (
              <li
                key={idx}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow"
              >
                <p className="font-semibold text-blue-800">{resp.label}</p>
                <p className="text-blue-600">{resp.value || "Sin respuesta"}</p>
              </li>
            ))}
          </ul>

          {/* Botones de navegación */}
          <div className="flex justify-center gap-6 mt-10">
            <button
              onClick={handleVolver}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-xl font-semibold transition-transform transform hover:scale-105"
            >
              Volver
            </button>
            <button
              onClick={handleFinalizar}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-xl font-semibold transition-transform transform hover:scale-105"
            >
              Finalizar
            </button>

          </div>

          {/* Mostrar resumen JSON generado */}
          {mostrarJSON && jsonFinal && (
            <div className="mt-12 p-6 bg-gray-100 border border-gray-300 rounded-xl">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">JSON generado:</h3>
              <pre className="text-sm overflow-x-auto text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(jsonFinal, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
