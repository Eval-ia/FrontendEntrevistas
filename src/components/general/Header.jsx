import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useEntrevistaStore } from "../../stores/entrevistaStore";
import { usePreguntasStore } from "../../stores/preguntasStore";

export default function Header() {
  const resetEntrevistaTotal = useEntrevistaStore((state) => state.resetEntrevistaTotal);
  const limpiarPreguntas = usePreguntasStore((state) => state.limpiarPreguntas);
  const entrevista = useEntrevistaStore((state) => state.entrevista);

  useEffect(() => {
    console.log("localStorage");
    console.log(localStorage);
    console.log("entrevista");
    console.log(entrevista);
  }, []);

  const handleClick = () => {
    limpiarPreguntas(); // solo limpia memoria
    resetEntrevistaTotal(); // limpia memoria + localStorage
    localStorage.removeItem("preguntas-storage"); // añadimos también este
  };

  return (
    <header className="w-full bg-blue-600 text-white py-4 shadow-md">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link
          to="/"
          onClick={handleClick}
          className="text-xl font-bold tracking-wide hover:underline"
        >
          Eval.IA
        </Link>
        <nav className="space-x-6 text-sm font-medium">
          <Link
            to="/entrevista"
            onClick={handleClick}
            className="hover:underline"
          >
            Entrevista
          </Link>
          <Link to="#informe" onClick={handleClick} className="hover:underline">
            Informe
          </Link>
        </nav>
      </div>
    </header>
  );
}
