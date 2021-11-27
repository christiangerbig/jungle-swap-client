import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Link, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  checkUserLoggedIn,
  setLoggedInUser,
  setIsCreatingMessage,
  createMessage,
  addMessage,
  setError,
} from "../reducer/jungleSwapSlice";
import { User, Plant, Message } from "../reducer/typeDefinitions";
import { RootState } from "../store";

const CreateRequestForm = () => {
  const loggedInUser = useAppSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const plant = useAppSelector((state: RootState) => state.jungleSwap.plant);
  const isCreatingMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.isCreatingMessage
  );
  const error = useAppSelector((state: RootState) => state.jungleSwap.error);
  const dispatch = useAppDispatch();
  const history = useHistory();

  // Set variable and scroll to top as soon as page loads if the user is logged in
  useEffect(() => {
    dispatch(checkUserLoggedIn())
      .unwrap()
      .then((user) => {
        dispatch(setLoggedInUser(user));
        dispatch(setError(null));
        scroll.scrollToTop();
      })
      .catch((rejectedValue: any) => {
        console.log(rejectedValue.message);
      });
  }, []);

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
    dispatch(setIsCreatingMessage(true));
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

  if (!loggedInUser) {
    return <Redirect to={"/auth/unauthorized"} />;
  }
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
              disabled={isCreatingMessage ? true : false}
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
