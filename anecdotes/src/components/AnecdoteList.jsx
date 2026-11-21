import { useAnecdotes, useAnecdoteActions, useFilter } from "../store";
import { useNotificationActions } from "../notificationStore";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const filter = useFilter();
  const sortedAnecdotes = anecdotes
    .filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
    .toSorted((a, b) => b.votes - a.votes);
  const { vote, remove } = useAnecdoteActions();
  const { setNotification } = useNotificationActions();

  const handleVote = async (anecdote) => {
    try {
      await vote(anecdote.id);
      setNotification(`you voted '${anecdote.content}'`, 5);
    } catch (error) {
      console.error(error);
    };
  };

  const handleRemove = async (anecdote) => {
    try {
      await remove(anecdote.id);
    } catch (error) {
      console.error(error);
    };
  };

  return (
    <div>
      <ul className="feed">
        {sortedAnecdotes.map((anecdote) => (
          <li className="entry" key={anecdote.id}>
            <div className="rail">
              <button
                className="vote"
                title="Vote for this anecdote"
                onClick={() => handleVote(anecdote)}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 16V4M5 9l5-5 5 5" />
                </svg>
                <span className="sr-only">vote</span>
              </button>
              <span className="tally">has {anecdote.votes}</span>
            </div>
            <p className="quote">{anecdote.content}</p>
            {anecdote.votes === 0 && (
              <div className="meta">
                <button className="remove" onClick={() => handleRemove(anecdote)}>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" />
                  </svg>
                  delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {anecdotes.length > 0 && sortedAnecdotes.length === 0 && (
        <p className="empty">No anecdote matches your filter.</p>
      )}
    </div>
  );
};

export default AnecdoteList;
