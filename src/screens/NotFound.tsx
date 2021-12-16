import { Link } from "react-router-dom";

const NotFound = (): JSX.Element => {
  return (
    <div className="notFound">
      <div>
        <h1> Oh-oh! </h1>
        <h2> We think you got lost in the jungle! </h2>
        <h3> 404 Not Found </h3>
        <Link to={"/"}>
          <button className="btn btn-sm ml-2 smallWidth form-control">
            Take me home{" "}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
