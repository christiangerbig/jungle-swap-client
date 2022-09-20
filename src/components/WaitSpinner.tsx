const WaitSpinner = (): JSX.Element => {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <div role="status" className="spinner-border m-3 loading-wait-spinner" />
    </div>
  );
};

export default WaitSpinner;
