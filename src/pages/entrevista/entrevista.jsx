// Importaciones
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/general/Header";
import Footer from "../../components/general/Footer";

// Tecnologías agrupadas por categoría
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

  // Estados del formulario
  const [fechaActual, setFechaActual] = useState("");
  const [tecnologiaSeleccionada, setTecnologiaSeleccionada] = useState(null);
  const [nivel, setNivel] = useState("");
  const [placeholderExperiencia, setPlaceholderExperiencia] = useState("");

  const [nombreEntrevistador, setNombreEntrevistador] = useState("");
  const [nombreCandidato, setNombreCandidato] = useState("");
  const [aniosExperiencia, setAniosExperiencia] = useState("");

  // Establecer la fecha actual al cargar el componente
  useEffect(() => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    setFechaActual(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Cambiar placeholder según nivel seleccionado
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

  // Selección de tecnología (solo una a la vez)
  const seleccionarTecnologia = (nombre) => {
    setTecnologiaSeleccionada((prev) => (prev === nombre ? null : nombre));
  };

  // Desmarcar tecnología seleccionada
  const deseleccionarTodo = () => setTecnologiaSeleccionada(null);

  // Validar si el formulario está completo
  const estaFormularioCompleto = () => {
    return (
      nombreEntrevistador.trim() !== "" &&
      nombreCandidato.trim() !== "" &&
      nivel !== "" &&
      aniosExperiencia.trim() !== "" &&
      tecnologiaSeleccionada !== null
    );
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Crear usuarios (entrevistador y candidato)
      const usuariosRes = await fetch(
        `http://localhost:8080/api/usuarios/crear?entrevistador=${encodeURIComponent(nombreEntrevistador)}&candidato=${encodeURIComponent(nombreCandidato)}`,
        { method: "POST" }
      );
      if (!usuariosRes.ok) throw new Error("Error al guardar usuarios");
      const usuarios = await usuariosRes.json();
      const entrevistadorId = usuarios.find(u => u.rol === "ENTREVISTADOR")?.idUsuario;
      const candidatoId = usuarios.find(u => u.rol === "CANDIDATO")?.idUsuario;
      if (!entrevistadorId || !candidatoId) throw new Error("IDs no encontrados");

      // 2. Crear categoría si no existe
      const catRes = await fetch(
        `http://localhost:8080/api/categoria/guardar?nombre=${encodeURIComponent(tecnologiaSeleccionada)}`,
        { method: "POST" }
      );
      if (!catRes.ok) throw new Error("Error al guardar categoría");

      // 3. Crear nivel si no existe
      const nivelRes = await fetch(
        `http://localhost:8080/api/nivel/guardar?nombre=${encodeURIComponent(nivel)}`,
        { method: "POST" }
      );
      if (!nivelRes.ok) throw new Error("Error al guardar nivel");

      // 4. Crear o buscar puesto
      const puestoRes = await fetch("http://localhost:8080/api/puestos/crear-o-buscar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tecnologia: tecnologiaSeleccionada, nivel })
      });
      if (!puestoRes.ok) throw new Error("Error al crear o buscar puesto");
      const puestoId = await puestoRes.json();

      // 5. Crear entrevista con los datos anteriores
      const entrevistaRes = await fetch("http://localhost:8080/api/entrevistas/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entrevistador: { idUsuario: entrevistadorId },
          candidato: { idUsuario: candidatoId },
          puesto: { idPuesto: puestoId },
          fecha: fechaActual
        })
      });
      if (!entrevistaRes.ok) throw new Error("Error al crear la entrevista");

      const entrevista = await entrevistaRes.json();
      const entrevistaId = entrevista.idEntrevista;

      // Redirigir al siguiente paso con los datos relevantes
      navigate("/preguntas", {
        state: {
          puestoId,
          entrevistaId,
          idEntrevistador: entrevistadorId,
          idCandidato: candidatoId
        }
      });

    } catch (error) {
      console.error("Error al procesar la entrevista:", error.message || error);
      alert("Hubo un error al procesar los datos.");
    }
  };

  // Renderizado del formulario
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col font-sans text-blue-900">
      <Header />
      <main className="w-full max-w-4xl mx-auto mt-12 p-10 rounded-3xl shadow-2xl backdrop-blur-md bg-white/70 border border-blue-200">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-10 tracking-tight">Entrevista Técnica</h2>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <InputBlock id="nombreentrevistador" label="Nombre del entrevistador" value={nombreEntrevistador} onChange={e => setNombreEntrevistador(e.target.value)} />
          <InputBlock id="nombrecandidato" label="Nombre del candidato" value={nombreCandidato} onChange={e => setNombreCandidato(e.target.value)} />

          {/* Selección de tecnologías */}
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

          {/* Muestra la tecnología seleccionada */}
          {tecnologiaSeleccionada && (
            <div className="bg-white/60 p-4 rounded-xl border border-blue-200 shadow">
              <div className="flex justify-between mb-2 items-center">
                <p className="text-sm font-semibold">Tecnología seleccionada:</p>
                <button
                  type="button"
                  onClick={deseleccionarTodo}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Deseleccionar
                </button>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {tecnologiaSeleccionada}
              </span>
            </div>
          )}

          {/* Select para nivel y experiencia */}
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

          {/* Botón para continuar */}
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

// Componente reutilizable para inputs de texto
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

// Componente reutilizable para selects
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
