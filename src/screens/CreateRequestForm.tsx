import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import {
  createRequest,
  setError,
  Plant,
  Request,
  User,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const CreateRequestForm = () => {
  const plant = useSelector((state: RootState) => state.jungleSwap.plant);
  const error = useSelector((state: RootState) => state.jungleSwap.error);
  const dispatch = useDispatch();
  const history = useHistory();

  // Set variable and scroll to top as soon as page loads
  useEffect(() => {
    dispatch(setError(null));
    scroll.scrollToTop();
  }, []);

  // Create request
  const handleCreateRequest = (event: any, plant: Plant, history: any) => {
    event.preventDefault();
    const { message } = event.target;
    const { creator } = plant;
    const newRequest: Request = {
      seller: (creator as User)._id,
      plant: plant._id,
      message: message.value,
    };
    dispatch(createRequest({ newRequest, history }));
  };

  const { _id, name } = plant as Plant;
  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-4"> Your message </h2>
        <h3 className="mb-4"> for: {name} </h3>
        <form onSubmit={(event) => handleCreateRequest(event, plant, history)}>
          <div>
            <textarea
              className="mb-4 form-control"
              name="message"
              cols={35}
              rows={7}
            />
          </div>
          {error && <p className="warningColor"> {error} </p>}
          <div className="text-right">
            <button
              className="btn btn-sm mx-2 form-control smallWidth"
              type="submit"
            >
              Send
            </button>
            <Link to={`/plants/read/${_id}`}>
              <button className="btn btn-sm mx-2 form-control smallWidth">
                Go back
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestForm;
