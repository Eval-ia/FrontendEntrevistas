import React, { useState } from "react";

export default function ChatView({ candidato, messages = [], onSend }) {
  const [mensaje, setMensaje] = useState("");

  const enviarMensaje = () => {
    if (!mensaje.trim()) return;
    onSend(mensaje);
    setMensaje("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto bg-white border-t">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-2 max-w-xl ${
              m.emisor === "yo" ? "ml-auto text-right" : "mr-auto text-left"
            }`}
          >
            <div className={`px-4 py-2 rounded-lg shadow ${m.emisor === "yo" ? "bg-blue-100" : "bg-gray-100"}`}>
              {m.texto}
            </div>
          </div>
        ))}
      </div>
      <div className="flex p-4 border-t">
        <input
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
          placeholder="Escribe tu mensaje..."
          className="flex-1 border border-blue-300 rounded-xl px-4 py-2 mr-2"
        />
        <button onClick={enviarMensaje} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
          Enviar
        </button>
      </div>
    </div>
  );
}