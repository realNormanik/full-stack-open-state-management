import { useAnecdoteActions } from "../store";
import { useNotificationActions } from "../notificationStore";

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions();
  const { setNotification } = useNotificationActions();

  const addAnecdote = async (event) => {
    event.preventDefault();
    const form = event.target;
    const content = form.anecdote.value.trim();
    if (!content) return;

    try {
      await add(content);
      setNotification(`you created '${content}'`, 5);
      form.reset();
    } catch (error) {
      console.error(error);
    };
  };

  return (
    <section className="panel">
      <h2>Create new</h2>
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={addAnecdote}>
        <input
          className="field sm:flex-1"
          name="anecdote"
          aria-label="Text of the new anecdote"
          placeholder="Write something worth remembering"
          autoComplete="off"
          data-testid="new"
        />
        <button className="create">create</button>
      </form>
    </section>
  );
};

export default AnecdoteForm;
