import { useEffect } from "react";

import { useAnecdotes, useAnecdoteActions } from "./store";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Filter from "./components/Filter";
import Notification from "./components/Notification";

const App = () => {
  const { initialize } = useAnecdoteActions();
  const anecdotes = useAnecdotes();
  const totalVotes = anecdotes.reduce((sum, anecdote) => sum + anecdote.votes, 0);

  useEffect(() => {
    initialize().catch((error) => console.error(error));
  }, [initialize]);

  return (
    <main>
      <header className="topbar">
        <div className="brand">
          <span className="logo" aria-hidden="true">
            <svg
              viewBox="0 0 20 20"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4.5h12v8H9.5L6 16v-3.5H4z" />
            </svg>
          </span>
          <h1>Anecdotes</h1>
        </div>
        <p className="m-0 flex gap-2">
          <span className="pill">
            {anecdotes.length} {anecdotes.length === 1 ? "entry" : "entries"}
          </span>
          <span className="pill">
            {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
          </span>
        </p>
      </header>

      <AnecdoteForm />
      <Filter />
      <AnecdoteList />
      <Notification />
    </main>
  );
};

export default App;
