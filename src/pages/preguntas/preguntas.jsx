import React, { useState } from 'react';
import Header from "../../components/general/Header";
import Footer from "../../components/general/Footer";

export default function PreguntasFormulario() {
  const [preguntasExtra, setPreguntasExtra] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [contadorExtra, setContadorExtra] = useState(1);

  const handleAgregarPregunta = (e) => {
    e.preventDefault();
    const texto = nuevaPregunta.trim();
    if (!texto) return;

    const nueva = {
      id: `preguntaExtra${contadorExtra}`,
      label: texto,
      value: '',
    };

    setPreguntasExtra([...preguntasExtra, nueva]);
    setContadorExtra(contadorExtra + 1);
    setNuevaPregunta('');
  };

  const handleInputChange = (id, value) => {
    setPreguntasExtra((prev) =>
      prev.map((pregunta) => (pregunta.id === id ? { ...pregunta, value } : pregunta))
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col font-sans text-blue-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-white/70 shadow-2xl rounded-3xl p-10 max-w-4xl mx-auto border border-blue-200 backdrop-blur-md">
          <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-10 tracking-tight">Entrevista Técnica</h1>

          <form className="space-y-10">
            <Section title="Preguntas Genéricas" prefix="pregunta" />
            <Section title="Preguntas Específicas" prefix="preguntaEspecifica" />

            <section className="space-y-6">
              {preguntasExtra.map((pregunta) => (
                <div key={pregunta.id}>
                  <label htmlFor={pregunta.id} className="block text-sm font-semibold text-blue-800 mb-2">
                    {pregunta.label}
                  </label>
                  <input
                    type="text"
                    id={pregunta.id}
                    name={pregunta.id}
                    value={pregunta.value}
                    onChange={(e) => handleInputChange(pregunta.id, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>
              ))}
            </section>

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

function Section({ title, prefix }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">{title}</h2>
      <div className="grid gap-6">
        {[1, 2, 3, 4].map((num) => (
          <div key={`${prefix}${num}`}>
            <label htmlFor={`${prefix}${num}`} className="block text-sm font-semibold text-blue-800 mb-2">
              {`${title.slice(0, -1)} ${num}`}
            </label>
            <input
              type="text"
              id={`${prefix}${num}`}
              name={`${prefix}${num}`}
              className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
