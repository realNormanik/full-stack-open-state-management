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
        <button className="create">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            fill="currentColor"
            width="15"
            height="15"
          >
            <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z" />
          </svg>
          create
        </button>
      </form>
    </section>
  );
};

export default AnecdoteForm;
