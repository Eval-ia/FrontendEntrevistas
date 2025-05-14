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
  const [tecnologiaSeleccionada, setTecnologiaSeleccionada] = useState(null);
  const [nivel, setNivel] = useState("");
  const [placeholderExperiencia, setPlaceholderExperiencia] = useState("");

  const [nombreEntrevistador, setNombreEntrevistador] = useState("");
  const [nombreCandidato, setNombreCandidato] = useState("");
  const [aniosExperiencia, setAniosExperiencia] = useState("");

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

  const seleccionarTecnologia = (nombre) => {
    setTecnologiaSeleccionada((prev) => (prev === nombre ? null : nombre));
  };

  const deseleccionarTodo = () => setTecnologiaSeleccionada(null);

  const estaFormularioCompleto = () => {
    return (
      nombreEntrevistador.trim() !== "" &&
      nombreCandidato.trim() !== "" &&
      nivel !== "" &&
      aniosExperiencia.trim() !== "" &&
      tecnologiaSeleccionada !== null
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datos = {
      nombreEntrevistador,
      nombreCandidato,
      nivel,
      aniosExperiencia: parseInt(aniosExperiencia),
      fecha: fechaActual,
      tecnologias: tecnologiaSeleccionada ? [tecnologiaSeleccionada] : []
    };

    try {
      const response = await fetch("http://localhost:8080/api/entrevistas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });

      if (!response.ok) {
        throw new Error("Error al guardar la entrevista");
      }

      const resultado = await response.json();
      console.log("✅ Entrevista guardada:", resultado);
      navigate("/preguntas");
    } catch (error) {
      console.error("❌ Error al enviar los datos:", error);
      alert("No se pudo guardar la entrevista");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col font-sans text-blue-900">
      <Header />
      <main className="w-full max-w-4xl mx-auto mt-12 p-10 rounded-3xl shadow-2xl backdrop-blur-md bg-white/70 border border-blue-200">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-10 tracking-tight">Entrevista Técnica</h2>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <InputBlock id="nombreentrevistador" label="Nombre del entrevistador" value={nombreEntrevistador} onChange={e => setNombreEntrevistador(e.target.value)} />
          <InputBlock id="nombrecandidato" label="Nombre del candidato" value={nombreCandidato} onChange={e => setNombreCandidato(e.target.value)} />

          <div>
            <label className="block text-sm font-semibold mb-2">Tecnologías</label>
            <div className="grid sm:grid-cols-2 gap-6 max-h-80 overflow-y-auto p-4 bg-white/60 rounded-xl border border-blue-300">
              {Object.entries(tecnologias).map(([categoria, items]) => (
                <div key={categoria}>
                  <p className="font-medium mb-2">{categoria}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((nombre) => {
                      const estaSeleccionada = tecnologiaSeleccionada === nombre;
                      const hayUnaSeleccionada = tecnologiaSeleccionada !== null;
                      return (
                        <button
                          key={nombre}
                          type="button"
                          onClick={() => seleccionarTecnologia(nombre)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border transition shadow-sm ${
                            estaSeleccionada
                              ? "bg-blue-600 text-white border-blue-600"
                              : hayUnaSeleccionada
                              ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                              : "bg-white text-blue-700 border-blue-300 hover:bg-blue-100"
                          }`}
                          disabled={hayUnaSeleccionada && !estaSeleccionada}
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

          {tecnologiaSeleccionada && (
            <div className="bg-white/60 p-4 rounded-xl border border-blue-200 shadow">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-semibold">Tecnología seleccionada:</p>
                <button type="button" onClick={deseleccionarTodo} className="text-sm text-red-600 hover:underline">
                  Deseleccionar
                </button>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {tecnologiaSeleccionada}
              </span>
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

          <InputBlock
            id="experiencia"
            label="Años de experiencia"
            placeholder={placeholderExperiencia}
            value={aniosExperiencia}
            onChange={(e) => setAniosExperiencia(e.target.value)}
          />

          <InputBlock
            id="fecha"
            label="Fecha"
            value={fechaActual}
            readOnly
            extraClass="bg-blue-50 text-blue-700 cursor-not-allowed"
          />

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={!estaFormularioCompleto()}
              className={`text-lg font-semibold px-8 py-3 rounded-xl shadow-xl transition-transform transform ${
                estaFormularioCompleto()
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Siguiente
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

// Reutilizables
function InputBlock({ id, label, value, onChange, placeholder = "", readOnly = false, extraClass = "" }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold mb-1">{label}</label>
      <input
        type="text"
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${extraClass}`}
      />
    </div>
  );
}

function SelectBlock({ id, label, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold mb-1">{label}</label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
