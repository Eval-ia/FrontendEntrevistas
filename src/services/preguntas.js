// services/preguntas.js

export async function getPreguntasGenericas() {
  const resp = await fetch("http://localhost:8080/api/preguntas/genericas");
  if (!resp.ok) throw new Error("Error al cargar preguntas genéricas");
  return resp.json();
}

export async function getPreguntasPuesto(puestoId) {
  const resp = await fetch(`http://localhost:8080/api/preguntas/puesto/${puestoId}`);
  if (!resp.ok) throw new Error("Error al cargar preguntas del puesto");
  return resp.json();
}

export async function getPreguntasPersonalizadas(entrevistaId) {
  const resp = await fetch(`http://localhost:8080/api/preguntas/personalizada/${entrevistaId}`);
  if (!resp.ok) throw new Error("Error al cargar preguntas personalizadas");
  return resp.json();
}

export async function crearPreguntaPersonalizada(texto, entrevistaId) {
  const resp = await fetch("http://localhost:8080/api/preguntas/personalizada", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto, entrevistaId })
  });
  if (!resp.ok) throw new Error("Error al crear pregunta personalizada");
  return resp.json();
}

export async function eliminarPreguntaPersonalizada(idPreguntaPersonalizada) {
  const resp = await fetch(`http://localhost:8080/api/preguntas/personalizada/${idPreguntaPersonalizada}`, {
    method: "DELETE"
  });
  if (!resp.ok) throw new Error("Error al eliminar pregunta personalizada");
}
