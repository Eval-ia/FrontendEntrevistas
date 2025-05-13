import React, { useState, useEffect } from "react";

export default function EntrevistaForm() {
  const [fechaActual, setFechaActual] = useState("");

  useEffect(() => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    setFechaActual(`${yyyy}-${mm}-${dd}`);
  }, []);

  return (
    <div className="bg-white text-blue-900 min-h-screen flex flex-col items-center justify-start py-10">
      <header className="w-full bg-blue-600 text-white py-3">
        <h1 className="text-center text-xl font-medium">NombreAplicacion</h1>
      </header>

      <main className="bg-white mt-10 p-8 rounded-2xl shadow-lg w-full max-w-xl border border-blue-200">
        <h2 className="text-3xl font-semibold text-blue-800 mb-6 text-center">ENTREVISTA</h2>

        {/* CATEGORÍA */}
        <div className="mb-6">
          <label htmlFor="categoria" className="block text-sm font-medium text-blue-800 mb-2">Categoría</label>
          <select id="categoria" name="categoria" className="block w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option defaultValue>Selecciona una categoría</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="otros">Otros</option>
          </select>
        </div>

        {/* NIVEL */}
        <div className="mb-6">
          <label htmlFor="nivel" className="block text-sm font-medium text-blue-800 mb-2">Nivel</label>
          <select id="nivel" name="nivel" className="block w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option defaultValue>Selecciona un nivel</option>
            <option value="junior">Junior</option>
            <option value="semi">Semi-Senior</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        {/* ENTREVISTADOR */}
        <div className="mb-6">
          <label htmlFor="nombreentrevistador" className="block text-sm font-medium text-blue-800 mb-2">Nombre del entrevistador</label>
          <input type="text" name="nombreentrevistador" id="nombreentrevistador" className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* ENTREVISTADO */}
        <div className="mb-6">
          <label htmlFor="nombreentrevistado" className="block text-sm font-medium text-blue-800 mb-2">Nombre del entrevistado</label>
          <input type="text" name="nombreentrevistado" id="nombreentrevistado" className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* FECHA */}
        <div className="mb-6">
          <label htmlFor="fecha" className="block text-sm font-medium text-blue-800 mb-2">Fecha</label>
          <input type="date" name="fecha" id="fecha" value={fechaActual} className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" readOnly />
        </div>

        <div className="text-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-200">
            Enviar
          </button>
        </div>
      </main>
    </div>
  );
}
