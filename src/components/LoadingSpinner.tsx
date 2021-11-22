const LoadingSpinner = (): JSX.Element => {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <div
        className="spinner-border m-3"
        role="status"
      ></div>
    </div>
  );
};

export default LoadingSpinner;
