import React, { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import {
  fetchAllRequests,
  setIsNewRequest,
  User,
  Plant,
  Request,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const RequestsPage: React.FC = () => {
  const loggedInUser = useSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const isUserChange = useSelector(
    (state: RootState) => state.jungleSwap.isUserChange
  );
  const requests = useSelector((state: RootState) => state.jungleSwap.requests);
  const amountOfRequests = useSelector(
    (state: RootState) => state.jungleSwap.amountOfRequests
  );
  const dispatch = useDispatch();

  // Fetch all requests and reset values as soon as page loads and reset values during cleanup
  useEffect(() => {
    const handleResetAll = () => {
      dispatch(setIsNewRequest(false));
      scroll.scrollToTop();
    };

    dispatch(fetchAllRequests(isUserChange));
    handleResetAll();
    return () => handleResetAll();
  }, []);

  if (!loggedInUser) return <Redirect to={"/signup"} />;

  if (!requests)
    return (
      <div className="spinner-grow text-success m-5" role="status">
        <span className="visually-hidden">
          <br /> <br /> Loading requests...
        </span>
      </div>
    );

  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2> Your messages </h2>
        <h3 className="mb-4"> [{amountOfRequests}] </h3>
        <Link to={"/"}>
          <button className="btn btn-sm mt-4"> Go back </button>
        </Link>
        {requests.map(({ _id, buyer, seller, plant }: Request) => {
          return (
            (seller as User)._id === loggedInUser._id && (
              <div className="card p-3 mt-4 " key={_id}>
                <h4> Request for: {(plant as Plant).name} </h4>
                <h5> by: {(buyer as User).username} </h5>
                <div>
                  <Link
                    className="btn btn-outline-dark"
                    to={`/requests/read/${_id}`}
                  >
                    Details
                  </Link>
                </div>
              </div>
            )
          );
        })}
        {amountOfRequests !== 0 && (
          <Link to={"/"}>
            <button className="btn btn-sm mt-4"> Go back </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default RequestsPage;
