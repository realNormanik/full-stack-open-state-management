import StatisticLine from './StatisticLine'
import useFeedbackStore from '../store/useFeedbackStore'

// Rounds to at most 2 decimal places without trailing zeros (0.25, 50, 0)
const round = (value) => Math.round(value * 100) / 100

const Statistics = () => {
  const good = useFeedbackStore((state) => state.good)
  const neutral = useFeedbackStore((state) => state.neutral)
  const bad = useFeedbackStore((state) => state.bad)

  const all = good + neutral + bad
  const average = all === 0 ? 0 : (good - bad) / all
  const positive = all === 0 ? 0 : (good / all) * 100

  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={round(average)} />
          <StatisticLine text="positive" value={`${round(positive)} %`} />
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
