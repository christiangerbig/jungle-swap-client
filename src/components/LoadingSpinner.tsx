type LoadingSpinnerProps = {
  spinnerText: string;
};

const LoadingSpinner = ({ spinnerText }: LoadingSpinnerProps): JSX.Element => {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <div
        className="spinner-grow text-success m-3 loadingSpinner"
        role="status"
      ></div>
      <div className="loadingSpinnerText">
        <span> {spinnerText} </span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
