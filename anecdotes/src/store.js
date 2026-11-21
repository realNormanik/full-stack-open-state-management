
import { create } from "zustand";

import { getAll, createNew, update, remove } from "./services/anecdotes";

export const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: "",
  actions: {
    initialize: async () => {
      const anecdotes = await getAll();
      set({ anecdotes });
    },
    setFilter: (filter) => set({ filter }),
    add: async (content) => {
      const newAnecdote = await createNew(content);
      set((state) => ({
        anecdotes: state.anecdotes.concat(newAnecdote),
      }));
    },
    vote: async (id) => {
      const anecdote = useAnecdoteStore
        .getState()
        .anecdotes.find((a) => a.id === id);
      if (!anecdote) return;

      const updated = await update({ ...anecdote, votes: anecdote.votes + 1 });
      set((state) => ({
        anecdotes: state.anecdotes.map((a) => (a.id === id ? updated : a)),
      }));
    },
    remove: async (id) => {
      const anecdote = useAnecdoteStore
        .getState()
        .anecdotes.find((a) => a.id === id);
      if (!anecdote || anecdote.votes !== 0) return;

      await remove(id);
      set((state) => ({
        anecdotes: state.anecdotes.filter((a) => a.id !== id),
      }));
    },
  },
}));

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes);
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions);
export const useFilter = () => useAnecdoteStore((state) => state.filter);
