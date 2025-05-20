const API_BASE = 'http://localhost:8080/api/entrevistas';

export const obtenerCategoriasTecnologia = async () => {
  const res = await fetch(`${API_BASE}/categorias`);
  if (!res.ok) throw new Error("Error al obtener categorías tecnológicas");
  return await res.json();
};
