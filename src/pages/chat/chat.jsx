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

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col font-sans text-blue-900">
      <Header />
      <main className="flex-1">
        {fase === "form" ? (
          <ChatCandidateForm
            onSubmit={(datos) => iniciarChat(datos, setCandidato, setFase)}
          />
        ) : (
          <ChatView
            candidato={candidato}
            messages={mensajes}
            onSend={(mensaje) => manejarEnvioMensaje(mensaje, mensajes, setMensajes)}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}