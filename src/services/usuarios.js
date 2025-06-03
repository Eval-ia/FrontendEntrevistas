const API_BASE = "http://localhost:8080/api/usuarios";
const IA_API_BASE = "http://localhost:8000/api";

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

// export const buscarCandidatos = async ({ descripcion, tecnologia }) => {
//   const res = await fetch(`${IA_API_BASE}/buscar_similares`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ puesto: tecnologia, descripcion: descripcion }),
//   });

//   const candidatos = await res.json();
//   console.log("Respuesta del servidor:", candidatos);

//   console.log("Respuesta del servidor:", candidatos);

//   const ids = candidatos.map(c => Number(c.candidato_id));
//   console.log("IDs de candidatos:", ids);

//   const respuesta = await fetch(`${API_BASE}/candidatos`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(ids),
//   });

//   if (!respuesta.ok) throw new Error("Error al obtener usuarios");

//   const usuarios = await respuesta.json();
//   console.log("Usuarios encontrados:", usuarios);

//   // Crear un mapa para acceder rápidamente por ID
//   // const usuariosMap = new Map(usuarios.map(u => [u.id, u]));

//   // Devolverlos en el mismo orden de `candidatos`
//   // const usuariosOrdenados = candidatos.map(c => usuariosMap.get(Number(c.candidato_id)));

//   // console.log("Usuarios reordenados:", usuariosOrdenados);
//   const fusionados = candidatos.map(c => {
//     const u = usuarios[c.candidato_id] || {};
//     return {
//       ...c,
//       // renombra o anida los campos de usuario:
//       nombre: u.nombre,
//       email: u.email,
//       rol: u.rol,
//       fortalezas: u.fortalezas,
//       // …cualquier otro campo que necesites
//     };
//   });
//   console.log(fusionados);

//   return fusionados;
// };


export const buscarCandidatos = async ({ descripcion, tecnologia }) => {
  // 1) Buscas candidatos en la IA
  const res = await fetch(`${IA_API_BASE}/buscar_similares`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ puesto: tecnologia, descripcion }),
  });
  const candidatos = await res.json();
  console.log("Respuesta del servidor (candidatos):", candidatos);

  // 2) Extraes los ids y pides la info de usuarios
  const ids = candidatos.map(c => Number(c.candidato_id));
  const respuesta = await fetch(`${API_BASE}/candidatos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ids),
  });
  if (!respuesta.ok) throw new Error("Error al obtener usuarios");
  const usuarios = await respuesta.json();
  console.log("Usuarios encontrados:", usuarios);

  // 3) Construyes un "mapa" de usuarios: idUsuario → objeto usuario
  const usuariosMap = usuarios.reduce((map, u) => {
    // ojo: la propiedad se llama idUsuario en tu payload
    map[u.idUsuario] = u;
    return map;
  }, {});

  // 4) Recorres candidatos y haces el merge por id
  const fusionados = candidatos.map(c => {
    // convierto candidato_id a número para que coincida con idUsuario
    const u = usuariosMap[Number(c.candidato_id)] || {};
    return {
      ...c,
      ...u

      
    };
  });

  console.log("Array fusionado:", fusionados);
  return fusionados;
};
