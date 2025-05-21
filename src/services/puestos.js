const API_BASE = "http://localhost:8080/api/puestos";
const IA_API_BASE = "http://192.168.50.129";

export const iniciarChat = async ({ descripcion, tecnologia }, setCandidato, setFase) => {
  const res = await fetch(`${IA_API_BASE}/buscar_similares`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ puesto: tecnologia, descripcion: descripcion }),
  });

  const candidato = await res.json();
  console.log("Respuesta del servidor:", candidato);
  
  setCandidato(candidato);
  setFase("chat");
};

export const buscarPuestoPorCategoriaYNivel = async (categoria, nivel) => {
  const res = await fetch(`${API_BASE}/buscar?categoria=${encodeURIComponent(categoria)}&nivel=${encodeURIComponent(nivel)}`);
  if (!res.ok) throw new Error("No se encontró el puesto");
  return await res.json();
};