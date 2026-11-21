const StatisticLine = ({ text, value, tone }) => (
  <tr>
    <td>
      {tone && <span className="dot" data-tone={tone} aria-hidden="true" />}
      {text}
    </td>
    <td>{value}</td>
  </tr>
);

export default StatisticLine;
