import { Routes, Route } from 'react-router-dom';
import EntrevistaForm from './pages/entrevista/entrevista';
import Preguntas from './pages/preguntas/preguntas';
import Respuestas from './pages/respuestas/respuestas';

function App() {
  return (
    <Routes>
      <Route path="/" element={<EntrevistaForm />} />
      <Route path="/preguntas" element={<Preguntas />} />
      <Route path="/respuestas" element={<Respuestas />} />
    </Routes>
  );
}

export default App;
