import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePreguntasStore = create(
  persist(
    (set) => ({
      preguntasGenericas: [],
      preguntasPuesto: [],
      preguntasPersonalizadas: [],
      setPreguntasGenericas: (pregs) => set({ preguntasGenericas: pregs }),
      setPreguntasPuesto: (pregs) => set({ preguntasPuesto: pregs }),
      setPreguntasPersonalizadas: (pregs) =>
        set({ preguntasPersonalizadas: pregs }),
      limpiarPreguntas: () =>
        set({
          preguntasGenericas: [],
          preguntasPuesto: [],
          preguntasPersonalizadas: [],
        }),
    }),
    {
      name: "preguntas-storage",
      partialize: (state) => ({
        preguntasGenericas: state.preguntasGenericas,
        preguntasPuesto: state.preguntasPuesto,
        preguntasPersonalizadas: state.preguntasPersonalizadas
      })
    }
  )
);
