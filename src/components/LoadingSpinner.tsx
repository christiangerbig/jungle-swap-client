type LoadingSpinnerProps = {
  spinnerText: string;
};

const LoadingSpinner = ({ spinnerText }: LoadingSpinnerProps): JSX.Element => {
  return (
    <div
      className="spinner-grow text-success mt-5 loadingSpinner"
      role="status"
    >
      <span className="visually-hidden">
        <br /> <br /> {spinnerText}
      </span>
    </div>
  );
};

export default LoadingSpinner;
