import { useState } from "react";
import ChatCandidateForm from "../../components/chat/ChatCandidateForm";
import ChatView from "../../components/chat/ChatView";
import Header from "../../components/general/Header";
import Footer from "../../components/general/Footer";
import { manejarEnvioMensaje } from "../../utils/chat";
import { iniciarChat } from "../../services/puestos";

export default function ChatPage() {
  const [fase, setFase] = useState("form");
  const [candidato, setCandidato] = useState(null);
  const [mensajes, setMensajes] = useState([]);

  const iniciar = async (datos) => {
    // Añadir la descripción como mensaje del usuario
    setMensajes([{ emisor: "yo", texto: datos.descripcion }]);

    // Llamar al backend para obtener candidato
    const candidato = await iniciarChat(datos);
    setCandidato(candidato);

    // Simular respuesta inicial del sistema
    setMensajes((prev) => [
      ...prev,
      {
        emisor: "sistema",
        texto: `He encontrado un candidato que podría encajar. ¿Quieres hablar con él?`
      }
    ]);

    setFase("chat");
  };

  const enviarMensaje = (texto) => {
    setMensajes((prev) => [...prev, { emisor: "yo", texto }]);
    setTimeout(() => {
      setMensajes((prev) => [
        ...prev,
        { emisor: "candidato", texto: "Gracias por tu mensaje, estaré encantado de responder." }
      ]);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col font-sans text-blue-900">
      <Header />
      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-2xl flex flex-col flex-1 px-4 pt-6 pb-2">
          {fase === "form" ? (
            <ChatCandidateForm onSubmit={iniciar} />
          ) : (
            <ChatView
              candidato={candidato}
              messages={mensajes}
              onSend={enviarMensaje}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}