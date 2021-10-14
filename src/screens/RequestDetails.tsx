import { useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import {
  readRequest,
  User,
  Plant,
  Request,
  setRequest,
  updateRequest,
  decreaseAmountOfRequests,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const RequestDetails = () => {
  const request = useSelector((state: RootState) => state.jungleSwap.request);
  const { requestId }: any = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  // Read request and scroll to top as soon as page loads
  useEffect(() => {
    dispatch(readRequest(requestId));
    scroll.scrollToTop();
  }, []);

  const { _id, buyer, plant, message, reply } = request as Request;
  if (!buyer || !plant)
    return (
      <div className="spinner-grow text-success m-5" role="status">
        <span className="visually-hidden">
          <br /> <br /> Loading request...
        </span>
      </div>
    );

  const handleSetRequestInactive = (request: Request, history: any) => {
    const cloneRequest: Request = JSON.parse(JSON.stringify(request));
    cloneRequest.requestState = false;
    dispatch(setRequest(cloneRequest));
    const { _id, buyer, seller, plant, message, reply, requestState } = cloneRequest;
    const updatedRequest: Request = {
      buyer,
      seller,
      plant,
      message,
      reply,
      requestState,
    };
    dispatch(updateRequest({ requestId: _id, updatedRequest}));
    dispatch(decreaseAmountOfRequests());
    history.push("/requests/fetch");
  };

  return (
    <div className="container row mt-5 ">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-5"> Request for {(plant as Plant).name} </h2>
        <h5> by {(buyer as User).username} </h5>
        <p className="form-control"> {message} </p>
        {reply && (
          <div>
            <h5> Your reply </h5>
            <p className="form-control"> {reply} </p>
          </div>
        )}
        <div className="text-right px-3">
          {!reply && (
            <Link to={`/requests/update/${_id}`}>
              <button className="btn btn-sm ml-2 smallWidth form-control mb-1">
                Reply
              </button>
            </Link>
          )}
          <button
            className="btn btn-sm ml-2 smallWidth form-control mb-1"
            onClick={() => handleSetRequestInactive(request, history)}
          >
            Done
          </button>
        </div>
        <div className="text-right px-3">
          <Link to={"/requests/fetch"} onClick={scroll.scrollToTop}>
            <button className="btn btn-sm mt-4 smallWidth form-control">
              Go back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
