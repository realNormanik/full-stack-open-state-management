import StatisticLine from "./StatisticLine";
import useFeedbackStore from "../store/useFeedbackStore";

// Rounds to at most 2 decimal places without trailing zeros (0.25, 50, 0)
const round = (value) => Math.round(value * 100) / 100;

const Statistics = () => {
  const good = useFeedbackStore((state) => state.good);
  const neutral = useFeedbackStore((state) => state.neutral);
  const bad = useFeedbackStore((state) => state.bad);

  const all = good + neutral + bad;
  const average = all === 0 ? 0 : (good - bad) / all;
  const positive = all === 0 ? 0 : (good / all) * 100;

  const share = (count) => (all === 0 ? 0 : (count / all) * 100);

  return (
    <div className="stack">
      <h2>statistics</h2>
      <div className="meter my-2" aria-hidden="true">
        <span data-tone="good" style={{ width: `${share(good)}%` }} />
        <span data-tone="neutral" style={{ width: `${share(neutral)}%` }} />
        <span data-tone="bad" style={{ width: `${share(bad)}%` }} />
      </div>
      <table className="data-table">
        <tbody>
          <StatisticLine text="good" tone="good" value={good} />
          <StatisticLine text="neutral" tone="neutral" value={neutral} />
          <StatisticLine text="bad" tone="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={round(average)} />
          <StatisticLine text="positive" value={`${round(positive)} %`} />
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;
