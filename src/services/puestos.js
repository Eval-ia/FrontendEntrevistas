const API_BASE = "http://localhost:8080/api/puestos";

export const iniciarChat = async ({ puesto, descripcion, tecnologia }, setCandidato, setFase) => {
  const res = await fetch(`${API_BASE}/buscar`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ puesto, descripcion, tecnologia })
  });

  const candidato = await res.json();
  setCandidato(candidato);
  setFase("chat");
};