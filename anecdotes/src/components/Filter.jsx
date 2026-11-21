import { useAnecdoteActions } from "../store";

const Filter = () => {
  const { setFilter } = useAnecdoteActions();

  const handleChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <label className="search">
      <span className="sr-only">Filter</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="9" r="5.5" />
        <path d="M13.5 13.5 17 17" />
      </svg>
      <input
        className="field"
        placeholder="Filter the list"
        autoComplete="off"
        onChange={handleChange}
        data-testid="filter"
      />
    </label>
  );
};

export default Filter;
