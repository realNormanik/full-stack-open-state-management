import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { useAnecdoteStore } from "./store";

const backendAnecdotes = [
  { content: "Make it work, then make it fast", id: "5", votes: 0 },
  { content: "Untested code is broken code", id: "3", votes: 3 },
  { content: "Real artists ship code", id: "1", votes: 7 },
];

describe("anecdote store initialization", () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [] })
  });

  afterEach(() => {
    vi.unstubAllGlobals()
  });

  it("state is initialized with the anecdotes returned by the backend", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => backendAnecdotes,
    });
    vi.stubGlobal("fetch", fetchMock);

    expect(useAnecdoteStore.getState().anecdotes).toEqual([]);

    await useAnecdoteStore.getState().actions.initialize();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3001/anecdotes");
    expect(useAnecdoteStore.getState().anecdotes).toEqual(backendAnecdotes);
  });

  it("state stays empty when the backend request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(
      useAnecdoteStore.getState().actions.initialize(),
    ).rejects.toThrow("Failed to fetch anecdotes");

    expect(useAnecdoteStore.getState().anecdotes).toEqual([]);
  });
});

describe("voting in the anecdote store", () => {
  // The backend echoes back whatever anecdote was sent in the PUT request.
  const echoBackend = () =>
    vi.fn(async (url, options) => ({
      ok: true,
      json: async () => JSON.parse(options.body),
    }));

  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: backendAnecdotes });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("voting increases the number of votes of the voted anecdote by one", async () => {
    const fetchMock = echoBackend();
    vi.stubGlobal("fetch", fetchMock);

    await useAnecdoteStore.getState().actions.vote("3");

    const anecdotes = useAnecdoteStore.getState().anecdotes;
    expect(anecdotes.find((a) => a.id === "3").votes).toBe(4);
  });

  it("voting does not change the votes of other anecdotes", async () => {
    vi.stubGlobal("fetch", echoBackend());

    await useAnecdoteStore.getState().actions.vote("3");

    const anecdotes = useAnecdoteStore.getState().anecdotes;
    expect(anecdotes.find((a) => a.id === "5").votes).toBe(0);
    expect(anecdotes.find((a) => a.id === "1").votes).toBe(7);
    expect(anecdotes).toHaveLength(backendAnecdotes.length);
  });

  it("voting saves the increased number of votes to the backend", async () => {
    const fetchMock = echoBackend();
    vi.stubGlobal("fetch", fetchMock);

    await useAnecdoteStore.getState().actions.vote("3");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("http://localhost:3001/anecdotes/3");
    expect(options.method).toBe("PUT");
    expect(JSON.parse(options.body)).toEqual({
      content: "Untested code is broken code",
      id: "3",
      votes: 4,
    });
  });

  it("votes are not increased when saving to the backend fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(
      useAnecdoteStore.getState().actions.vote("3"),
    ).rejects.toThrow("Failed to update anecdote");

    expect(useAnecdoteStore.getState().anecdotes).toEqual(backendAnecdotes);
  });
});
