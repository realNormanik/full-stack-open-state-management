import { useAnecdoteActions } from "../store"
import { useNotificationActions } from "../notificationStore"

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const form = event.target
    const content = form.anecdote.value.trim()
    if (!content) return

    try {
      await add(content)
      setNotification(`you created '${content}'`, 5)
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" data-testid="new" />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
