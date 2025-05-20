import { Routes, Route } from 'react-router-dom';
import EntrevistaForm from './pages/entrevista/entrevista';
import Preguntas from './pages/preguntas/preguntas';
import Respuestas from './pages/respuestas/respuestas';
import ChatPage from './pages/chat/chat';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route path="/entrevista" element={<EntrevistaForm />} />
      <Route path="/preguntas" element={<Preguntas />} />
      <Route path="/respuestas" element={<Respuestas />} />
    </Routes>
  );
}

export default App;
