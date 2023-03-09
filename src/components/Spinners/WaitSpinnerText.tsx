import WaitSpinner from "./WaitSpinner";

interface WaitSpinnerTextProps {
  text: string;
}

const WaitSpinnerText = ({ text }: WaitSpinnerTextProps): JSX.Element => {
  return (
    <div className="container d-flex align-items-center justify-content-center mt-5">
      <WaitSpinner />
      <span className="font-weight-bold">{text}</span>
    </div>
  );
};

export default WaitSpinnerText;
