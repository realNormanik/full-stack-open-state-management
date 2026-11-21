// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";

import AnecdoteList from "./AnecdoteList";
import Filter from "./Filter";
import { useAnecdoteStore } from "../store";

// Deliberately NOT sorted by votes, so sorting actually has something to prove.
const unsortedAnecdotes = [
  { content: "Make it work, then make it fast", id: "5", votes: 0 },
  { content: "There are two hard things in computer science", id: "4", votes: 1 },
  { content: "Untested code is broken code", id: "3", votes: 3 },
  { content: "Simplicity is the ultimate sophistication", id: "2", votes: 5 },
  { content: "Real artists ship code", id: "1", votes: 7 },
];

const contents = unsortedAnecdotes.map((a) => a.content);

const displayedContents = () =>
  screen
    .queryAllByText((text) => contents.includes(text))
    .map((element) => element.textContent);

describe("AnecdoteList", () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: unsortedAnecdotes, filter: "" });
  });

  afterEach(() => {
    cleanup();
  });

  it("displays the anecdotes from the store sorted by votes, descending", () => {
    render(<AnecdoteList />)

    const displayed = screen
      .getAllByText((text) => contents.includes(text))
      .map((element) => element.textContent);

    const expected = [...unsortedAnecdotes]
      .sort((a, b) => b.votes - a.votes)
      .map((a) => a.content);

    expect(displayed).toEqual(expected);
    expect(displayed[0]).toBe("Real artists ship code");
    expect(displayed[displayed.length - 1]).toBe("Make it work, then make it fast");
  });

  it("does not mutate the order of the anecdotes kept in the store", () => {
    render(<AnecdoteList />);

    expect(useAnecdoteStore.getState().anecdotes).toEqual(unsortedAnecdotes);
  });
});

describe("AnecdoteList filtering", () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: unsortedAnecdotes, filter: "" });
  });

  afterEach(() => {
    cleanup();
  });

  it("displays only the anecdotes matching the filter from the store, still sorted by votes", () => {
    useAnecdoteStore.setState({ filter: "code" });
    render(<AnecdoteList />);

    expect(displayedContents()).toEqual([
      "Real artists ship code", // 7 votes
      "Untested code is broken code", // 3 votes
    ]);
  });

  it("filtering ignores letter case", () => {
    useAnecdoteStore.setState({ filter: "SIMPLICITY" });
    render(<AnecdoteList />);

    expect(displayedContents()).toEqual([
      "Simplicity is the ultimate sophistication",
    ]);
  });

  it("displays no anecdotes when nothing matches the filter", () => {
    useAnecdoteStore.setState({ filter: "no such anecdote" });
    render(<AnecdoteList />);

    expect(displayedContents()).toEqual([]);
  });

  it("does not remove filtered-out anecdotes from the store", () => {
    useAnecdoteStore.setState({ filter: "code" });
    render(<AnecdoteList />);

    expect(useAnecdoteStore.getState().anecdotes).toEqual(unsortedAnecdotes);
  });

  it("typing in the Filter component narrows the list shown by AnecdoteList", () => {
    render(
      <>
        <Filter />
        <AnecdoteList />
      </>
    );
    expect(displayedContents()).toHaveLength(unsortedAnecdotes.length);

    fireEvent.change(screen.getByTestId("filter"), {
      target: { value: "two hard" },
    });

    expect(useAnecdoteStore.getState().filter).toBe("two hard");
    expect(displayedContents()).toEqual([
      "There are two hard things in computer science",
    ]);

    fireEvent.change(screen.getByTestId("filter"), { target: { value: "" } });

    expect(displayedContents()).toHaveLength(unsortedAnecdotes.length);
  });
});

describe("AnecdoteList voting", () => {
  // The row that wraps one anecdote"s content and its "has N / vote" line.
  const rowOf = (content) => screen.getByText(content).parentElement;

  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: unsortedAnecdotes, filter: "" });
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url, options) => ({
        ok: true,
        json: async () => JSON.parse(options.body),
      })),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("clicking vote increases the number of votes shown for that anecdote by one", async () => {
    render(<AnecdoteList />);
    const content = "Untested code is broken code";
    expect(within(rowOf(content)).getByText("has 3")).toBeTruthy();

    fireEvent.click(within(rowOf(content)).getByRole("button", { name: "vote" }));

    await waitFor(() =>
      expect(within(rowOf(content)).getByText("has 4")).toBeTruthy(),
    );
    expect(
      useAnecdoteStore.getState().anecdotes.find((a) => a.id === "3").votes,
    ).toBe(4);
    expect(within(rowOf("Real artists ship code")).getByText("has 7")).toBeTruthy();
  });

  it("an anecdote that gets enough votes moves up in the list", async () => {
    render(<AnecdoteList />);
    const content = "Untested code is broken code";
    // 3 votes: ranks below "Simplicity..." (5 votes) before voting
    expect(displayedContents().indexOf(content)).toBe(2);

    for (let i = 0; i < 3; i++) {
      fireEvent.click(within(rowOf(content)).getByRole("button", { name: "vote" }));
      await waitFor(() =>
        expect(within(rowOf(content)).getByText(`has ${4 + i}`)).toBeTruthy(),
      );
    };

    // now 6 votes: above "Simplicity..." (5 votes)
    expect(displayedContents().indexOf(content)).toBe(1);
  });
});
