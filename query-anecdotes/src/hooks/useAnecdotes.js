import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createAnecdote, getAnecdotes, updateAnecdote } from "../requests";
import { useNotify } from "../NotificationContext";

export const useAnecdotes = () =>
  useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
  });

export const useCreateAnecdote = () => {
  const queryClient = useQueryClient();
  const notify = useNotify();

  return useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      notify(`anecdote "${newAnecdote.content}" created`);
    },
    onError: (error) => {
      notify(error.message);
    },
  });
};

export const useVoteAnecdote = () => {
  const queryClient = useQueryClient();
  const notify = useNotify();

  const mutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (votedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      notify(`anecdote "${votedAnecdote.content}" voted`);
    },
  });

  return (anecdote) =>
    mutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
};
