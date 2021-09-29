import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import { setRequest, updateRequest, Request } from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const UpdateRequestForm = () => {
  const request = useSelector((state: RootState) => state.jungleSwap.request);
  const dispatch = useDispatch();
  const history = useHistory();

  // Scroll to top as soon as page loads
  useEffect(() => scroll.scrollToTop(), []);

  // Create reply
  const handleCreateReply = ({ target }: any, request: Request) => {
    const cloneRequest: Request = JSON.parse(JSON.stringify(request));
    cloneRequest.reply = target.value;
    dispatch(setRequest(cloneRequest));
  };

  // Update request
  const handleUpdateRequest = (
    { _id, buyer, seller, plant, message, reply }: Request,
    history: any
  ) => {
    const updatedRequest: Request = {
      buyer,
      seller,
      plant,
      message,
      reply,
    };
    dispatch(updateRequest({ requestId: _id, updatedRequest, history }));
  };

  const { _id, message } = request as Request;
  return (
    <div className="container row mt-5 ">
      <div className="mt-2 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mt-5 mb-4"> Reply your request </h2>
        <div className="card cardSmallWidth mb-5">
          <div className="card-body">
            <p> {message} </p>
            <textarea
              className="mb-4 form-control"
              name="reply"
              cols={31}
              rows={6}
              placeholder="Your reply"
              onChange={(event) => handleCreateReply(event, request)}
            />
            <div className="row justify-content-end px-3">
              <button
                className="btn btn-sm smallWidth form-control mr-3 mb-2"
                onClick={() => handleUpdateRequest(request, history)}
              >
                Submit
              </button>
              <Link to={`/requests/read/${_id}`}>
                <button className="btn btn-sm form-control mb-2">
                  Go back
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRequestForm;
