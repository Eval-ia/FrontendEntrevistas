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

export const buscarCandidatos = async ({ descripcion, tecnologia }) => {
  // const res = await fetch(`${IA_API_BASE}/buscar_similares`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ puesto: tecnologia, descripcion: descripcion }),
  // });

  // const candidatos = await res.json();
  // console.log("Respuesta del servidor:", candidatos);
  const candidatos = [
    {
      candidato_id: "1",
      similitud: 0.6361,
      ranking: 1,
      puesto: "Desarrollador Java",
      cluster_id: 2,
      adjusted_score: 0.6699360609054565,
    },
    {
      candidato_id: "2",
      similitud: 0.5953,
      ranking: 2,
      puesto: "Desarrollador Java",
      cluster_id: 2,
      adjusted_score: 0.5500434637069702,
    },
    {
      candidato_id: "3",
      similitud: 0.5859,
      ranking: 3,
      puesto: "Desarrollador Java",
      cluster_id: 2,
      adjusted_score: 0.5500434637069702,
    },
    {
      candidato_id: "4",
      similitud: 0.5463,
      ranking: 4,
      puesto: "Desarrollador Java",
      cluster_id: 0,
      adjusted_score: 0.5500434637069702,
    },
    {
      candidato_id: "5",
      similitud: 0.5433,
      ranking: 5,
      puesto: "Desarrollador Full Stack",
      cluster_id: 0,
      adjusted_score: 0.5500434637069702,
    },
    {
      candidato_id: "6",
      similitud: 0.5278,
      ranking: 6,
      puesto: "Desarrollador Full Stack",
      cluster_id: 2,
      adjusted_score: 0.5500434637069702,
    },
    {
      candidato_id: "7",
      similitud: 0.4974,
      ranking: 7,
      puesto: "Desarrollador Full Stack",
      cluster_id: 1,
      adjusted_score: 0.4503045082092285,
    },
    {
      candidato_id: "8",
      similitud: 0.425,
      ranking: 8,
      puesto: "Especialista en Infraestructura",
      cluster_id: 1,
      adjusted_score: 0.4503045082092285,
    },
    {
      candidato_id: "9",
      similitud: 0.4149,
      ranking: 9,
      puesto: "Desarrollador Java",
      cluster_id: 2,
      adjusted_score: 0.4503045082092285,
    },
    {
      candidato_id: "10",
      similitud: 0.4051,
      ranking: 10,
      puesto: "Ingeniero de Datos",
      cluster_id: 1,
      adjusted_score: 0.4503045082092285,
    },
  ];
  console.log("Respuesta del servidor:", candidatos);

  const ids = candidatos.map(c => Number(c.candidato_id));
  console.log("IDs de candidatos:", ids);

  const res = await fetch(`${API_BASE}/candidatos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ids),
  });

  console.log("Respuesta de mi propio servidor:", res);

  if (!res.ok) throw new Error("Error al obtener usuarios");

  const usuarios = await res.json();
  console.log("Usuarios encontrados:", usuarios);

  // Devolver directamente los datos del backend (nombre, email, fortalezas, debilidades, etc.)
  return usuarios;
};
