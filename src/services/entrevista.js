const API_BASE = 'http://localhost:8080/api/entrevistas';
import { useEntrevistaStore } from "../stores/entrevistaStore";
export const pingBackend = async () => {
  const res = await fetch(`${API_BASE}/ping`);
  if (!res.ok) throw new Error("No se pudo conectar con el backend");
  return await res.text();
};

export const obtenerCategorias = async () => {
  const res = await fetch(`${API_BASE}/categorias`);
  if (!res.ok) throw new Error("Error al obtener categorías");
  return await res.json();
};

export const finalizarEntrevista = async () => {
  const { entrevista } = useEntrevistaStore.getState();

  const dto = {
    idEntrevistador: entrevista.idEntrevistador,
    idCandidato: entrevista.idCandidato,
    idPuesto: entrevista.idPuesto,
    preguntasPersonalizadas: entrevista.respuestas
      .filter(r => r.tipo === "personalizada")
      .map(r => ({
        texto: r.label
      })),
    respuestas: entrevista.respuestas.map(r => ({
      idPregunta: r.tipo !== "personalizada" ? r.id : null,
      textoPreguntaPersonalizada: r.tipo === "personalizada" ? r.label : null,
      respuesta: r.value
    }))
  };
  console.log(dto);
  

  const res = await fetch(`${API_BASE}/finalizar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  });

  if (!res.ok) throw new Error("Error al finalizar entrevista");
  return await res.text(); // Devuelve mensaje del backend
};

