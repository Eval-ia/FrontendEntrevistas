import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useEntrevistaStore = create(
  persist(
    (set) => ({
      entrevista: {
        idEntrevistador: null,
        idCandidato: null,
        idPuesto: null,
        respuestas: [],
      },

      setDatosBasicos: (datos) =>
        set((state) => ({
          entrevista: {
            ...state.entrevista,
            ...datos,
          },
        })),

      agregarRespuesta: (nueva) =>
        set((state) => {
          const yaExiste = state.entrevista.respuestas.find(
            (r) => r.id === nueva.id
          );
          if (yaExiste) {
            return {
              entrevista: {
                ...state.entrevista,
                respuestas: state.entrevista.respuestas.map((r) =>
                  r.id === nueva.id ? nueva : r
                ),
              },
            };
          }
          return {
            entrevista: {
              ...state.entrevista,
              respuestas: [...state.entrevista.respuestas, nueva],
            },
          };
        }),

      // ✅ NUEVO: sobrescribe todas las respuestas a la vez
      setRespuestas: (respuestas) =>
        set((state) => ({
          entrevista: {
            ...state.entrevista,
            respuestas,
          },
        })),

      limpiarEntrevista: () =>
        set({
          entrevista: {
            idEntrevistador: null,
            idCandidato: null,
            idPuesto: null,
            respuestas: [],
          },
        }),

      resetEntrevistaTotal: () => {
        set({
          entrevista: {
            idEntrevistador: null,
            idCandidato: null,
            idPuesto: null,
            respuestas: [],
          },
        });
        localStorage.removeItem("entrevista-storage");
      },
    }),
    {
      name: "entrevista-storage",
      partialize: (state) => ({ entrevista: state.entrevista }),
    }
  )
);
