import { Routes, Route } from 'react-router-dom';
import EntrevistaForm from './pages/entrevista/entrevista';
import Preguntas from './pages/preguntas/preguntas'; // Asegúrate de tener este archivo

function App() {
  return (
    <Routes>
      <Route path="/" element={<EntrevistaForm />} />
      <Route path="/preguntas" element={<Preguntas />} />
    </Routes>
  );
}

export default App;
