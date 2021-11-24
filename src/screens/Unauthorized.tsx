const Unauthorized = (): JSX.Element => {
  return (
    <div className="notFound">
      <div>
        <h2>
          Oh-oh! <br /> <br />
          We think you got lost in the jungle!
        </h2>
        <h3> 401 Unauthorized </h3>
      </div>
    </div>
  );
};

export default Unauthorized;
