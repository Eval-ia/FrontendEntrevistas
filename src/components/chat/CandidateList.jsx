export default function CandidateList({ candidatos }) {
  return (
    <div className="space-y-4">
      {candidatos.map((candidato) => (
        <div
          key={candidato.id}
          className="bg-white p-6 rounded-xl shadow border border-blue-100 hover:shadow-md transition"
        >
          <div className="flex items-start gap-4">
            {/* Avatar inicial */}
            <div className="w-16 h-16 bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xl rounded-full">
              {candidato.nombre?.charAt(0) || "?"}
            </div>

            {/* Datos del usuario */}
            <div className="flex-1 space-y-1">
              <h3 className="text-lg font-bold text-blue-800">{candidato.nombre}</h3>
              <p className="text-sm text-gray-600">Correo de contacto: {candidato.email}</p>

              {candidato.fortalezas && (
                <p className="text-sm">
                  <span className="font-medium text-blue-700">Fortalezas:</span>{" "}
                  {candidato.fortalezas}
                </p>
              )}

              {candidato.debilidades && (
                <p className="text-sm">
                  <span className="font-medium text-red-600">Debilidades:</span>{" "}
                  {candidato.debilidades}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}