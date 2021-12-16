const Unauthorized = (): JSX.Element => {
  return (
    <div className="unauthorized">
      <div>
        <h1> Oh-oh! </h1>
        <h2> We think you got lost in the jungle! </h2>
        <h3> 401 Unauthorized </h3>
      </div>
    </div>
  );
};

export default Unauthorized;
