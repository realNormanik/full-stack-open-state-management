const Button = ({ text, tone, onClick }) => (
  <button className="vote" data-tone={tone} onClick={onClick}>
    {text}
  </button>
);

export default Button;
