import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/general/Header";
import Footer from "../../components/general/Footer";

export default function Respuestas() {
  const location = useLocation();
  const navigate = useNavigate();
  const respuestasIniciales = location.state?.respuestas || [];

  const [mostrarJSON, setMostrarJSON] = useState(false);

  const handleVolver = () => {
    navigate("/preguntas", { state: { respuestas: respuestasIniciales } });
  };

  const handleFinalizar = () => {
    setMostrarJSON(true);
    console.log("JSON generado:", respuestasIniciales);
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

          <div className="flex justify-center gap-6 mt-10">
            <button
              onClick={handleVolver}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-xl font-semibold transition-transform transform hover:scale-105"
            >
              Volver
            </button>
            <button
              onClick={handleFinalizar}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-xl font-semibold transition-transform transform hover:scale-105"
            >
              Finalizar
            </button>
          </div>

          {mostrarJSON && (
            <div className="mt-12 p-6 bg-gray-100 border border-gray-300 rounded-xl">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">JSON generado:</h3>
              <pre className="text-sm overflow-x-auto text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(respuestasIniciales, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
