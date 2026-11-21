import Button from "./Button";
import useFeedbackStore from "../store/useFeedbackStore";

const Buttons = () => {
  const addGood = useFeedbackStore((state) => state.addGood);
  const addNeutral = useFeedbackStore((state) => state.addNeutral);
  const addBad = useFeedbackStore((state) => state.addBad);

  return (
    <div className="stack">
      <h2>give feedback</h2>
      <p className="text-sm text-white/70">Pick the option that fits best.</p>
      <div className="stack mt-2">
        <Button text="good" tone="good" onClick={addGood} />
        <Button text="neutral" tone="neutral" onClick={addNeutral} />
        <Button text="bad" tone="bad" onClick={addBad} />
      </div>
    </div>
  );
};

export default Buttons;
