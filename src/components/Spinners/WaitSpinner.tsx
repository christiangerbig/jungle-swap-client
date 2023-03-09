const WaitSpinner = (): JSX.Element => {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <div role="status" className="[ wait-spinner ] [ spinner-border m-3 ]" />
    </div>
  );
};

export default WaitSpinner;
