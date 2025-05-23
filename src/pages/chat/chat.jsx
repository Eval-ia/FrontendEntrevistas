import { useState } from "react";
import ChatCandidateForm from "../../components/chat/ChatCandidateForm";
import CandidateList from "../../components/chat/CandidateList";
import Header from "../../components/general/Header";
import Footer from "../../components/general/Footer";
import { buscarCandidatos } from "../../services/usuarios";

export default function ChatPage() {
  const [fase, setFase] = useState("form");
  const [candidatos, setCandidatos] = useState([]);
  const [mensajeSistema, setMensajeSistema] = useState("");

  const iniciar = async (datos) => {
    setMensajeSistema(`Buscando candidatos para: "${datos.descripcion}"...`);

    const lista = await buscarCandidatos(datos);
    setCandidatos(lista);
    console.log("Candidatos encontrados:", lista);

    setMensajeSistema(`Estos son los mejores candidatos para el puesto descrito.`);
    setFase("resultados");
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col font-sans text-blue-900">
      <Header />
      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col flex-1 px-4 pt-6 pb-2">
          {fase === "form" && <ChatCandidateForm onSubmit={iniciar} />}

          {fase === "resultados" && (
            <>
              <div className="mb-6 text-center">
                <p className="text-sm italic text-gray-600">{mensajeSistema}</p>
              </div>
              <CandidateList candidatos={candidatos} />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}