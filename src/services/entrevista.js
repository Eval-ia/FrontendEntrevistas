const API_BASE = 'http://localhost:8080/api/entrevistas';

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

export const finalizarEntrevista = async (entrevistaFinalizadaDTO) => {
  const res = await fetch(`${API_BASE}/finalizar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entrevistaFinalizadaDTO)
  });
  if (!res.ok) throw new Error("Error al finalizar entrevista");
  return await res.text(); // Devuelve mensaje del backend
};

