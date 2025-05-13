import React, { useState, useEffect } from "react";

const tecnologias = {
  Móvil: ["iOS", "Android", "Cordova", "Xamarin", "Ionic"],
  Frontend: ["HTML5", "CSS3", "Angular", "Bootstrap"],
  Backend: ["Java", "Spring", "Spring Boot", "REST", ".NET", "AEM"],
  DevOps: ["Git", "Subversion", "Jira"],
  Datos: ["Cloudera", "Stratio", "SQL Server", "BizTalk Server"],
  Empresarial: ["SAP", "Appian", "Salesforce", "SharePoint", "Visual Studio"]
};

export default function EntrevistaForm() {
  const [fechaActual, setFechaActual] = useState("");
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [nivel, setNivel] = useState("");
  const [placeholderExperiencia, setPlaceholderExperiencia] = useState("");

  useEffect(() => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    setFechaActual(`${yyyy}-${mm}-${dd}`);
  }, []);

  useEffect(() => {
    switch (nivel) {
      case "junior":
        setPlaceholderExperiencia("0 a 2 años");
        break;
      case "semi":
        setPlaceholderExperiencia("2 a 5 años");
        break;
      case "senior":
        setPlaceholderExperiencia("Más de 5 años");
        break;
      default:
        setPlaceholderExperiencia("");
    }
  }, [nivel]);

  const toggleTecnologia = (nombre) => {
    setSeleccionadas((prev) =>
      prev.includes(nombre) ? prev.filter((t) => t !== nombre) : [...prev, nombre]
    );
  };

  const deseleccionarTodo = () => {
    setSeleccionadas([]);
  };

  return (
    <div className="bg-white text-blue-900 min-h-screen flex flex-col justify-between">
      {/* HEADER */}
      <header className="w-full bg-blue-600 text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wide">NombreAplicacion</h1>
          <nav className="space-x-6 text-sm font-medium">
            <a href="#entrevista" className="hover:underline">Entrevista</a>
            <a href="#informe" className="hover:underline">Informe</a>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="w-full max-w-4xl mx-auto mt-12 bg-white p-10 rounded-3xl border border-blue-200 shadow-xl">
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-10">Entrevista Técnica</h2>

        <form className="space-y-6">
            
          {/* NOMBRE ENTREVISTADOR */}
          <div>
            <label htmlFor="nombreentrevistador" className="block text-sm font-semibold text-blue-800 mb-1">Nombre del entrevistador</label>
            <input type="text" id="nombreentrevistador" name="nombreentrevistador" className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition" />
          </div>

          {/* NOMBRE CANDIDATO */}
          <div>
            <label htmlFor="nombrecandidato" className="block text-sm font-semibold text-blue-800 mb-1">Nombre del candidato</label>
            <input type="text" id="nombrecandidato" name="nombrecandidato" className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition" />
          </div>

        
          {/* CATEGORÍAS DE TECNOLOGÍA */}
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-2">Tecnologías</label>
            <div className="grid sm:grid-cols-2 gap-6 max-h-80 overflow-y-auto border border-blue-300 rounded-xl p-4 bg-blue-50">
              {Object.entries(tecnologias).map(([categoria, items]) => (
                <div key={categoria}>
                  <p className="font-medium text-blue-700 mb-2">{categoria}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((nombre) => {
                      const estaSeleccionada = seleccionadas.includes(nombre);
                      return (
                        <button
                          key={nombre}
                          type="button"
                          onClick={() => toggleTecnologia(nombre)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border transition 
                            ${estaSeleccionada
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-blue-700 border-blue-300 hover:bg-blue-100"
                            }`}
                        >
                          {nombre}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LISTA DE SELECCIONADAS + DESELECCIONAR */}
          {seleccionadas.length > 0 && (
            <div className="border border-blue-200 bg-white p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-blue-800">Tecnologías seleccionadas:</p>
                <button
                  type="button"
                  onClick={deseleccionarTodo}
                  className="text-sm text-red-600 hover:underline"
                >
                  Deseleccionar todo
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {seleccionadas.map((tec) => (
                  <span key={tec} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {tec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* NIVEL */}
          <div>
            <label htmlFor="nivel" className="block text-sm font-semibold text-blue-800 mb-1">Nivel</label>
            <select
              id="nivel"
              name="nivel"
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            >
              <option value="">Selecciona un nivel</option>
              <option value="junior">Junior</option>
              <option value="semi">Semi-Senior</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          {/* AÑOS DE EXPERIENCIA */}
          <div>
            <label htmlFor="experiencia" className="block text-sm font-semibold text-blue-800 mb-1">Años de experiencia</label>
            <input
              type="text"
              id="experiencia"
              name="experiencia"
              placeholder={placeholderExperiencia}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            />
          </div>


          {/* FECHA */}
          <div>
            <label htmlFor="fecha" className="block text-sm font-semibold text-blue-800 mb-1">Fecha</label>
            <input type="date" id="fecha" name="fecha" value={fechaActual} readOnly className="w-full px-4 py-3 border border-blue-300 rounded-xl bg-blue-50 text-blue-700 cursor-not-allowed" />
          </div>

          <div className="pt-4 text-center">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-lg transition duration-300">
              Enviar entrevista
            </button>
          </div>
        </form>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-blue-600 text-white py-4 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-sm">
          <span>© 2025 NombreAplicacion. Todos los derechos reservados.</span>
          <div className="mt-2 sm:mt-0">Contacto: soporte@nombreaplicacion.com</div>
        </div>
      </footer>
    </div>
  );
}
