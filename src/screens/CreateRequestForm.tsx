import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Link, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  createMessage,
  setError,
  Plant,
  Message,
  User,
  addMessage,
  readUser,
  setLoggedInUser,
  setIsFetchingUser,
} from "../reducer/jungleSwapSlice";
import { RootState } from "../store";

const CreateRequestForm = () => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const plant = useAppSelector((state: RootState) => state.jungleSwap.plant);
  const error = useAppSelector((state: RootState) => state.jungleSwap.error);
  const dispatch = useAppDispatch();
  const history = useHistory();

  // Set variable and scroll to top as soon as page loads
  useEffect(() => {
    dispatch(setError(null));
    scroll.scrollToTop();
    dispatch(readUser())
      .unwrap()
      .then((user) => {
        dispatch(setLoggedInUser(user));
        dispatch(setIsFetchingUser(false));
      })
      .catch((rejectedValue: any) => {
        dispatch(setIsFetchingUser(false));
        console.log(rejectedValue.message);
      });
  }, []);

  if (!loggedInUser) {
    return <Redirect to={"/unauthorized"} />;
  }

  // Create request
  const handleCreateMessage = (event: any, plant: Plant) => {
    event.preventDefault();
    const { request } = event.target;
    const { _id, creator } = plant;
    const newMessage: Message = {
      seller: (creator as User)._id,
      plant: _id,
      request: request.value,
    };
    dispatch(createMessage(newMessage))
      .unwrap()
      .then((newMessage) => {
        dispatch(addMessage(newMessage));
        history.push(`/plants/read/${newMessage.plant}`);
      })
      .catch((rejectedValue: any) => {
        dispatch(setError(rejectedValue.message));
      });
  };

  const { _id, name } = plant as Plant;
  return (
    <div className="container row mt-5">
      <div className="mt-5 col-11 col-md-5 offset-1 offset-md-5">
        <h2 className="mb-4"> Your message </h2>
        <h3 className="mb-4"> for {name} </h3>
        <form
          className="pl-0"
          onSubmit={(event) => {
            handleCreateMessage(event, plant);
          }}
        >
          <div>
            <textarea
              className="mb-4 form-control"
              name="request"
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
