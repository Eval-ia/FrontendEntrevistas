import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/general/Header";
import Footer from "../../components/general/Footer";
import { useEntrevistaStore } from "../../stores/entrevistaStore";
import { guardarRespuestas } from "../../services/respuestas";
import { finalizarEntrevista } from "../../services/entrevista";
import { crearPreguntaPersonalizada } from "../../services/preguntas";

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
  const [guardando, setGuardando] = useState(false);
  // Finalizar la entrevista y guardar respuestas
  const handleFinalizarEntrevista = async () => {
    if (guardando) return; // Previene ejecución múltiple
    setGuardando(true);
    try {
      setMensajeError(null);

      const idEntrevistaCreada = await finalizarEntrevista();

      const respuestasDePreguntasPersonalizadas = entrevista.respuestas.filter(
        (respuesta) => respuesta.tipo === "personalizada"
      );

      const preguntasPersonalizadasGuardadas = await Promise.all(
        respuestasDePreguntasPersonalizadas
          .filter(
            (respuesta, index, self) =>
              index === self.findIndex((r) => r.label === respuesta.label)
          )
          .map((respuesta) =>
            crearPreguntaPersonalizada(respuesta.label, idEntrevistaCreada)
          )
      );
      console.log(preguntasPersonalizadasGuardadas);

      const respuestasConIdsCorrectos = entrevista.respuestas.map(
        (respuesta) => {
          if (respuesta.tipo === "personalizada") {
            const preguntaCorrespondiente =
              preguntasPersonalizadasGuardadas.find(
                (p) => p.texto === respuesta.label
              );
            return {
              ...respuesta,
              id: preguntaCorrespondiente?.idPreguntaPersonalizada || null,
            };
          }
          return respuesta;
        }
      );

      await guardarRespuestas(respuestasConIdsCorrectos, idEntrevistaCreada);

      setResumenEntrevistaJSON({
        ...entrevista,
        idEntrevista: idEntrevistaCreada,
      });
      setMostrarResumenJSON(true);
      limpiarEntrevista();
    } catch (error) {
      console.error(error);
      setMensajeError("No se pudieron guardar las respuestas.");
    } finally {
      setGuardando(false); // Permite nuevo intento si falla
    }
  };
  console.log(entrevista);

  // console.log(entrevista.respuestas);

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
              <li
                key={indice}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow"
              >
                <p className="font-semibold text-blue-800">
                  {respuesta.label ||
                    respuesta.textoPreguntaPersonalizada ||
                    "Sin pregunta"}
                </p>
                <p className="text-blue-600">
                  {respuesta.value || respuesta.respuesta || "Sin respuesta"}
                </p>
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
              disabled={guardando}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-xl font-semibold transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Finalizar
            </button>
          </div>
          {mensajeError && (
            <p className="text-red-600 mt-4 text-center">{mensajeError}</p>
          )}
          {mostrarResumenJSON && resumenEntrevistaJSON && (
            <div className="mt-12 p-6 bg-gray-100 border border-gray-300 rounded-xl">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                JSON generado:
              </h3>
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
