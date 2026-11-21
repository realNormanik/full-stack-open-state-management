# Full Stack Open - State Management: Unicafe Zustand

This project is a new version of the "Unicafe" application from Part 1 of the Full Stack Open course, rebuilt for the [State Management](https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-state-management) part using [Zustand](https://zustand.docs.pmnd.rs/). The application allows users to leave feedback (`good`, `neutral`, `bad`) and displays the corresponding statistics. All feedback data is managed centrally in a Zustand store, and the interface is styled with Tailwind CSS v4 with light and dark themes.

## 🗂️ Project Structure

The repository is organized following the structure required for Full Stack Open submissions. The root of the submission repository contains the contents of [fs-statemanagement](https://github.com/fullstack-hy2020/fs-statemanagement):

```
.git
.github/
.gitignore
unicafe/
unicafe-tests/
anecdotes/
anecdotes-tests/
query-anecdotes/
query-anecdotes-tests/
```

The Unicafe application itself lives inside the `unicafe` folder:

```
unicafe/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Buttons.jsx
│   │   ├── StatisticLine.jsx
│   │   └── Statistics.jsx
│   ├── store/
│   │   └── useFeedbackStore.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

All course materials for the Unicafe exercises **1.** and **2.** are located inside the `unicafe` and `unicafe-tests` folders.

## ✅ Exercises Overview

During the development of the project in the State Management part, the following tasks were performed.

### 1: Unicafe revisited

- Created a new version of the Unicafe exercise from Part 1 in the `unicafe` directory.
- Moved the application's state management to Zustand: the counters live in a single store instead of `useState` hooks in the root component.
- Implemented the full original functionality of the application:
  - three buttons (`good`, `neutral`, `bad`) that register feedback,
  - the number of each feedback type,
  - the total number of feedback entries (`all`),
  - the average score (`good = +1`, `neutral = 0`, `bad = -1`),
  - the percentage of positive feedback (`positive`).
- Split the UI into small reusable components: `Button`, `Buttons`, `StatisticLine` and `Statistics`.
- Added a custom look with Tailwind CSS v4, with a light and a dark theme.

**Example store:**

```js
import { create } from "zustand";

const useFeedbackStore = create((set) => ({
  good: 0,
  neutral: 0,
  bad: 0,

  addGood: () => set((state) => ({ good: state.good + 1 })),
  addNeutral: () => set((state) => ({ neutral: state.neutral + 1 })),
  addBad: () => set((state) => ({ bad: state.bad + 1 })),
}));

export default useFeedbackStore;
```

**Example component logic (simplified):**

```jsx
const Buttons = () => {
  const addGood = useFeedbackStore((state) => state.addGood)
  const addNeutral = useFeedbackStore((state) => state.addNeutral)
  const addBad = useFeedbackStore((state) => state.addBad)

  return (
    <div>
      <Button text="good" onClick={addGood} />
      <Button text="neutral" onClick={addNeutral} />
      <Button text="bad" onClick={addBad} />
    </div>
  );
};
```

Each component subscribes only to the part of the store it needs, so the components stay small and re-render only when their data changes.

### 2: Running tests

- Ran the Playwright tests from the `unicafe-tests` folder against the application.
- Fixed the application so that all tests pass:
  - the statistics table is always visible and shows zeros before any feedback is given,
  - the values are rounded to at most two decimal places without trailing zeros (e.g. `0.25` and `50 %`).
- Enabled the GitHub Actions workflow `.github/workflows/unicafe-tests.yaml` so that the tests run on every push to `main`:

```yaml
name: Unicafe tests
on:
  push:
    branches: [main]
```

## 💻 Installation and Running

Follow these steps to run the project locally:

1. Clone the repository:

```bash
git clone https://github.com/realNormanik/full-stack-open-state-management.git
```

2. Navigate to the application directory:

```bash
cd full-stack-open-state-management/unicafe
```

3. Install the dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

The application is available at [http://localhost:5173](http://localhost:5173).

### Running the tests

The Playwright tests expect the application to be running (see the step above). In a second terminal:

```bash
cd unicafe-tests
npm install
npx playwright install chromium
npm test
```

## 🚀 Demo

You can view a working version of the project here:
👉 [Vercel]()

## 🧠 Notes

- Zustand needs no providers or reducers: the store is a hook, and actions are plain functions that call `set`.
- State updates use the functional form of `set`, which always works on the latest state.
- The average and the positive percentage are derived from the store values during rendering instead of being stored, so there is only one source of truth.
- Styles are kept in `src/index.css`: design tokens in `@theme`, the dark theme via `prefers-color-scheme`, element styles in `@layer base` and reusable classes as `@utility`.
- Avoid committing the `node_modules` directory.