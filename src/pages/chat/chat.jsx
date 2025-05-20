import React, { useState } from "react";
import ChatCandidateForm from "../../components/chat/ChatCandidateForm";
import ChatView from "../../components/chat/ChatView";
import Header from "../../components/general/Header";
import Footer from "../../components/general/Footer";

export default function ChatPage() {
  const [fase, setFase] = useState("form"); // "form" | "chat"
  const [candidato, setCandidato] = useState(null);
  const [mensajes, setMensajes] = useState([]);

  const iniciarChat = async ({ puesto, descripcion, tecnologia }) => {
    // Enviar JSON al backend para encontrar un candidato
    const res = await fetch("/api/chat/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ puesto, descripcion, tecnologia })
    });
    const candidato = await res.json();
    setCandidato(candidato);
    setFase("chat");
  };

  const manejarEnvioMensaje = (texto) => {
    setMensajes((prev) => [...prev, { emisor: "yo", texto }]);
    // Opcional: respuesta automática simulada
    setTimeout(() => {
      setMensajes((prev) => [...prev, { emisor: "candidato", texto: "Gracias por tu mensaje." }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col font-sans text-blue-900">
      <Header />
      <main className="flex-1">
        {fase === "form" ? (
          <ChatCandidateForm onSubmit={iniciarChat} />
        ) : (
          <ChatView candidato={candidato} messages={mensajes} onSend={manejarEnvioMensaje} />
        )}
      </main>
      <Footer />
    </div>
  );
}