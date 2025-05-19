import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useEntrevistaStore = create(
  persist(
    (set) => ({
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
    }),
    {
      name: "entrevista-storage", // <--- Nombre clave para localStorage
      partialize: (state) => ({ entrevista: state.entrevista }) // Solo guarda el objeto entrevista
    }
  )
);
