const API_BASE = "http://localhost:8080/api/usuarios";

// Buscar usuario por nombre y rol
export const buscarUsuarioPorNombreYRol = async (nombre, rol) => {
  const res = await fetch(`${API_BASE}/buscar?nombre=${encodeURIComponent(nombre)}&rol=${encodeURIComponent(rol)}`);
  if (!res.ok) {
    if (res.status === 404) return null; // no encontrado
    throw new Error("Error al buscar usuario");
  }
  return await res.json();
};

// Crear un nuevo usuario
export const crearUsuario = async (nombre, rol) => {
  const res = await fetch(`${API_BASE}/crear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombre,
      rol
    })
  });
  if (!res.ok) throw new Error("Error al crear usuario");
  return await res.json();
};
