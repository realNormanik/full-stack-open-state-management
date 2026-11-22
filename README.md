# Full Stack Open – State Management Module

This document provides a summary of my learning experience while completing the **[State Management Module](https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-state-management)** of the **[Full Stack Open](https://fullstackopen.com/en/)** course offered by the University of Helsinki. The module focuses on managing application state in modern React applications using Zustand, TanStack Query, and the React Context API. Through hands-on exercises and practical projects, I gained experience in designing client-side state, synchronizing it with a backend, and testing state-driven applications.

## 📚 Course Overview

The State Management module covers the following topics:

- **Client-side State with Zustand**: Creating stores, reading and updating state, and keeping state immutable.
- **Communicating with the Backend**: Fetching and saving data from a JSON Server backend using the Fetch API and synchronizing it with the application state.
- **Separate Stores for Separate Concerns**: Splitting state into multiple stores, such as application data and notifications.
- **Server State with TanStack Query**: Retrieving, creating, and updating server data with queries and mutations, including caching and automatic refetching.
- **Context API**: Sharing state between components without prop drilling.
- **Custom Hooks**: Encapsulating state management logic into reusable hooks.
- **Testing State Management**: Writing tests for stores and components, and running end-to-end tests with Playwright.
- **Continuous Integration**: Running automated tests on every push using GitHub Actions.

## 🧠 Skills and Knowledge Acquired

### 🐻 State Management with Zustand

- Re-implemented the Unicafe feedback application using a Zustand store.
- Created stores holding both state and the actions that modify it.
- Updated state immutably, for example by using `Array.toSorted` instead of sorting the original array.
- Selected only the needed parts of the store inside components.
- Created a separate store for notifications so it could be reused across the application.

### 🌐 Synchronizing State with the Backend

- Fetched initial application data from a JSON Server backend when the application starts.
- Used the Fetch API to create, update, and delete resources.
- Kept the Zustand store consistent with the data saved on the server.
- Persisted votes and newly created items in the backend.
- Implemented deletion of items that meet a specific condition (anecdotes with zero votes).

### 🔎 Component Structure and Derived State

- Split the application into focused components such as `AnecdoteForm`, `AnecdoteList`, `Filter`, and `Notification`.
- Implemented filtering of displayed data based on user input.
- Kept lists sorted by number of votes.
- Displayed time-limited notifications (five seconds) triggered by user actions.

### 🔄 Server State with TanStack Query

- Retrieved data from the server using the `useQuery` hook.
- Created and updated data using the `useMutation` hook.
- Invalidated and updated the query cache so that the UI reflects changes automatically.
- Handled loading and error states, including displaying an error page when the server is unavailable.
- Configured query behavior such as retries.
- Extracted TanStack Query logic into custom hooks.

### 🧩 Context API and Custom Hooks

- Implemented notification state management using the React Context API.
- Moved the notification context into its own `NotificationContext.jsx` file.
- Created a custom `useNotify` hook so components do not need to call `useContext` directly.
- Handled error conditions, such as failed POST requests, with notifications in the mutation's error callback.

### 🧪 Testing and Continuous Integration

- Ran end-to-end tests for the applications using Playwright.
- Wrote tests verifying that the store is initialized with data returned by the backend.
- Wrote tests verifying that components receive anecdotes sorted by votes.
- Wrote tests verifying that components receive a correctly filtered list of anecdotes.
- Wrote tests verifying that voting increases the number of votes.
- Verified that the written tests are meaningful using the provided check scripts.
- Enabled and maintained GitHub Actions workflows to run all tests automatically on every push.

### 🛠️ Projects and Exercises

Throughout the module, I completed 28 exercises, including:

- **Unicafe**: Rebuilding the feedback application with Zustand.
- **Anecdotes (Zustand)**: Voting, adding, filtering, sorting, and deleting anecdotes, with data stored in a JSON Server backend and notifications handled by a dedicated store.
- **Anecdotes (TanStack Query)**: Fetching, creating, and voting for anecdotes, with error handling and custom hooks.
- **Notifications with Context API**: Displaying success and error notifications using a context and the `useNotify` hook.
- **Tests**: Writing store and component tests, running Playwright tests locally, and passing all workflows on GitHub.

## 📜 Certificate of Completion

By successfully completing the State Management module of the Full Stack Open course, I have earned the following certificate from the University of Helsinki:

**State Management Module Certificate**: [View Certificate](https://courses.mooc.fi/certificates/validate/5v6aq42us2j6xiu)

## 🎓 ECTS Credits

The State Management module is part of the Full Stack Open course offered by the University of Helsinki. The course provides opportunities to earn ECTS (European Credit Transfer and Accumulation System) credits through completed exercises and examinations.

The State Management module contributes to the overall Full Stack Open curriculum, which offers university-level credits upon meeting the applicable course requirements. Detailed information about ECTS credits, enrollment, and examination requirements is available in the [Full Stack Open course materials](https://fullstackopen.com/en/).

## 📌 Conclusion

Completing the State Management module has strengthened my understanding of how to organize and maintain state in modern React applications. Through practical exercises, I gained hands-on experience in managing client-side state with Zustand, handling server state with TanStack Query, sharing state with the Context API, and verifying application behavior with automated tests and continuous integration.

The knowledge acquired throughout this module has provided me with a solid foundation for building maintainable, data-driven web applications with clear and predictable state management.