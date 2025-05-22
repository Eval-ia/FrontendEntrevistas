const API_BASE = "http://localhost:8080/api/respuestas";

export async function guardarRespuestas(respuestas, entrevistaId) {
   const payload = respuestas.map((r) => {
    const base = {
      entrevistaId: entrevistaId,
      textoRespuesta: r.value,
    };
    if (r.tipo === "personalizada") {
      base.idPreguntaPersonalizada = r.id;
    } else {
      base.idPregunta = r.id;
    }
    return base;
  });

  const resp = await fetch(`${API_BASE}/guardar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) throw new Error("Error al guardar respuestas");
  return true;
}
