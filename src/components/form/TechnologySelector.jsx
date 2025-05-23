import React, { useEffect, useState } from "react";
import { obtenerCategoriasTecnologia } from "../../services/categorias";

export default function TechnologySelector({ selected, onSelect }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    obtenerCategoriasTecnologia()
      .then((json) => {
        const categorias = Array.isArray(json) && Array.isArray(json[0]) ? json[0] : json;
        setData(categorias);
      })
      .catch((e) => console.error("Error cargando tecnologías", e));
  }, []);

  return (
    <><div className="grid sm:grid-cols-2 gap-6 max-h-80 overflow-y-auto p-4 bg-white/60 rounded-xl border border-blue-300">
      {Array.isArray(data) &&
        data.map(({ idCategoriaTecnologia, nombre, categorias = [] }) => (
          <div key={idCategoriaTecnologia}>
            <p className="font-medium mb-2">
              {nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase()}
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(categorias) &&
                categorias.map(({ idCategoria, nombre: nombreCat }) => {
                  const estaSeleccionada = selected === nombreCat;
                  const hayUnaSeleccionada = Boolean(selected);
                  return (
                    <button
                      key={idCategoria}
                      type="button"
                      onClick={() => onSelect(estaSeleccionada ? null : nombreCat)}
                      disabled={hayUnaSeleccionada && !estaSeleccionada}
                      className={`px-3 py-1 rounded-full text-sm font-medium border transition shadow-sm ${estaSeleccionada
                          ? "bg-blue-600 text-white border-blue-600"
                          : hayUnaSeleccionada
                            ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                            : "bg-white text-blue-700 border-blue-300 hover:bg-blue-100"}`}
                    >
                      {nombreCat}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
    </div><div>
        {selected && (
          <div className="mt-6 bg-white/60 p-4 rounded-xl border border-blue-200 shadow flex items-center justify-between">
            <p className="text-sm font-semibold text-blue-900">
              Tecnología seleccionada:
              <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {selected}
              </span>
            </p>
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-1.5 rounded-full text-sm font-semibold transition"
            >
              Deseleccionar
            </button>
          </div>
        )}
      </div></>
  );
}