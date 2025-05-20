export const manejarEnvioMensaje = (mensaje, mensajes, setMensajes) => {
  setMensajes([...mensajes, { emisor: "yo", texto: mensaje }]);

  setTimeout(() => {
    setMensajes((prev) => [...prev, { emisor: "candidato", texto: "Gracias por tu mensaje." }]);
  }, 800);
};