const API_BASE = "http://localhost:8080/api/puestos";

export const buscarPuestoPorCategoriaYNivel = async (categoria, nivel) => {
  const res = await fetch(
    `${API_BASE}/buscar?categoria=${encodeURIComponent(
      categoria
    )}&nivel=${encodeURIComponent(nivel)}`
  );
  if (!res.ok) throw new Error("No se encontró el puesto");
  return await res.json();
};
