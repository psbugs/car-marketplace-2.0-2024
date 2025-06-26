const SuccessMessageTextBox = ({ primaryText, secondaryTextLines }) => {
  return (
    <div>
      <span className="font-bold capitalize">{primaryText}</span>
      <br />
      {secondaryTextLines?.map((text, index) => (
        <span key={index}>
          {text}
          <br />
        </span>
      ))}
    </div>
  );
};
export default SuccessMessageTextBox;
