import Button from './Button'
import useFeedbackStore from '../store/useFeedbackStore'

const Buttons = () => {
  const addGood = useFeedbackStore((state) => state.addGood)
  const addNeutral = useFeedbackStore((state) => state.addNeutral)
  const addBad = useFeedbackStore((state) => state.addBad)

  return (
    <div>
      <h2>give feedback</h2>
      <Button text="good" onClick={addGood} />
      <Button text="neutral" onClick={addNeutral} />
      <Button text="bad" onClick={addBad} />
    </div>
  )
}

export default Buttons
