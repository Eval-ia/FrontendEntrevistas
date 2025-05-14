import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/general/Header";
import Footer from "../../components/general/Footer";

const tecnologias = {
  Móvil: ["iOS", "Android", "Cordova", "Xamarin", "Ionic"],
  Frontend: ["HTML5", "CSS3", "Angular", "Bootstrap"],
  Backend: ["Java", "Spring", "Spring Boot", "REST", ".NET", "AEM"],
  DevOps: ["Git", "Subversion", "Jira"],
  Datos: ["Cloudera", "Stratio", "SQL Server", "BizTalk Server"],
  Empresarial: ["SAP", "Appian", "Salesforce", "SharePoint", "Visual Studio"]
};

export default function EntrevistaForm() {
  const navigate = useNavigate();
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

  const deseleccionarTodo = () => setSeleccionadas([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/preguntas");
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col font-sans text-blue-900">
      <Header />
      <main className="w-full max-w-4xl mx-auto mt-12 p-10 rounded-3xl shadow-2xl backdrop-blur-md bg-white/70 border border-blue-200">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-10 tracking-tight">Entrevista Técnica</h2>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <InputBlock id="nombreentrevistador" label="Nombre del entrevistador" />
          <InputBlock id="nombrecandidato" label="Nombre del candidato" />

          <div>
            <label className="block text-sm font-semibold mb-2">Tecnologías</label>
            <div className="grid sm:grid-cols-2 gap-6 max-h-80 overflow-y-auto p-4 bg-white/60 rounded-xl border border-blue-300">
              {Object.entries(tecnologias).map(([categoria, items]) => (
                <div key={categoria}>
                  <p className="font-medium mb-2">{categoria}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((nombre) => {
                      const estaSeleccionada = seleccionadas.includes(nombre);
                      return (
                        <button
                          key={nombre}
                          type="button"
                          onClick={() => toggleTecnologia(nombre)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border transition shadow-sm ${
                            estaSeleccionada
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

          {seleccionadas.length > 0 && (
            <div className="bg-white/60 p-4 rounded-xl border border-blue-200 shadow">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-semibold">Tecnologías seleccionadas:</p>
                <button type="button" onClick={deseleccionarTodo} className="text-sm text-red-600 hover:underline">
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

          <SelectBlock
            id="nivel"
            label="Nivel"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            options={[
              { value: "", label: "Selecciona un nivel" },
              { value: "junior", label: "Junior" },
              { value: "semi", label: "Semi-Senior" },
              { value: "senior", label: "Senior" }
            ]}
          />

          <InputBlock id="experiencia" label="Años de experiencia" placeholder={placeholderExperiencia} />
          <InputBlock id="fecha" label="Fecha" value={fechaActual} readOnly extraClass="bg-blue-50 text-blue-700 cursor-not-allowed" />

          <div className="text-center pt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-xl transition-transform transform hover:scale-105">
              Enviar entrevista
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

function InputBlock({ id, label, placeholder = "", value, readOnly = false, extraClass = "" }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold mb-1">
        {label}
      </label>
      <input
        type="text"
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        readOnly={readOnly}
        className={`w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${extraClass}`}
      />
    </div>
  );
}

function SelectBlock({ id, label, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold mb-1">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}