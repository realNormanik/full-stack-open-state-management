# Full Stack Open - State Management: Query Anecdotes

This project is a new version of the "Anecdotes" application from Part 1 of the Full Stack Open course, rebuilt for the [State Management](https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-state-management) part using [TanStack Query](https://tanstack.com/query/latest). The application lets users vote for anecdotes and add new ones. The data is stored in a JSON Server backend and fetched with the Fetch API, the server state is managed by TanStack Query, the notification state lives in the Context API, and the interface is styled with Tailwind CSS v4 with light and dark themes.

## 🗂️ Project Structure

The Query Anecdotes application itself lives inside the `query-anecdotes` folder:

```
query-anecdotes/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── AnecdoteForm.jsx
│   │   └── Notification.jsx
│   ├── hooks/
│   │   └── useAnecdotes.js
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── NotificationContext.jsx
│   └── requests.js
├── .gitignore
├── db.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── server.js
└── vite.config.js
```

All course materials for the Query Anecdotes exercises **19.** to **27.** are located inside the `query-anecdotes` and `query-anecdote-tests` folders.

## ✅ Exercises Overview

During the development of the project in the State Management part, the following tasks were performed.

### 19: Query Anecdotes, step 1

- Used the project in the `query-anecdotes` directory as the base of the solution. It has a ready-installed JSON Server with a slightly modified `server.js`, started with `npm run server` and available at `http://localhost:3001/anecdotes`.
- Implemented retrieving the anecdotes from the server with TanStack Query (`useQuery`, query key `['anecdotes']`) and the Fetch API. The requests live in the `requests.js` module.
- When there are problems communicating with the server, only an error page is displayed. The query is retried only once (`retry: 1`), so the error appears quickly after the JSON Server is turned off.

### 20: Query Anecdotes, step 2

- Added creating new anecdotes with a `POST` request and the `useMutation` hook.
- After a successful request the `['anecdotes']` query is invalidated, so the new anecdote is rendered by default without reloading the page.
- The form stays uncontrolled: the value is read from the form element on submit and the form is reset afterwards.

### 21: Query Anecdotes, step 3

- Implemented voting with a `PUT` request and `useMutation`. The vote sends the anecdote with the number of votes increased by one.
- After a successful request the `['anecdotes']` query is invalidated, so the increased number of votes is rendered automatically.

### 22: Query Anecdotes, step 4

- Extracted the TanStack Query details into custom hooks in `hooks/useAnecdotes.js`: `useAnecdotes` (the query), `useCreateAnecdote` and `useVoteAnecdote` (the mutations).
- The components no longer import anything from `@tanstack/react-query`: `App` uses `useAnecdotes` and `useVoteAnecdote`, and `AnecdoteForm` uses `useCreateAnecdote`.

### 23: Query Anecdotes, checkup

- Ran the Playwright tests from the `query-anecdote-tests` folder against the application and made sure they pass locally:

```bash
cd query-anecdote-tests
npm install
npx playwright install chromium
npm run test:anecdotes
```

- Enabled the GitHub Actions workflow `.github/workflows/anecdotes-tests1.yaml` so that the tests run on every push to `main`:

```yaml
name: Query anecdotes tests 1
on:
  push:
    branches: [main]
```

### 24: Query anecdotes, step 5

- The notification state is managed with the Context API and `useReducer`. The `Notification` component shows a message for five seconds after voting for an anecdote or creating a new one.
- A new notification clears the timer of the previous one, so every message gets its full time.

### 25: Query anecdotes, step 6

- Implemented error handling for adding anecdotes. The server rejects an anecdote shorter than five characters, so `createAnecdote` reads the error message from the response and throws it.
- The error is handled in the `onError` callback registered in `useCreateAnecdote`, which shows the message from the server as a notification.

### 26: Query anecdotes, step 7

- Moved the notification context into its own file `NotificationContext.jsx`, in the same way as the counter application's context was moved to `CounterContext.jsx` in the material.
- Created the `useNotify` custom hook that encapsulates the notification logic (setting the message and clearing it after five seconds), and the `useNotificationValue` hook for reading the message.
- `useContext` is used only inside `NotificationContext.jsx`: the `Notification` component calls `useNotificationValue`, and the query hooks call `useNotify` directly.

### 27: Query anecdotes, final check

- Ran the notification tests in `query-anecdote-tests`:

```bash
cd query-anecdote-tests
npm run test:notifications
```

- Enabled the second GitHub Actions workflow in the same way as the first one (`branches: [main]`) and pushed the code to GitHub so that all the workflows run:

```yaml
name: Query anecdotes tests 2
on:
  push:
    branches: [main]
```

**Example requests and hooks (simplified):**

```js
// requests.js
const baseUrl = "http://localhost:3001/anecdotes";

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch anecdotes");
  };

  return await response.json();
};

export const createAnecdote = async (newAnecdote) => {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAnecdote),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to create anecdote");
  };

  return await response.json();
};
```

```js
// hooks/useAnecdotes.js
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
      notify(`anecdote '${newAnecdote.content}' created`);
    },
    onError: (error) => {
      notify(error.message);
    },
  });
};
```

**Example component logic (simplified):**

```jsx
const App = () => {
  const result = useAnecdotes();
  const handleVote = useVoteAnecdote();

  if (result.isPending) {
    return <div>Loading data...</div>;
  };

  if (result.isError) {
    return <div>Anecdote service not available</div>;
  }

  return (
    <ol>
      {result.data.map((anecdote) => (
        <li key={anecdote.id}>
          <p>{anecdote.content}</p>
          <span>has {anecdote.votes}</span>
          <button onClick={() => handleVote(anecdote)}>vote</button>
        </li>
      ))}
    </ol>
  );
};
```

## 💻 Installation and Running

Follow these steps to run the project locally:

1. Clone the repository:

```bash
git clone https://github.com/realNormanik/full-stack-open-state-management.git
```

2. Navigate to the application directory:

```bash
cd full-stack-open-state-management/query-anecdotes
```

3. Install the dependencies:

```bash
npm install
```

4. Start the JSON Server backend (it serves `db.json` at [http://localhost:3001/anecdotes](http://localhost:3001/anecdotes)):

```bash
npm run server
```

5. In a second terminal, start the development server:

```bash
npm run dev
```

The application is available at [http://localhost:5173](http://localhost:5173).

### Running the tests

The Playwright tests are located in the `query-anecdote-tests` folder:

```bash
cd query-anecdote-tests
npm install
npx playwright install chromium
npm run test:anecdotes
npm run test:notifications
```

## 🚀 Demo

You can view a working version of the project here:
👉 [Vercel]()

## 🧠 Notes

- TanStack Query keeps the server state, so the application has no reducers or stores for the anecdotes. After every successful mutation the `['anecdotes']` query is invalidated and the list is fetched again, so the interface shows what is really saved on the server.
- The TanStack Query details are hidden in custom hooks (`useAnecdotes`, `useCreateAnecdote`, `useVoteAnecdote`), so the components do not depend on the library directly.
- The query is retried only once (`retry: 1`). While the retry is running the query is in the `isPending` state, and after it fails the application shows only the error page.
- The notification state lives in the Context API with `useReducer`. The timer is kept in a `useRef`, so a new notification always clears the previous timer. `NotificationContext.jsx` exports the provider and the `useNotificationValue` and `useNotify` hooks, so the components never call `useContext` themselves.
- Failed `POST` requests are handled in the `onError` callback of the mutation. The message returned by the server is shown to the user as a notification.
- The `Notification` component keeps `data-testid="notification"`, which the Playwright tests use to find the message.
- Styles are kept in `src/index.css`: design tokens in `@theme`, the dark theme via `prefers-color-scheme`, element styles in `@layer base` and reusable classes as `@utility`. The fonts are Newsreader and Instrument Sans, loaded in `index.html`.
- Avoid committing the `node_modules` directory.