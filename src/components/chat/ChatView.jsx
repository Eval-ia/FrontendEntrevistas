import { useState } from "react";
import { useEffect } from "react";

export default function ChatView({ candidato, messages = [], onSend }) {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const chatBox = document.getElementById("chat-box");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);

  const enviarMensaje = () => {
    if (!mensaje.trim()) return;
    onSend(mensaje);
    setMensaje("");
  };

  return (
    <div className="flex flex-col h-full border rounded-2xl bg-white shadow-lg overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto space-y-3" id="chat-box">
        {messages.map((m, i) => {
          const baseClasses = "px-4 py-2 rounded-lg inline-block max-w-xs break-words";
          let bg, align, text;

          switch (m.emisor) {
            case "yo":
              bg = "bg-blue-100 text-blue-900";
              align = "self-end text-right";
              break;
            case "candidato":
              bg = "bg-green-100 text-green-900";
              align = "self-start text-left";
              break;
            case "sistema":
              bg = "bg-gray-200 text-gray-800 italic";
              align = "self-center text-center";
              break;
            default:
              bg = "bg-gray-100 text-gray-800";
              align = "self-start";
          }

          return (
            <div key={i} className={`flex ${align}`}>
              <div className={`${baseClasses} ${bg}`}>{m.texto}</div>
            </div>
          );
        })}
      </div>

      <div className="flex p-4 border-t bg-white">
        <input
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
          placeholder="Escribe tu mensaje..."
          className="flex-1 border border-blue-300 rounded-xl px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={enviarMensaje}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}