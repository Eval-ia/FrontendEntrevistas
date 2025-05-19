import { create } from 'zustand';

export const useEntrevistaStore = create((set) => ({
  entrevista: {
    idEntrevistador: null,
    idCandidato: null,
    idPuesto: null,
    respuestas: []
  },
  setDatosBasicos: (datos) =>
    set((state) => ({
      entrevista: {
        ...state.entrevista,
        ...datos
      }
    })),
  agregarRespuesta: (respuesta) =>
    set((state) => ({
      entrevista: {
        ...state.entrevista,
        respuestas: [...state.entrevista.respuestas, respuesta]
      }
    })),
  limpiarEntrevista: () =>
    set({
      entrevista: {
        idEntrevistador: null,
        idCandidato: null,
        idPuesto: null,
        respuestas: []
      }
    })
}));
